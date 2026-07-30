import pytest

@pytest.fixture
def user1_headers(client):
    client.post(
        "/api/auth/register",
        json={"email": "buyer1@example.com", "password": "password123", "role": "user"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "buyer1@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def user2_headers(client):
    client.post(
        "/api/auth/register",
        json={"email": "buyer2@example.com", "password": "password123", "role": "user"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "buyer2@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(client):
    client.post(
        "/api/auth/register",
        json={"email": "admin_purchases@example.com", "password": "password123", "role": "admin"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "admin_purchases@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_purchase_vehicle_with_details_creates_history_record(client, user1_headers, admin_headers):
    # 1. Create a vehicle
    res = client.post(
        "/api/vehicles",
        json={"maker": "BMW", "model": "M3", "year": 2024, "category": "Sports", "price": 75000.00, "quantity": 3},
        headers=admin_headers
    )
    assert res.status_code == 201
    vehicle_id = res.json()["id"]

    # 2. Purchase with full form details
    purchase_payload = {
        "buyer_name": "Alice Smith",
        "buyer_phone": "+1-555-0199",
        "delivery_address": "456 Oak Avenue, Springfield",
        "note": "Please call prior to delivery",
        "quantity": 1
    }
    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        json=purchase_payload,
        headers=user1_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["buyer_name"] == "Alice Smith"
    assert data["price_at_purchase"] == 75000.00
    assert data["quantity"] == 1

def test_get_user_purchase_history_isolation(client, user1_headers, user2_headers, admin_headers):
    # 1. Create a vehicle
    res = client.post(
        "/api/vehicles",
        json={"maker": "Porsche", "model": "911", "year": 2023, "category": "Sports", "price": 120000.00, "quantity": 5},
        headers=admin_headers
    )
    vehicle_id = res.json()["id"]

    # 2. User 1 makes a purchase
    client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        json={
            "buyer_name": "User One",
            "buyer_phone": "111-222-3333",
            "delivery_address": "111 First St",
            "quantity": 1
        },
        headers=user1_headers
    )

    # 3. User 2 fetches purchase history -> should be empty
    u2_history = client.get("/api/purchases/me", headers=user2_headers)
    assert u2_history.status_code == 200
    assert len(u2_history.json()) == 0

    # 4. User 1 fetches purchase history -> should contain 1 purchase
    u1_history = client.get("/api/purchases/me", headers=user1_headers)
    assert u1_history.status_code == 200
    records = u1_history.json()
    assert len(records) == 1
    assert records[0]["buyer_name"] == "User One"
    assert records[0]["vehicle_maker"] == "Porsche"
    assert records[0]["vehicle_model"] == "911"
    assert records[0]["price_at_purchase"] == 120000.00

def test_get_purchases_unauthenticated_fails(client):
    response = client.get("/api/purchases/me")
    assert response.status_code == 401
