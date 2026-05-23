from datetime import datetime
from pydantic import Field
from pydantic import BaseModel
from typing import Optional

class WorkSpaceSchema(BaseModel):
    slug: str = Field(..., min_length=2, max_length=25)
    name: str = Field(..., min_length=2, max_length=25)
    owner_id: str = Field(..., min_length=2, max_length=36)


class WorkSpaceResponseSchema(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = {"from_attributes": True}