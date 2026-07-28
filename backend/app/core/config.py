import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership"
    TEST_DATABASE_URL: str = "postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership"
    SECRET_KEY: str = "supersecretkeyforjwtauthenticationdealership12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
