from __future__ import annotations

import os
from datetime import date, datetime, timedelta, timezone
from functools import lru_cache

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session

import auth
import mailer
import models
import schemas
from database import Base, engine, get_db


Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API", version="1.0.0")

default_frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
configured_frontend_origins = [
    origin.strip()
    for origin in default_frontend_origin.split(",")
    if origin.strip()
]

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://personal-task-tracker.up.railway.app",
    *configured_frontend_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

PRIORITY_RANK = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "urgent": 4,
}


@lru_cache(maxsize=1)
def get_google_request() -> google_requests.Request:
    return google_requests.Request()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    user_id = auth.decode_access_token(token)
    if not user_id or not user_id.isdigit():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user = db.get(models.User, int(user_id))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    return user


def build_token_response(user: models.User) -> schemas.TokenResponse:
    return schemas.TokenResponse(
        access_token=auth.create_access_token(str(user.id)),
        token_type="bearer",
        user=user,
    )


def get_user_by_email(email: str, db: Session) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email.lower()).first()


def create_google_placeholder_password() -> str:
    return auth.hash_password(f"google-oauth-{datetime.now(timezone.utc).timestamp()}")


def verify_google_credential(credential: str) -> dict:
    raw_google_client_ids = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_ids = [client_id.strip() for client_id in raw_google_client_ids.split(",") if client_id.strip()]
    if not google_client_ids:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google sign-in is not configured")

    payload = None
    for google_client_id in google_client_ids:
        try:
            payload = google_id_token.verify_oauth2_token(credential, get_google_request(), google_client_id)
            break
        except ValueError:
            continue

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential for this environment. Check your Google client ID and system clock.",
        )

    if payload.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google credential")

    if not payload.get("email") or not payload.get("email_verified"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google account email is not verified")

    return payload


def normalize_text(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped or None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "1.0.0"}


@app.post("/auth/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: schemas.UserRegister, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    email = payload.email.lower()
    existing_user = get_user_by_email(email, db)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = models.User(
        email=email,
        hashed_password=auth.hash_password(payload.password),
        full_name=payload.full_name.strip(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return build_token_response(user)


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login_user(payload: schemas.UserLogin, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    email = payload.email.lower()
    user = get_user_by_email(email, db)
    if user is None or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return build_token_response(user)


def upsert_google_profile(user: models.User, google_payload: dict, db: Session) -> models.User:
    updated = False
    if not user.avatar_url and google_payload.get("picture"):
        user.avatar_url = google_payload["picture"]
        updated = True
    if updated:
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@app.post("/auth/google/login", response_model=schemas.TokenResponse)
def login_with_google(payload: schemas.GoogleAuthRequest, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    google_payload = verify_google_credential(payload.credential)
    email = google_payload["email"].lower()
    user = get_user_by_email(email, db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account exists for this Google email. Use Google sign up first.",
        )

    user = upsert_google_profile(user, google_payload, db)
    return build_token_response(user)


@app.post("/auth/google/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register_with_google(payload: schemas.GoogleAuthRequest, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    google_payload = verify_google_credential(payload.credential)
    email = google_payload["email"].lower()
    user = get_user_by_email(email, db)

    if user is not None:
        user = upsert_google_profile(user, google_payload, db)
        return build_token_response(user)

    full_name = (google_payload.get("name") or email.split("@")[0]).strip()
    user = models.User(
        email=email,
        hashed_password=create_google_placeholder_password(),
        full_name=full_name,
        avatar_url=google_payload.get("picture"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return build_token_response(user)


@app.get("/auth/me", response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)) -> models.User:
    return current_user


@app.patch("/users/me", response_model=schemas.UserOut)
def update_me(
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    updates = payload.model_dump(exclude_unset=True)
    if "full_name" in updates:
        current_user.full_name = updates["full_name"].strip()
    if "bio" in updates:
        current_user.bio = normalize_text(updates["bio"])
    if "avatar_url" in updates:
        current_user.avatar_url = normalize_text(updates["avatar_url"])

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@app.patch("/users/me/password")
def update_password(
    payload: schemas.PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> dict[str, str]:
    if not auth.verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    current_user.hashed_password = auth.hash_password(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"message": "Password updated successfully"}


@app.post("/auth/forgot-password", response_model=schemas.MessageResponse)
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)) -> schemas.MessageResponse:
    user = get_user_by_email(payload.email, db)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account exists for this email.")

    if not mailer.mail_is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset email is not configured on the server.",
        )

    reset_token = auth.create_password_reset_token(user.email)

    try:
        mailer.send_password_reset_email(user.email, reset_token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send reset email: {exc}",
        ) from exc

    return schemas.MessageResponse(message="Password reset email sent successfully.")


@app.post("/auth/reset-password", response_model=schemas.MessageResponse)
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)) -> schemas.MessageResponse:
    email = auth.decode_password_reset_token(payload.token)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset link is invalid or expired")

    user = get_user_by_email(email, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset link is invalid or expired")

    user.hashed_password = auth.hash_password(payload.new_password)
    db.add(user)
    db.commit()
    return schemas.MessageResponse(message="Password reset successfully")


@app.get("/tasks", response_model=schemas.TaskListResponse)
def list_tasks(
    status_filter: schemas.TaskStatus | None = Query(default=None, alias="status"),
    priority: schemas.TaskPriority | None = None,
    search: str | None = None,
    due_before: date | None = None,
    due_after: date | None = None,
    overdue: bool | None = None,
    include_deleted: bool = False,
    sort_by: str = "order_index",
    order: str = "asc",
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> schemas.TaskListResponse:
    query = db.query(models.Task).filter(models.Task.user_id == current_user.id)

    if include_deleted:
        pass
    else:
        query = query.filter(models.Task.is_deleted.is_(False))

    if status_filter:
        query = query.filter(models.Task.status == status_filter)
    if priority:
        query = query.filter(models.Task.priority == priority)
    if search:
        like_term = f"%{search.strip()}%"
        query = query.filter(
            or_(models.Task.title.ilike(like_term), models.Task.description.ilike(like_term))
        )
    if due_before:
        query = query.filter(models.Task.due_date <= due_before)
    if due_after:
        query = query.filter(models.Task.due_date >= due_after)
    if overdue:
        query = query.filter(models.Task.due_date < date.today(), models.Task.status != "done")

    total = query.count()

    if sort_by == "priority":
        sort_column = case(PRIORITY_RANK, value=models.Task.priority, else_=0)
    else:
        sort_map = {
            "created_at": models.Task.created_at,
            "updated_at": models.Task.updated_at,
            "due_date": models.Task.due_date,
            "title": models.Task.title,
            "order_index": models.Task.order_index,
        }
        sort_column = sort_map.get(sort_by, models.Task.order_index)

    if order == "desc":
        query = query.order_by(sort_column.desc(), models.Task.created_at.desc())
    else:
        query = query.order_by(sort_column.asc(), models.Task.created_at.desc())

    items = query.offset(offset).limit(limit).all()
    return schemas.TaskListResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + limit < total,
    )


@app.post("/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Task:
    max_order = (
        db.query(func.max(models.Task.order_index))
        .filter(models.Task.user_id == current_user.id, models.Task.is_deleted.is_(False))
        .scalar()
    )
    task = models.Task(
        user_id=current_user.id,
        title=payload.title.strip(),
        description=normalize_text(payload.description),
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        order_index=(max_order or 0) + 1,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_owned_task(task_id: int, current_user: models.User, db: Session) -> models.Task:
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id,
    ).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@app.get("/tasks/{task_id}", response_model=schemas.TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Task:
    return get_owned_task(task_id, current_user, db)


@app.patch("/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(
    task_id: int,
    payload: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Task:
    task = get_owned_task(task_id, current_user, db)
    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        if field in {"title", "description"}:
            setattr(task, field, normalize_text(value) if field == "description" else value.strip())
        else:
            setattr(task, field, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def soft_delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Response:
    task = get_owned_task(task_id, current_user, db)
    task.is_deleted = True
    task.deleted_at = datetime.now(timezone.utc)
    db.add(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/tasks/{task_id}/restore", response_model=schemas.TaskOut)
def restore_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Task:
    task = get_owned_task(task_id, current_user, db)
    task.is_deleted = False
    task.deleted_at = None
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}/permanent", status_code=status.HTTP_204_NO_CONTENT)
def permanent_delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Response:
    task = get_owned_task(task_id, current_user, db)
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/stats", response_model=schemas.StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> schemas.StatsResponse:
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_deleted.is_(False),
    )

    total = tasks.count()
    todo = tasks.filter(models.Task.status == "todo").count()
    in_progress = tasks.filter(models.Task.status == "in_progress").count()
    done = tasks.filter(models.Task.status == "done").count()
    overdue = tasks.filter(models.Task.due_date < date.today(), models.Task.status != "done").count()
    week_start = datetime.now(timezone.utc) - timedelta(days=7)
    completed_this_week = tasks.filter(
        models.Task.status == "done",
        models.Task.updated_at.is_not(None),
        models.Task.updated_at >= week_start,
    ).count()

    by_priority = {
        "low": tasks.filter(models.Task.priority == "low").count(),
        "medium": tasks.filter(models.Task.priority == "medium").count(),
        "high": tasks.filter(models.Task.priority == "high").count(),
        "urgent": tasks.filter(models.Task.priority == "urgent").count(),
    }

    completion_rate = round((done / total) * 100, 1) if total else 0.0

    return schemas.StatsResponse(
        total=total,
        todo=todo,
        in_progress=in_progress,
        done=done,
        overdue=overdue,
        completed_this_week=completed_this_week,
        completion_rate=completion_rate,
        by_priority=by_priority,
    )
