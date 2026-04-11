from fastapi import APIRouter

from app.routes.auth import router as auth_router
from app.routes.admin import router as admin_router
from app.routes.indicateurs import router as indicateurs_router, valeurs_router
from app.routes.barometre import router as barometre_router
from app.routes.enquetes import router as enquetes_router
from app.routes.publications import router as publications_router
from app.routes.actualites import router as actualites_router
from app.routes.export import router as export_router
from app.routes.contact import router as contact_router
from app.routes.referentiels import router as referentiels_router
from app.routes.sources import router as sources_router
from app.routes.search import router as search_router
from app.routes.entreprises import router as entreprises_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(indicateurs_router)
api_router.include_router(valeurs_router)
api_router.include_router(barometre_router)
api_router.include_router(enquetes_router)
api_router.include_router(publications_router)
api_router.include_router(actualites_router)
api_router.include_router(export_router)
api_router.include_router(contact_router)
api_router.include_router(referentiels_router)
api_router.include_router(sources_router)
api_router.include_router(search_router)
api_router.include_router(entreprises_router)
