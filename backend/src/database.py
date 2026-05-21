from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from config import *

load_dotenv()

DATABASE_URL = Config.db_url
FLASK_ENV = Config.flask_env

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=Config.flask_env == "development",
)

Base = declarative_base()

# Import models so they're registered with Base before create_all()
from models.user import User
from models.workspace import Workspace

Base.metadata.create_all(bind=engine)

DBSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)

