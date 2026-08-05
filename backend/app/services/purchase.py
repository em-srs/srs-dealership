from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.purchase import PurchaseHistory
from app.schemas.purchase import PurchaseCreate, PurchaseResponse

def create_purchase_record(
    db: Session,
    user: User,
    vehicle_id: int,
    purchase_in: Optional[PurchaseCreate] = None
) -> PurchaseResponse:
    """
    Validates stock availability, decrements vehicle inventory, creates a PurchaseHistory record, and returns response.
    Connected to: Vehicle Endpoint (POST /api/vehicles/{vehicle_id}/purchase), Frontend PurchaseModal
    Requires: Database Session, User model, Vehicle model, PurchaseHistory model
    """
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    requested_quantity = purchase_in.quantity if (purchase_in and purchase_in.quantity) else 1

    if vehicle.quantity < requested_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle out of stock"
        )
    
    # Decrement vehicle stock
    vehicle.quantity -= requested_quantity

    buyer_name = purchase_in.buyer_name if purchase_in else user.email.split('@')[0]
    buyer_phone = purchase_in.buyer_phone if purchase_in else "N/A"
    delivery_address = purchase_in.delivery_address if purchase_in else "N/A"
    note = purchase_in.note if purchase_in else None

    purchase_record = PurchaseHistory(
        user_id=user.id,
        vehicle_id=vehicle.id,
        quantity=requested_quantity,
        price_at_purchase=vehicle.price,
        buyer_name=buyer_name,
        buyer_phone=buyer_phone,
        delivery_address=delivery_address,
        note=note,
    )
    db.add(purchase_record)
    db.commit()
    db.refresh(purchase_record)

    return PurchaseResponse(
        id=purchase_record.id,
        user_id=purchase_record.user_id,
        vehicle_id=purchase_record.vehicle_id,
        vehicle_maker=vehicle.maker,
        vehicle_model=vehicle.model,
        quantity=purchase_record.quantity,
        price_at_purchase=float(purchase_record.price_at_purchase),
        buyer_name=purchase_record.buyer_name,
        buyer_phone=purchase_record.buyer_phone,
        delivery_address=purchase_record.delivery_address,
        note=purchase_record.note,
        purchased_at=purchase_record.purchased_at,
    )

def get_user_purchases(db: Session, user_id: int) -> List[PurchaseResponse]:
    """
    Fetches all purchase history entries for a specific user joined with vehicle details, ordered by date.
    Connected to: Purchase Endpoint (GET /api/purchases/me), Frontend User Dashboard / Purchase History Modal
    Requires: Database Session, PurchaseHistory model, Vehicle model
    """
    records = (
        db.query(PurchaseHistory, Vehicle)
        .outerjoin(Vehicle, PurchaseHistory.vehicle_id == Vehicle.id)
        .filter(PurchaseHistory.user_id == user_id)
        .order_by(desc(PurchaseHistory.purchased_at))
        .all()
    )

    result = []
    for ph, v in records:
        result.append(
            PurchaseResponse(
                id=ph.id,
                user_id=ph.user_id,
                vehicle_id=ph.vehicle_id,
                vehicle_maker=v.maker if v else "Unknown",
                vehicle_model=v.model if v else "Unknown",
                quantity=ph.quantity,
                price_at_purchase=float(ph.price_at_purchase),
                buyer_name=ph.buyer_name,
                buyer_phone=ph.buyer_phone,
                delivery_address=ph.delivery_address,
                note=ph.note,
                purchased_at=ph.purchased_at,
            )
        )
    return result
