from app.core.config import Settings


def test_database_url_uses_installed_psycopg2_driver():
    settings = Settings(
        DATABASE_URL="postgresql+psycopg://user:password@localhost/database"
    )

    assert settings.DATABASE_URL == (
        "postgresql+psycopg2://user:password@localhost/database"
    )


def test_legacy_postgres_scheme_is_normalized():
    settings = Settings(DATABASE_URL="postgres://user:password@localhost/database")

    assert settings.DATABASE_URL == "postgresql://user:password@localhost/database"
