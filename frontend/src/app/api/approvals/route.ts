import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    let approvals;
    if (status) {
      approvals = await query(
        `SELECT * FROM approvals WHERE status = $1 ORDER BY created_at DESC`,
        [status]
      );
    } else {
      approvals = await query(`SELECT * FROM approvals ORDER BY created_at DESC`);
    }

    return NextResponse.json({ success: true, approvals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const id = body.id || `app-${Date.now()}`;
    const projectId = body.projectId || body.project_id || null;
    const taskId = body.taskId || body.task_id || null;
    const title = body.title || "Persetujuan Dokumen";
    const description = body.description || "";
    const requestedBy = body.requestedBy || body.requested_by || "Sarah Adams";
    const preparedBy = body.preparedBy || body.prepared_by || "Marcus Vance";
    const status = body.status || "pending";

    await query(
      `INSERT INTO approvals (id, project_id, task_id, title, description, requested_by, prepared_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, projectId, taskId, title, description, requestedBy, preparedBy, status]
    );

    const created = await query(`SELECT * FROM approvals WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, approval: created[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await initDb();
  try {
    const body = await req.json();
    const { id, status, reviewerComment } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    await query(
      `UPDATE approvals
       SET status = $1,
           reviewer_comment = COALESCE($2, reviewer_comment),
           updated_at = NOW()
       WHERE id = $3`,
      [status, reviewerComment || null, id]
    );

    const updated = await query(`SELECT * FROM approvals WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, approval: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
