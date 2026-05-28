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

1. Landing or Login screen
  <img width="1919" height="1126" alt="image" src="https://github.com/user-attachments/assets/aae99bc4-3800-4b66-83af-5ca678a73778" />


2. Register screen
  <img width="1896" height="1136" alt="image" src="https://github.com/user-attachments/assets/3e7969f6-a583-491c-93c4-ff744a3c40b2" />


3. Dashboard with tasks
<img width="1738" height="974" alt="image" src="https://github.com/user-attachments/assets/9240b5fe-9a46-425c-9283-be5216e62090" />


4. Task modal
<img width="1893" height="971" alt="image" src="https://github.com/user-attachments/assets/76dbaf10-a393-4cfd-9832-7a796b17c406" />


5. Profile screen
  <img width="1874" height="977" alt="image" src="https://github.com/user-attachments/assets/b17fd62f-70eb-4192-a32e-999fc1fd7008" />


6. Forgot password / reset password
 <img width="1900" height="885" alt="image" src="https://github.com/user-attachments/assets/8d6c15af-d2ef-4aec-b876-5e5c8301a78c" />


7. Mobile view
<img width="620" height="1386" alt="WhatsApp Image 2026-05-28 at 14 29 40" src="https://github.com/user-attachments/assets/6df92b91-a10e-47c6-8e5f-b02542f7a7f5" />


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
