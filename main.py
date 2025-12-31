# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import neighbourhoods

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://localhost:3000",  # React 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(neighbourhoods.router)