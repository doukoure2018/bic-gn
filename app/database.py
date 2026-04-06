import asyncpg
import logging
import os

from app.config import settings

logger = logging.getLogger(__name__)

pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=2,
            max_size=10,
        )
    return pool


async def close_pool():
    global pool
    if pool:
        await pool.close()
        pool = None


async def get_db() -> asyncpg.Connection:
    p = await get_pool()
    async with p.acquire() as conn:
        yield conn


async def execute_migrations():
    p = await get_pool()
    migrations_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "migrations")

    async with p.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        applied = {row["filename"] for row in await conn.fetch("SELECT filename FROM _migrations")}

        migration_files = sorted(
            f for f in os.listdir(migrations_dir)
            if f.endswith(".sql") and f not in applied
        )

        for filename in migration_files:
            filepath = os.path.join(migrations_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                sql = f.read()

            async with conn.transaction():
                await conn.execute(sql)
                await conn.execute("INSERT INTO _migrations (filename) VALUES ($1)", filename)
                logger.info(f"Migration applied: {filename}")
