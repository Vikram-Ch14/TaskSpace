from datetime import datetime
from pydantic import Field
from pydantic import BaseModel

class WorkSpaceSchema(BaseModel):
    slug: str = Field(..., min_length=2, max_length=25)
    name: str = Field(..., min_length=2, max_length=25)
    owner_id: str = Field(..., min_length=2, max_length=36)


class WorkSpaceResponseSchema(BaseModel):
    id: str
    slug: str
    name: str
    owner_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}