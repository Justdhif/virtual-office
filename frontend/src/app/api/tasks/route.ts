import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  try {
    let tasks;
    if (projectId) {
      tasks = await query(
        `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
        [projectId]
      );
    } else {
      tasks = await query(`SELECT * FROM tasks ORDER BY created_at DESC`);
    }

    return NextResponse.json({ success: true, tasks });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const id = body.id || `task-${Date.now()}`;
    const projectId = body.projectId || body.project_id || null;
    const agentId = body.agentId || body.agent_id || "project_manager";
    const title = body.title || "Tugas Riset";
    const description = body.description || "";
    const status = body.status || "backlog";
    const priority = body.priority || "medium";

    await query(
      `INSERT INTO tasks (id, project_id, agent_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, projectId, agentId, title, description, status, priority]
    );

    const created = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, task: created[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const { id, status, result } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    await query(
      `UPDATE tasks
       SET status = COALESCE($1, status),
           result = COALESCE($2, result),
           completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END
       WHERE id = $3`,
      [status, result ? JSON.stringify(result) : null, id]
    );

    const updated = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, task: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
