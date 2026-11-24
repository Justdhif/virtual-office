import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const activities = await query(
      `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );

    return NextResponse.json({ success: true, activities });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const id = body.id || `act-${Date.now()}`;
    const projectId = body.projectId || body.project_id || null;
    const agentId = body.agentId || body.agent_id || "director";
    const eventType = body.eventType || body.event_type || "log";
    const description = body.description || "";
    const timestamp = body.timestamp || new Date().toLocaleTimeString();
    const metadata = body.metadata || {};

    await query(
      `INSERT INTO activity_logs (id, project_id, agent_id, event_type, description, timestamp, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, projectId, agentId, eventType, description, timestamp, JSON.stringify(metadata)]
    );

    const created = await query(`SELECT * FROM activity_logs WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, activity: created[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
