import json
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm.session import Session

import crud, models
from schemas import Issue, IssueCreate, IssueStatus, UpdateRequest
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

#origins = ["http://localhost:3000"]
origins = ["*"]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Dependency
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

@app.get("/issues", response_model=List[Issue])
def get_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  issues = crud.get_issues(db=db, skip=skip, limit=limit)

  return issues
  
@app.post("/issues", response_model=Issue)
def post_issues(issue: IssueCreate, db: Session = Depends(get_db)):
  issue = crud.create_issue(db=db, issue=issue)
  status = crud.get_issue_status(db=db, issue_status_id=issue.status)

  new_issue_ids = json.loads(status.issueIds)
  new_issue_ids.append(issue.id)

  crud.update_issue_status(
    db=db,
    issue_status_id=issue.status,
    changes= {"issueIds": json.dumps(new_issue_ids)})

  return issue

@app.get("/issues/{issue_id}", response_model=Issue)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
  issue = crud.get_issue(db=db, issue_id=issue_id)
  if issue is None:
    raise HTTPException(404, detail="Issue not found")

  return issue

@app.patch("/statuses/{status_id}", response_model=IssueStatus)
def modify_issue(status_id: str, body: UpdateRequest, db: Session = Depends(get_db)):
  changes = {
    "issueIds": json.dumps(body.issueIds),
  }

  crud.update_issue_status(db=db, issue_status_id=status_id, changes=changes)
  status = crud.get_issue_status(db=db, issue_status_id=status_id)

  return IssueStatus(**{**status.__dict__, "issueIds": json.loads(status.issueIds)})

@app.get("/statuses", response_model=List[IssueStatus])
def get_columns(db: Session = Depends(get_db)):
  statuses = crud.get_issue_statuses(db=db)

  result = []
  for status in statuses:
    print(status.__dict__)
    result.append(IssueStatus(**{**status.__dict__, "issueIds": json.loads(status.issueIds)}))
  
  return result
