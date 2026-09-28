"""
run_servers.py
Single command launcher to start both FastAPI backend and Vite frontend simultaneously.
Usage: python run_servers.py
"""

import subprocess
import sys
import os
import time
import signal

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 65)
    print("STARTING SMART HOUSE BUDGET & REQUIREMENT ANALYZER")
    print("=" * 65)
    print("Backend URL:  http://127.0.0.1:8000")
    print("Frontend URL: http://localhost:5173")
    print("API Docs:     http://127.0.0.1:8000/docs")
    print("=" * 65)
    print("Press Ctrl+C to terminate both servers.\n")

    # Start FastAPI Backend
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    # Start Vite Frontend
    # Use npx vite or npm run dev
    frontend_cmd = ["npm.cmd" if os.name == "nt" else "npm", "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    def shutdown(signum=None, frame=None):
        print("\nShutting down backend and frontend...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            # Check if any process terminated unexpectedly
            if backend_proc.poll() is not None:
                print("Backend terminated unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend terminated unexpectedly.")
                break
    except KeyboardInterrupt:
        shutdown()

if __name__ == "__main__":
    main()
