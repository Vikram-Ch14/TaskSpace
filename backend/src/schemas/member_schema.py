from pydantic import BaseModel

from datetime import datetime
from typing import Optional

class MembersSchema(BaseModel):
    workspace_slug: str


class MemberResponseSchema(BaseModel):
    id: str
    email: str
    username: str
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

