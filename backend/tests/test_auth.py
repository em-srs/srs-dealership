import pytest

def test_register_user_success(client):
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
    response = client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "adminsecret123", "role": "admin"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"

def test_register_duplicate_email_fails(client):
    payload = {"email": "duplicate@example.com", "password": "pass123", "role": "user"}
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "Email already registered" in res2.json()["detail"]

def test_login_success(client):
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
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "somepassword"}
    )
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
