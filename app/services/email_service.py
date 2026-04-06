import logging

logger = logging.getLogger(__name__)


async def send_enquete_invitation(email: str, entreprise_nom: str, enquete_titre: str, token: str, base_url: str = "http://localhost:3000"):
    url = f"{base_url}/enquete/{token}"
    logger.info(f"[EMAIL] Invitation enquête '{enquete_titre}' envoyée à {entreprise_nom} ({email}) - URL: {url}")
    # TODO: Intégrer un service SMTP réel (SendGrid, SES, etc.)


async def send_contact_notification(admin_email: str, contact_nom: str, sujet: str):
    logger.info(f"[EMAIL] Notification contact de {contact_nom} - Sujet: {sujet} -> {admin_email}")
    # TODO: Intégrer un service SMTP réel
