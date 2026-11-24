import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function GET() {
  await initDb();
  try {
    const projects = await query(`SELECT * FROM projects ORDER BY created_at DESC LIMIT 10`);
    const activeProject = projects.length > 0 ? projects[0] : null;

    return NextResponse.json({
      success: true,
      activeProject,
      projects,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const id = body.id || `proj-${Date.now()}`;
    const title = body.title || "Proyek Riset Baru";
    const researchTopic = body.researchTopic || body.research_topic || "";
    const academicLevel = body.academicLevel || body.academic_level || "S1 / Sarjana";
    const citationStyle = body.citationStyle || body.citation_style || "APA 7th";
    const status = body.status || "planning";

    await query(
      `INSERT INTO projects (id, title, research_topic, academic_level, citation_style, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET title = $2, research_topic = $3, academic_level = $4, citation_style = $5, status = $6, updated_at = NOW()`,
      [id, title, researchTopic, academicLevel, citationStyle, status]
    );

    const created = await query(`SELECT * FROM projects WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, project: created[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
