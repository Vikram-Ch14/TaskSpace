import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String, Index
from sqlalchemy.orm import declarative_base
from bcrypt import hashpw, gensalt, bcrypt

from database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)

    email = Column(String(255), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    username = Column(String(255), unique=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    last_login_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    def set_password(self, password: str) -> None:
        self.password_hash = hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf-8"), self.password_hash.encode("utf-8")
        )
