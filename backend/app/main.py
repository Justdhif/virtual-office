import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db, AsyncSessionLocal
from app.agents.registry import seed_agents_if_empty
from app.websocket.manager import manager
from app.api.v1 import auth, projects, agents, tasks, documents, approvals

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database...")
    try:
        await init_db()
        async with AsyncSessionLocal() as session:
            await seed_agents_if_empty(session)
        logger.info("Database initialized & default agents seeded successfully.")
    except Exception as e:
        logger.warning(f"Database init warning (will retry on incoming request): {e}")
    yield
    logger.info("Shutting down ResearchVerse AI Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development & easy local network access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.router, prefix=settings.API_V1_PREFIX)
app.include_router(agents.router, prefix=settings.API_V1_PREFIX)
app.include_router(tasks.router, prefix=settings.API_V1_PREFIX)
app.include_router(documents.router, prefix=settings.API_V1_PREFIX)
app.include_router(approvals.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "ResearchVerse AI Backend",
        "version": settings.VERSION
    }


# WebSocket endpoint for real-time 3D office synchronization
@app.websocket("/ws/projects/{project_id}")
async def websocket_project_endpoint(websocket: WebSocket, project_id: str):
    await manager.connect(project_id, websocket)
    logger.info(f"Client connected to 3D office WebSocket for project: {project_id}")
    try:
        while True:
            # Keep connection alive; receive user commands or pings
            data = await websocket.receive_text()
            # Echo or process if needed
            await websocket.send_text(f'{{"type":"pong","received":{data}}}')
    except WebSocketDisconnect:
        manager.disconnect(project_id, websocket)
        logger.info(f"Client disconnected from project: {project_id}")
    except Exception as e:
        manager.disconnect(project_id, websocket)
        logger.warning(f"WebSocket error on project {project_id}: {e}")
