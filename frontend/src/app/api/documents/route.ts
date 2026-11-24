import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const category = searchParams.get("category");

  try {
    let sql = `SELECT * FROM documents WHERE 1=1`;
    const params: any[] = [];

    if (projectId) {
      params.push(projectId);
      sql += ` AND project_id = $${params.length}`;
    }
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC`;
    const documents = await query(sql, params);

    return NextResponse.json({ success: true, documents });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const id = body.id || `doc-${Date.now()}`;
    const projectId = body.projectId || body.project_id || null;
    const title = body.title || "Dokumen Akademik";
    const category = body.category || "bab1";
    const content = body.content || "";
    const metadata = body.metadata || {};

    await query(
      `INSERT INTO documents (id, project_id, title, category, content, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, projectId, title, category, content, JSON.stringify(metadata)]
    );

    const created = await query(`SELECT * FROM documents WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, document: created[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
