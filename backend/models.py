from sqlalchemy import Column, Integer, String

from database import Base

class Issue(Base):
  __tablename__ = "issues"

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, index=True)
  description = Column(String)
  status = Column(String, index=True)

class IssueStatus(Base):
  __tablename__ = "issue_statuses"

  id = Column(String, primary_key=True, index=True)
  title = Column(String)
  issueIds = Column(String, default="[]")
