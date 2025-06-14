from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware as CORS

app = FastAPI(title="Genkit Agents API", version="0.1.0")

app.add_middleware(
    CORS,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods; restrict in production
    allow_headers=["*"],  # Allow all headers; restrict in production
)

@app.get("/api/v1/health")
def health_check():
    return { "status" : "ok" }

@app.post("/api/v1/get-video-transcript")
def get_video_transcript(video_id: str):
    return { "video_id": video_id }


def run_dev():
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)

def run_prod():
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=False)