import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.main import app
from app.core.config import settings
from app.db.database import get_db, Base

engine = create_engine(settings.TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Pytest fixture that creates an isolated database session for testing and wipes tables before each test.
    Connected to: PostgreSQL Test Database
    Requires: SQLAlchemy test engine (settings.TEST_DATABASE_URL)
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    # Delete rows from tables before test execution to guarantee clean state
    session.execute(text("DELETE FROM purchase_history; DELETE FROM vehicles; DELETE FROM users;"))
    session.commit()


    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    """
    Pytest fixture providing a FastAPI TestClient configured with test database dependency overrides.
    Connected to: FastAPI App instance (app.main.app)
    Requires: Pytest db_session fixture, FastAPI TestClient
    """
    def _override_get_db():
        """
        Helper dependency generator overriding get_db to return the test database session.
        Connected to: FastAPI dependency_overrides[get_db]
        Requires: db_session fixture
        """
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
