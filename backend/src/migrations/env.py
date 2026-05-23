"""
src/migrations/env.py
Alembic environment configuration.
"""
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ============================================================
# Imports — these work because we run alembic FROM src/
# ============================================================
from config import Config
from database import Base

# Import all models so Alembic detects them for autogenerate
from models.user import User
from models.workspace import Workspace
from models.workspace_member import WorkspaceMember
# When you add more models, import them here:
# from models.task import Task
# from models.activity_log import ActivityLog


# ============================================================
# Alembic configuration object
# ============================================================
config = context.config

# Override sqlalchemy.url from alembic.ini with our config
config.set_main_option("sqlalchemy.url", Config.db_url)

# Setup logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Provide metadata for autogenerate to compare against
target_metadata = Base.metadata


# ============================================================
# Offline migrations (generate SQL without DB connection)
# ============================================================
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# ============================================================
# Online migrations (connect to DB and apply)
# ============================================================
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# ============================================================
# Decide which mode to run
# ============================================================
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()