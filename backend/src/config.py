import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    db_url = os.getenv("DATABASE_URL", "sqlite:///app.db")
    flask_env = os.getenv("FLASK_ENV", "production")
