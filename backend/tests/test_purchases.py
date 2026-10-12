import pytest

@pytest.fixture
def user1_headers(client):
    """
    Registers and logs in primary test user 1, returning HTTP Authorization Bearer headers.
    Connected to: Auth endpoints (POST /api/auth/register, POST /api/auth/login)
    Requires: Pytest client fixture
    """
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
    """
    Registers and logs in secondary test user 2, returning HTTP Authorization Bearer headers.
    Connected to: Auth endpoints (POST /api/auth/register, POST /api/auth/login)
    Requires: Pytest client fixture
    """
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

from app.models.user import User
from app.core.security import get_password_hash

@pytest.fixture
def admin_headers(client, db_session):
    """
    Creates an admin test user directly in the database (trusted admin process)
    and logs in, returning HTTP Authorization Bearer headers.
    Connected to: Auth login endpoint (POST /api/auth/login)
    Requires: Pytest client and db_session fixtures
    """
    admin = User(
        email="admin_purchases@example.com",
        hashed_password=get_password_hash("password123"),
        role="admin"
    )
    db_session.add(admin)
    db_session.commit()

    res = client.post(
        "/api/auth/login",
        json={"email": "admin_purchases@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_purchase_vehicle_with_details_creates_history_record(client, user1_headers, admin_headers):
    """
    Tests purchasing a vehicle with buyer information and verifies purchase history record creation.
    Connected to: Vehicle Purchase endpoint (POST /api/vehicles/{id}/purchase), PurchaseModal in Frontend
    Requires: Pytest client, user1_headers, and admin_headers fixtures
    """
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
    """
    Tests data isolation for purchase histories, ensuring users cannot view other users' purchases.
    Connected to: Purchases API (GET /api/purchases/me), User Dashboard / Navbar in Frontend
    Requires: Pytest client, user1_headers, user2_headers, and admin_headers fixtures
    """
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
    """
    Tests that requesting user purchase history without authentication fails with HTTP 401 Unauthorized.
    Connected to: Purchases API (GET /api/purchases/me), Auth middleware
    Requires: Pytest client fixture
    """
    response = client.get("/api/purchases/me")
    assert response.status_code == 401

def test_simultaneous_purchases_prevent_overselling():
    """
    Concurrency test: Simulates two simultaneous purchases competing for the last unit in stock.
    Verifies that pessimistic row locking (with_for_update) serializes the transactions,
    ensuring exactly one purchase succeeds and the other fails with HTTP 400 'Vehicle out of stock'.
    Connected to: create_purchase_record with row-level locking
    """
    import concurrent.futures
    from fastapi import HTTPException
    from tests.conftest import TestingSessionLocal
    from app.models.vehicle import Vehicle
    from app.models.purchase import PurchaseHistory
    from app.services.purchase import create_purchase_record
    from app.schemas.purchase import PurchaseCreate

    setup_session = TestingSessionLocal()
    try:
        # Create a vehicle with quantity = 1
        vehicle = Vehicle(
            maker="Ferrari",
            model="Roma",
            year=2024,
            category="Sports",
            price=245000.00,
            quantity=1
        )
        setup_session.add(vehicle)

        # Create 2 distinct users
        user_a = User(email="concurrent_a@example.com", hashed_password="pwd", role="user")
        user_b = User(email="concurrent_b@example.com", hashed_password="pwd", role="user")
        setup_session.add_all([user_a, user_b])
        setup_session.commit()
        vehicle_id = vehicle.id
        user_a_id = user_a.id
        user_b_id = user_b.id
    finally:
        setup_session.close()

    results = []

    def attempt_purchase(user_id):
        # Each concurrent worker gets its own isolated DB session connection
        thread_session = TestingSessionLocal()
        try:
            user = thread_session.query(User).filter(User.id == user_id).first()
            payload = PurchaseCreate(
                quantity=1,
                buyer_name=f"User {user_id}",
                buyer_phone="555-0100",
                delivery_address="123 Main St, Anytown"
            )
            res = create_purchase_record(thread_session, user, vehicle_id, payload)
            return ("SUCCESS", res)
        except HTTPException as e:
            return ("FAILED", e.status_code, e.detail)
        finally:
            thread_session.close()

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        f1 = executor.submit(attempt_purchase, user_a_id)
        f2 = executor.submit(attempt_purchase, user_b_id)
        results = [f1.result(), f2.result()]

    statuses = [r[0] for r in results]
    assert "SUCCESS" in statuses
    assert "FAILED" in statuses
    assert statuses.count("SUCCESS") == 1
    assert statuses.count("FAILED") == 1

    # Check the failure reason was out of stock
    failed_result = [r for r in results if r[0] == "FAILED"][0]
    assert failed_result[1] == 400
    assert "out of stock" in failed_result[2].lower()

    # Verify database state: quantity is exactly 0 (never negative) and 1 purchase history row
    verify_session = TestingSessionLocal()
    try:
        v_db = verify_session.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        assert v_db.quantity == 0
        purchases = verify_session.query(PurchaseHistory).filter(PurchaseHistory.vehicle_id == vehicle_id).all()
        assert len(purchases) == 1
    finally:
        # Cleanup created records
        verify_session.query(PurchaseHistory).filter(PurchaseHistory.vehicle_id == vehicle_id).delete()
        verify_session.query(Vehicle).filter(Vehicle.id == vehicle_id).delete()
        verify_session.query(User).filter(User.id.in_([user_a_id, user_b_id])).delete()
        verify_session.commit()
        verify_session.close()

