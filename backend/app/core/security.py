from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against a stored hashed password using bcrypt.
    Connected to: Auth Endpoint (app.api.endpoints.auth.login)
    Requires: Passlib CryptContext with bcrypt
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hashes a plain text password using bcrypt for secure database storage.
    Connected to: Auth Endpoint (app.api.endpoints.auth.register), Database Seeder (seed_data.py)
    Requires: Passlib CryptContext with bcrypt
    """
    return pwd_context.hash(password)

def create_access_token(subject: str | Any, role: str, user_id: int, expires_delta: timedelta | None = None) -> str:
    """
    Generates a signed JWT access token containing user payload (email, role, user_id, expiration).
    Connected to: Auth Endpoint (app.api.endpoints.auth.login), Frontend Auth Context
    Requires: python-jose (jwt), SECRET_KEY and ALGORITHM from app.core.config
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "id": user_id
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
