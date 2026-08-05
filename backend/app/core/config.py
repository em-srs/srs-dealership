from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership"
    TEST_DATABASE_URL: str = "postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership"
    SECRET_KEY: str = "supersecretkeyforjwtauthenticationdealership12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        """
        Normalizes database connection URIs by replacing legacy postgres:// schema with postgresql://.
        Connected to: Database Connection Engine (app.db.database)
        Requires: Pydantic field_validator, DATABASE_URL environment variable from .env
        """
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

settings = Settings()
