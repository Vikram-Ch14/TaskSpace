import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import Column, DateTime, String
import bcrypt
from database import Base
import jwt


def gen_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)

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
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf-8"), self.password_hash.encode("utf-8")
        )
    
    def generate_jwt(self, secret_key: str, expires_in: int = 3600, role: str = "viewer", workspace: str = None) -> str:
        payload = {
            "sub": self.id,
            "username": self.username,
            "email": self.email,
            "role": role,
            "workspace": workspace,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        }
        return jwt.encode(payload, secret_key, algorithm="HS256")
    
    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"
