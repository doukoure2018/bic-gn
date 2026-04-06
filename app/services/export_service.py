import io
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side


HEADER_FILL = PatternFill(start_color="1a365d", end_color="1a365d", fill_type="solid")
HEADER_FONT = Font(color="FFFFFF", bold=True, size=11)
THIN_BORDER = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)


def style_header(ws, row=1, max_col=10):
    for col in range(1, max_col + 1):
        cell = ws.cell(row=row, column=col)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = THIN_BORDER


async def export_indicateurs_excel(conn, secteur_code: str | None = None):
    query = """
        SELECT i.code, i.nom, i.unite, i.source, i.periodicite,
               c.nom as categorie, s.nom as secteur
        FROM indicateurs i
        JOIN categories c ON c.id = i.categorie_id
        JOIN secteurs s ON s.id = c.secteur_id
        WHERE i.est_actif = true
    """
    params = []
    if secteur_code:
        query += " AND s.code = $1"
        params.append(secteur_code)
    query += " ORDER BY s.nom, c.ordre, i.ordre"

    rows = await conn.fetch(query, *params)

    wb = Workbook()
    ws = wb.active
    ws.title = "Indicateurs"

    headers = ["Code", "Nom", "Secteur", "Catégorie", "Unité", "Source", "Périodicité"]
    ws.append(headers)
    style_header(ws, max_col=len(headers))

    for row in rows:
        ws.append([row["code"], row["nom"], row["secteur"], row["categorie"],
                   row["unite"], row["source"], row["periodicite"]])

    for col in ws.columns:
        max_length = max(len(str(cell.value or "")) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = min(max_length + 2, 50)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output


async def export_valeurs_excel(conn, periode_id: int | None = None, secteur_code: str | None = None):
    query = """
        SELECT i.code, i.nom, i.unite, s.nom as secteur, c.nom as categorie,
               p.annee, p.trimestre, v.valeur, v.variation, v.tendance, v.statut,
               r.nom as region
        FROM valeurs v
        JOIN indicateurs i ON i.id = v.indicateur_id
        JOIN categories c ON c.id = i.categorie_id
        JOIN secteurs s ON s.id = c.secteur_id
        JOIN periodes p ON p.id = v.periode_id
        LEFT JOIN regions r ON r.id = v.region_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if periode_id:
        query += f" AND v.periode_id = ${idx}"
        params.append(periode_id)
        idx += 1

    if secteur_code:
        query += f" AND s.code = ${idx}"
        params.append(secteur_code)

    query += " ORDER BY p.annee, p.trimestre, s.nom, c.ordre, i.ordre"

    rows = await conn.fetch(query, *params)

    wb = Workbook()
    ws = wb.active
    ws.title = "Valeurs"

    headers = ["Code", "Indicateur", "Secteur", "Catégorie", "Année", "Trimestre",
               "Région", "Valeur", "Unité", "Variation (%)", "Tendance", "Statut"]
    ws.append(headers)
    style_header(ws, max_col=len(headers))

    for row in rows:
        ws.append([
            row["code"], row["nom"], row["secteur"], row["categorie"],
            row["annee"], row["trimestre"], row["region"] or "National",
            float(row["valeur"]), row["unite"],
            float(row["variation"]) if row["variation"] else None,
            row["tendance"], row["statut"]
        ])

    for col in ws.columns:
        max_length = max(len(str(cell.value or "")) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = min(max_length + 2, 50)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output
