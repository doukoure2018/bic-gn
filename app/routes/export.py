from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from app.database import get_db
from app.services.export_service import export_indicateurs_excel, export_valeurs_excel

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/indicateurs/excel")
async def export_ind_excel(secteur: str | None = None, conn=Depends(get_db)):
    output = await export_indicateurs_excel(conn, secteur_code=secteur)
    filename = f"indicateurs_{secteur or 'tous'}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/valeurs/excel")
async def export_val_excel(
    periode_id: int | None = None,
    secteur: str | None = None,
    conn=Depends(get_db),
):
    output = await export_valeurs_excel(conn, periode_id=periode_id, secteur_code=secteur)
    filename = f"valeurs_{secteur or 'tous'}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/donnees/{secteur}")
async def export_donnees_secteur(secteur: str, conn=Depends(get_db)):
    output = await export_valeurs_excel(conn, secteur_code=secteur)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=donnees_{secteur}.xlsx"},
    )
