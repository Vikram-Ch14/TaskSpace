"""
src/database.py
Database engine, session factory, and Base declarative class.

Note: Tables are created via Alembic migrations, NOT via Base.metadata.create_all().
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config import Config


# Engine
engine = create_engine(
    Config.db_url,
    connect_args={"check_same_thread": False},
    echo=Config.flask_env == "development",
)


# Base class for all models
Base = declarative_base()


# Session factory
DBSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)