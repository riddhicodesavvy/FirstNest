"""
start_backend.py
Direct script to start the FastAPI server on 127.0.0.1:8000
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from backend.main import app

if __name__ == "__main__":
    print("Starting FastAPI on http://127.0.0.1:8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
