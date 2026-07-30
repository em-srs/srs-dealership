from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class PurchaseCreate(BaseModel):
    buyer_name: str
    buyer_phone: str
    delivery_address: str
    note: Optional[str] = None
    quantity: int = Field(default=1, ge=1)

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    vehicle_id: Optional[int] = None
    vehicle_maker: Optional[str] = None
    vehicle_model: Optional[str] = None
    quantity: int
    price_at_purchase: float
    buyer_name: str
    buyer_phone: str
    delivery_address: str
    note: Optional[str] = None
    purchased_at: datetime

    model_config = ConfigDict(from_attributes=True)
