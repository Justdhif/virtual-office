import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";
import { chatWithAgent } from "@/lib/llm";

export async function GET(req: NextRequest) {
  await initDb();
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  try {
    let rows;
    if (agentId) {
      rows = await query(
        `SELECT * FROM conversations WHERE agent_id = $1 ORDER BY created_at ASC LIMIT 50`,
        [agentId]
      );
    } else {
      rows = await query(`SELECT * FROM conversations ORDER BY created_at ASC LIMIT 100`);
    }
    return NextResponse.json({ success: true, conversations: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const { agentId, message } = await req.json();

    if (!agentId || !message) {
      return NextResponse.json({ success: false, error: "Missing agentId or message" }, { status: 400 });
    }

    // 1. Get recent chat history with this agent
    const historyRows = await query(
      `SELECT sender, message FROM conversations WHERE agent_id = $1 ORDER BY created_at DESC LIMIT 6`,
      [agentId]
    );
    const history = historyRows.reverse();

    // 2. Save user message to database
    const userMsgId = `msg-user-${Date.now()}`;
    await query(
      `INSERT INTO conversations (id, agent_id, sender, message) VALUES ($1, $2, 'user', $3)`,
      [userMsgId, agentId, message]
    );

    // 3. Call LLM for agent response
    const agentReply = await chatWithAgent(agentId, message, history);

    // 4. Save agent reply to database
    const agentMsgId = `msg-agent-${Date.now()}`;
    await query(
      `INSERT INTO conversations (id, agent_id, sender, message) VALUES ($1, $2, 'agent', $3)`,
      [agentMsgId, agentId, agentReply]
    );

    return NextResponse.json({
      success: true,
      userMessage: { id: userMsgId, agent_id: agentId, sender: "user", message },
      agentMessage: { id: agentMsgId, agent_id: agentId, sender: "agent", message: agentReply },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
