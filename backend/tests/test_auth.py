import pytest

def test_register_user_success(client):
    """
    Tests successful registration of a standard user with valid credentials.
    Connected to: Auth API (POST /api/auth/register), AuthModal in Frontend
    Requires: Pytest client fixture, Test Database
    """
    response = client.post(
        "/api/auth/register",
        json={"email": "testuser@example.com", "password": "securepassword123", "role": "user"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["role"] == "user"
    assert "id" in data
    assert "password" not in data

def test_register_admin_success(client):
    """
    Tests successful registration of an admin user with admin role.
    Connected to: Auth API (POST /api/auth/register)
    Requires: Pytest client fixture, Test Database
    """
    response = client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "adminsecret123", "role": "admin"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"

def test_register_duplicate_email_fails(client):
    """
    Tests that registering with an already existing email fails with HTTP 400 error.
    Connected to: Auth API (POST /api/auth/register), AuthModal in Frontend
    Requires: Pytest client fixture, Test Database
    """
    payload = {"email": "duplicate@example.com", "password": "pass123", "role": "user"}
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "Email already registered" in res2.json()["detail"]

def test_login_success(client):
    """
    Tests successful login returning a valid JWT bearer token.
    Connected to: Auth API (POST /api/auth/login), AuthContext in Frontend
    Requires: Pytest client fixture, Test Database
    """
    client.post(
        "/api/auth/register",
        json={"email": "loginuser@example.com", "password": "loginpass123", "role": "user"}
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "loginuser@example.com", "password": "loginpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password_fails(client):
    """
    Tests login rejection with 401 status when providing an incorrect password.
    Connected to: Auth API (POST /api/auth/login), AuthContext in Frontend
    Requires: Pytest client fixture, Test Database
    """
    client.post(
        "/api/auth/register",
        json={"email": "user2@example.com", "password": "correctpassword", "role": "user"}
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "user2@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]

def test_login_nonexistent_user_fails(client):
    """
    Tests login rejection with 401 status when requesting a non-existent email.
    Connected to: Auth API (POST /api/auth/login), AuthContext in Frontend
    Requires: Pytest client fixture, Test Database
    """
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "somepassword"}
    )
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
