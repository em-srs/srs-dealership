import pytest

@pytest.fixture
def user_token_headers(client):
    client.post(
        "/api/auth/register",
        json={"email": "regularuser@example.com", "password": "password123", "role": "user"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "regularuser@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_token_headers(client):
    client.post(
        "/api/auth/register",
        json={"email": "adminuser@example.com", "password": "adminpassword123", "role": "admin"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "adminuser@example.com", "password": "adminpassword123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_vehicle_success(client, user_token_headers):
    payload = {
        "maker": "Toyota",
        "model": "Camry",
        "year": 2023,
        "category": "Sedan",
        "price": 26000.00,
        "quantity": 5
    }
    response = client.post("/api/vehicles", json=payload, headers=user_token_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["maker"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["price"] == 26000.00
    assert "id" in data

def test_create_vehicle_unauthenticated_fails(client):
    payload = {
        "maker": "Honda",
        "model": "Civic",
        "year": 2022,
        "category": "Sedan",
        "price": 22000.00,
        "quantity": 3
    }
    response = client.post("/api/vehicles", json=payload)
    assert response.status_code == 401

def test_get_all_vehicles_requires_authentication(client, user_token_headers):
    client.post("/api/vehicles", json={"maker": "Ford", "model": "Mustang", "year": 2021, "category": "Coupe", "price": 35000.00, "quantity": 2}, headers=user_token_headers)

    # Unauthenticated GET request must fail with 401 Unauthorized
    unauth_response = client.get("/api/vehicles")
    assert unauth_response.status_code == 401

    # Authenticated GET request must succeed with 200 OK
    auth_response = client.get("/api/vehicles", headers=user_token_headers)
    assert auth_response.status_code == 200
    assert len(auth_response.json()) >= 1

def test_search_vehicles_requires_authentication(client, user_token_headers):
    client.post("/api/vehicles", json={"maker": "Toyota", "model": "Corolla", "year": 2020, "category": "Sedan", "price": 18000.00, "quantity": 3}, headers=user_token_headers)

    # Unauthenticated search request must fail with 401 Unauthorized
    unauth_response = client.get("/api/vehicles/search?maker=Toyota&max_price=30000")
    assert unauth_response.status_code == 401

    # Authenticated search request must succeed with 200 OK
    auth_response = client.get("/api/vehicles/search?maker=Toyota&max_price=30000", headers=user_token_headers)
    assert auth_response.status_code == 200
    results = auth_response.json()
    assert len(results) == 1
    assert results[0]["model"] == "Corolla"

def test_update_vehicle_success(client, user_token_headers):
    res = client.post("/api/vehicles", json={"maker": "Subaru", "model": "Outback", "year": 2022, "category": "SUV", "price": 29000.00, "quantity": 2}, headers=user_token_headers)
    vehicle_id = res.json()["id"]

    update_payload = {"price": 27500.00, "quantity": 5}
    response = client.put(f"/api/vehicles/{vehicle_id}", json=update_payload, headers=user_token_headers)
    assert response.status_code == 200
    assert response.json()["price"] == 27500.00
    assert response.json()["quantity"] == 5

def test_delete_vehicle_admin_only_success(client, admin_token_headers):
    res = client.post("/api/vehicles", json={"maker": "Mazda", "model": "CX-5", "year": 2023, "category": "SUV", "price": 28000.00, "quantity": 2}, headers=admin_token_headers)
    vehicle_id = res.json()["id"]

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_token_headers)
    assert response.status_code == 200 or response.status_code == 204

def test_delete_vehicle_regular_user_forbidden(client, user_token_headers, admin_token_headers):
    res = client.post("/api/vehicles", json={"maker": "Audi", "model": "A4", "year": 2023, "category": "Sedan", "price": 40000.00, "quantity": 1}, headers=admin_token_headers)
    vehicle_id = res.json()["id"]

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=user_token_headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]
