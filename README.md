# TaskFlow

TaskFlow is a full-stack personal task tracker built to help individual users manage daily work through a clean, focused dashboard. It supports email and password authentication, Google sign in and sign up, password reset by email, task management, profile updates, and a responsive interface designed for both desktop and mobile use.

## Live Demo

- Frontend: https://personal-task-tracker.up.railway.app
- Backend health: https://personal-task-tracker-backend.up.railway.app/health
- Backend docs: https://personal-task-tracker-backend.up.railway.app/docs

## Project Overview

The application is designed around a simple workflow:

- create an account with email and password or continue with Google
- sign in to a protected dashboard
- create, edit, update, and delete personal tasks
- monitor progress with quick dashboard stats
- manage profile details and password securely
- recover access through an email-based password reset flow

## Key Features

- JWT authentication with protected frontend routes
- Google sign in and Google sign up
- forgot password and reset password through email
- task CRUD flow with status and priority support
- dashboard stats for total, completed, completion rate, and in-progress tasks
- profile editing with password change
- slide-out sidebar navigation
- responsive UI for desktop and mobile
- loading and error states across auth and task flows

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, React Router, Zustand, Axios
- Authentication: JWT, Google Identity Services
- Email: Gmail SMTP
- Deployment: Railway

## Demo Access

- You can register a new account directly from the app.
- You can also test Google sign in, Google sign up, and the forgot-password flow from the live deployment.

## Deployment Architecture

- Frontend and backend are deployed as separate Railway services.
- The frontend communicates with the backend through the deployed Railway API URL.
- The backend reads its runtime configuration from Railway environment variables.

## Screenshots

<<<<<<< HEAD
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

=======
### 1. Landing / Login

Public-facing login screen with standard email login and Google sign-in option.

<img width="1919" height="1126" alt="Landing or login screen" src="https://github.com/user-attachments/assets/aae99bc4-3800-4b66-83af-5ca678a73778" />

### 2. Register

Account creation screen with email registration and Google sign-up flow.

<img width="1896" height="1136" alt="Register screen" src="https://github.com/user-attachments/assets/3e7969f6-a583-491c-93c4-ff744a3c40b2" />

### 3. Dashboard

Main task management workspace showing summary cards, filters, and task cards.

<img width="1738" height="974" alt="Dashboard with tasks" src="https://github.com/user-attachments/assets/9240b5fe-9a46-425c-9283-be5216e62090" />

### 4. Task Modal

Create and edit task modal used inside the protected dashboard.

<img width="1893" height="971" alt="Task modal" src="https://github.com/user-attachments/assets/76dbaf10-a393-4cfd-9832-7a796b17c406" />

### 5. Profile

Profile page with user details, avatar section, and password update form.

<img width="1874" height="977" alt="Profile screen" src="https://github.com/user-attachments/assets/b17fd62f-70eb-4192-a32e-999fc1fd7008" />

### 6. Password Reset

Forgot-password / reset-password flow for recovering account access.

<img width="1900" height="885" alt="Forgot password screen" src="https://github.com/user-attachments/assets/8d6c15af-d2ef-4aec-b876-5e5c8301a78c" />

### 7. Mobile View

Responsive mobile layout showing the application working on a narrow screen.

<img width="620" height="1386" alt="Mobile view" src="https://github.com/user-attachments/assets/6df92b91-a10e-47c6-8e5f-b02542f7a7f5" />
>>>>>>> e74e4c8 (Finalize README for submission)

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

Environment variables used by the backend:

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

Environment variables used by the frontend:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## API Summary

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

## Additional Notes

- SQLite is used for local development in this evaluation build.
- The deployed backend reads `DATABASE_URL` from Railway environment variables.
- Gmail SMTP is used for password reset delivery.
- Existing login tokens become invalid if `SECRET_KEY` is changed.
