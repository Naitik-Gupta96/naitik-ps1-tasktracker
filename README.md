# Naitik PS-I Task Tracker

A full-stack personal task tracker built for the KVGAI PS-I 2026 evaluation project.

## Stack

- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite

## Repo structure

```text
naitik-ps1-tasktracker/
├── backend/
└── frontend/
```

## Local setup

### Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Available endpoints

- `GET /health`
- `GET /tasks`
- `POST /tasks`

## Next steps

- Add `PATCH /tasks/{id}` and `DELETE /tasks/{id}`
- Add filtering and better loading/error states
- Add final UI based on the next design pass
