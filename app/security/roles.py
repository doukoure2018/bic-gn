from enum import Enum


class Role(str, Enum):
    SUPER_ADMIN = "super_admin"
    EDITEUR = "editeur"
    VALIDATEUR = "validateur"
    LECTEUR = "lecteur"


ROLE_HIERARCHY = {
    Role.SUPER_ADMIN: 4,
    Role.EDITEUR: 3,
    Role.VALIDATEUR: 2,
    Role.LECTEUR: 1,
}


def has_permission(user_role: str, required_role: str) -> bool:
    user_level = ROLE_HIERARCHY.get(Role(user_role), 0)
    required_level = ROLE_HIERARCHY.get(Role(required_role), 0)
    return user_level >= required_level
