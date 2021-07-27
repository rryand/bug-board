from typing import List, Optional

from pydantic import BaseModel

class IssueBase(BaseModel):
  title: str
  description: Optional[str] = None
  status: Optional[str] = "todo"

class IssueCreate(IssueBase):
  pass

class Issue(IssueBase):
  id: int

  class Config:
    orm_mode = True

class IssueStatus(BaseModel):
  id: str
  title: str
  issueIds: List[int]

class UpdateRequest(BaseModel):
  issueIds: List[int]
