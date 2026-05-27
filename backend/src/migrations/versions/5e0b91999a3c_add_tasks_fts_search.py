"""add tasks fts search

Revision ID: 5e0b91999a3c
Revises: 25c39db07f48
Create Date: 2026-05-27 23:40:53.847189

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5e0b91999a3c'
down_revision: Union[str, Sequence[str], None] = '25c39db07f48'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    # Create FTS5 virtual table
    op.execute("""
        CREATE VIRTUAL TABLE tasks_fts USING fts5(
            title,
            description,
            content='tasks',
            content_rowid='rowid',
            tokenize='porter unicode61'
        );
    """)

    # Initial sync of existing tasks
    op.execute("""
        INSERT INTO tasks_fts(rowid, title, description)
        SELECT rowid, title, description
        FROM tasks;
    """)

    # Insert trigger
    op.execute("""
        CREATE TRIGGER tasks_ai
        AFTER INSERT ON tasks
        BEGIN
            INSERT INTO tasks_fts(
                rowid,
                title,
                description
            )
            VALUES (
                new.rowid,
                new.title,
                new.description
            );
        END;
    """)

    # Update trigger
    op.execute("""
        CREATE TRIGGER tasks_au
        AFTER UPDATE ON tasks
        BEGIN
            UPDATE tasks_fts
            SET
                title = new.title,
                description = new.description
            WHERE rowid = old.rowid;
        END;
    """)

    # Delete trigger
    op.execute("""
        CREATE TRIGGER tasks_ad
        AFTER DELETE ON tasks
        BEGIN
            DELETE FROM tasks_fts
            WHERE rowid = old.rowid;
        END;
    """)


def downgrade():

    op.execute("DROP TRIGGER IF EXISTS tasks_ai;")
    op.execute("DROP TRIGGER IF EXISTS tasks_au;")
    op.execute("DROP TRIGGER IF EXISTS tasks_ad;")

    op.execute("DROP TABLE IF EXISTS tasks_fts;")
