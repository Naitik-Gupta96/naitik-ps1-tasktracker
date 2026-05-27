# TaskFlow

Personal task tracker with JWT auth, a protected dashboard, and profile management.

## Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, React Router, Zustand, Axios
- Auth: JWT with `python-jose` and `passlib`

## Features

- Register and log in with JWT authentication
- Protected dashboard with task create, list, update, and delete
- Task stats summary on dashboard
- Profile editing and password change
- Slide-out navigation drawer for dashboard and profile
- Loading and error states for auth and task flows

## Project Structure

```text
naitik-ps1-tasktracker/
|-- backend/
`-- frontend/
```

## Run Locally

### Backend

```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs on `http://127.0.0.1:8000`.

### Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Users

- `PATCH /users/me`
- `PATCH /users/me/password`

### Tasks

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{id}`
- `PATCH /tasks/{id}`
- `DELETE /tasks/{id}`
- `POST /tasks/{id}/restore`
- `DELETE /tasks/{id}/permanent`

### Other

- `GET /stats`
- `GET /health`
