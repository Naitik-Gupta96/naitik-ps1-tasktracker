# TaskFlow

TaskFlow is a personal task tracker built as a full-stack web application for managing day-to-day work in a clean, focused interface. It supports account creation, login, Google authentication, password reset by email, task CRUD operations, profile management, and a protected dashboard with basic stats.

## Live Links

- Frontend: `https://personal-task-tracker.up.railway.app`
- Backend health: `https://personal-task-tracker-backend.up.railway.app/health`
- Backend docs: `https://personal-task-tracker-backend.up.railway.app/docs`

## What It Does

- Lets users create an account with email and password
- Supports Google sign in and Google sign up
- Supports forgot password and reset password by email
- Provides a protected dashboard to create, edit, update, and delete tasks
- Shows task stats such as total tasks, completed tasks, completion rate, and in-progress count
- Includes profile editing and password change inside the app

## Features

- JWT-based authentication with protected routes
- Google OAuth sign in and sign up
- Email-based password reset flow
- Task creation, listing, editing, status updates, and deletion
- Dashboard stats summary
- Profile management
- Slide-out sidebar navigation
- Responsive layout for desktop and mobile
- Loading states and readable error handling

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, React Router, Zustand, Axios
- Auth: JWT, Google Identity Services
- Email: Gmail SMTP for password reset
- Deployment: Railway

## Screenshots

Add screenshots here before final submission.

Suggested screenshots:

1. Landing or Login screen
   Show the clean public auth entry screen with Google sign in visible.

2. Register screen
   Show account creation form and Google sign up option.

3. Dashboard with tasks
   Show stats cards, sidebar drawer, search/filter bar, and multiple task cards.

4. Task modal
   Show the create or edit task modal open.

5. Profile screen
   Show profile details, avatar section, and change password form.

6. Forgot password / reset password
   Show the password reset request screen or the reset-password form.

7. Mobile view
   Show the responsive dashboard or auth page on a narrow screen.

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

Optional backend environment variables used by the app:

```text
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
APP_URL=http://localhost:5173
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Frontend runs on `http://localhost:5173`.

Optional frontend environment variables:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google/login`
- `POST /auth/google/register`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

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

## Notes

- SQLite is currently used for this evaluation build.
- Gmail SMTP is used for password reset email delivery.
- Existing auth tokens become invalid if `SECRET_KEY` changes.
