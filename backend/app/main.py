from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple file-based storage for prototype
STORAGE_PATH = Path("data/forms.json")
STORAGE_PATH.parent.mkdir(exist_ok=True)

if not STORAGE_PATH.exists():
    STORAGE_PATH.write_text('[]')

class FormData(BaseModel):
    form_id: Optional[str]
    sections: Dict[str, Any]
    completed_sections: List[str]

@app.post("/api/save-form")
async def save_form(form_data: FormData):
    try:
        forms = json.loads(STORAGE_PATH.read_text())
        forms.append(form_data.dict())
        STORAGE_PATH.write_text(json.dumps(forms, indent=2))
        return {"message": "Form saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forms/{form_id}")
async def get_form(form_id: str):
    try:
        forms = json.loads(STORAGE_PATH.read_text())
        form = next((f for f in forms if f["form_id"] == form_id), None)
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        return form
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 