from typing import List, Dict

from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm.session import Session

import crud, models, schemas
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

@app.get("/issues", response_model=List[schemas.Issue])
def get_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  issues = crud.get_issues(db=db, skip=skip, limit=limit)
  return issues
  
@app.post("/issues", response_model=schemas.Issue)
def post_issues(issue: schemas.IssueCreate, db: Session = Depends(get_db)):
  return crud.create_issue(db=db, issue=issue)

@app.get("/issues/{issue_id}", response_model=schemas.Issue)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
  db_issue = crud.get_issue(db=db, issue_id=issue_id)
  if db_issue is None:
    raise HTTPException(404, detail="Issue not found")
  return db_issue

@app.patch("/issues/{issue_id}")
def modify_issue(issue_id: int, body: Dict, db: Session = Depends(get_db)):
  return {"message": "modified issue"}

@app.get("/columns", response_model=List[schemas.Column])
def get_columns(db: Session = Depends(get_db)):
  columns = []
  for status in ["todo", "in-progress", "done"]:
    column = {"id": status, "issueIds": []}
    issues = crud.get_issues_by_type(db=db, type=status)

    for issue in issues:
      column["issueIds"].append(issue.id)
    
    columns.append(column)

  return columns
