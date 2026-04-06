import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import get_pool, close_pool, execute_migrations
from app.exceptions.handlers import register_exception_handlers
from app.routes import api_router

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting BIC-GN API...")
    await get_pool()
    await execute_migrations()
    logger.info("Database connected, migrations applied.")
    yield
    await close_pool()
    logger.info("BIC-GN API stopped.")


app = FastAPI(
    title="BIC-GN API",
    description="Baromètre Industrie et Commerce - Guinée",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(api_router)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    return {
        "name": "BIC-GN API",
        "version": "1.0.0",
        "description": "Baromètre Industrie et Commerce - Guinée",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
