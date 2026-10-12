import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
connect_args = {}

try:
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        engine = create_engine(db_url, connect_args=connect_args)
    else:
        try:
            engine = create_engine(db_url, pool_pre_ping=True)
            # Probe dialect driver
            _ = engine.dialect
        except (ModuleNotFoundError, ImportError) as err:
            logger.warning(
                "PostgreSQL driver unavailable (%s). Falling back to local SQLite for local dev environment.",
                err,
            )
            fallback_url = "sqlite:///./quality_db.sqlite3"
            engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
except Exception as exc:
    logger.warning("Failed to initialize primary database engine (%s). Falling back to SQLite.", exc)
    fallback_url = "sqlite:///./quality_db.sqlite3"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()