# routers/neighbourhoods.py
from fastapi import APIRouter
from services.neighbourhood_service import get_neighbourhoods

router = APIRouter()

@router.get("/neighbourhoods")
def read_neighbourhoods():
    return get_neighbourhoods()