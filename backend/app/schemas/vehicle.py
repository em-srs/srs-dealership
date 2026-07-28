from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int = Field(ge=1886)
    category: str
    price: float = Field(ge=0.0)
    quantity: int = Field(ge=0)

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = Field(default=None, ge=1886)
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0.0)
    quantity: Optional[int] = Field(default=None, ge=0)

class VehicleResponse(VehicleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
