"""
src/config.py
Application configuration with absolute paths.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


# Path Configuration

# Absolute path to the src/ folder (where this file lives)
SRC_DIR = Path(__file__).resolve().parent

# Instance folder for runtime data (database lives here)
INSTANCE_DIR = SRC_DIR / "instance"
INSTANCE_DIR.mkdir(exist_ok=True)

# Database file - always at: backend/src/instance/app.db
DATABASE_PATH = INSTANCE_DIR / "app.db"


class Config:
    """Application configuration."""
    
    # Database - uses absolute path
    db_url = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{DATABASE_PATH}"
    )
    
    # Environment
    flask_env = os.getenv("FLASK_ENV", "development")
    
    # Security
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")

    workspace_slug = os.getenv("WORKSPACE_SLUG")
    
    # Debug print at startup (helpful while we're setting up)
    if flask_env == "development":
        print(f"[Config] Database file: {DATABASE_PATH}")