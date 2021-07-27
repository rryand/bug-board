from sqlalchemy.orm import Session

import models, schemas

def get_issue(db: Session, issue_id: int):
  return db.query(models.Issue).filter(models.Issue.id == issue_id).first()

def get_issues(db: Session, skip: int = 0, limit: int = 100):
  return db.query(models.Issue).offset(skip).limit(limit).all()

def get_issues_by_type(db: Session, type: str, skip: int = 0, limit: int = 100):
  return db.query(models.Issue).filter_by(status = type).offset(skip).limit(limit).all()

def create_issue(db: Session, issue: schemas.IssueCreate):
  db_issue = models.Issue(
    title=issue.title,
    description=issue.description,
    status=issue.status,
  )
  db.add(db_issue)
  db.commit()
  db.refresh(db_issue)
  return db_issue


