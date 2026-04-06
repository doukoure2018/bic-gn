import uuid
from slugify import slugify as _slugify


def generate_id(prefix: str = "") -> str:
    short_id = uuid.uuid4().hex[:12]
    return f"{prefix}-{short_id}" if prefix else short_id


def slugify(text: str) -> str:
    return _slugify(text, max_length=300)


def paginate_query(query: str, page: int = 1, per_page: int = 20) -> tuple[str, int]:
    offset = (page - 1) * per_page
    return f"{query} LIMIT {per_page} OFFSET {offset}", offset
