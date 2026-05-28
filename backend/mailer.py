import os
import smtplib
from email.message import EmailMessage


def mail_is_configured() -> bool:
    required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USERNAME", "SMTP_PASSWORD", "MAIL_FROM", "APP_URL"]
    return all(os.getenv(key) for key in required)


def send_password_reset_email(recipient_email: str, reset_token: str) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    mail_from = os.getenv("MAIL_FROM")
    app_url = os.getenv("APP_URL", "").rstrip("/")

    reset_link = f"{app_url}/reset-password?token={reset_token}"

    message = EmailMessage()
    message["Subject"] = "Reset your TaskFlow password"
    message["From"] = mail_from
    message["To"] = recipient_email
    message.set_content(
        "We received a request to reset your TaskFlow password.\n\n"
        f"Open this link to choose a new password:\n{reset_link}\n\n"
        "If you did not request this, you can ignore this email."
    )

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)
