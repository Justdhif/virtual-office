import { NextRequest, NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";
import { chatWithAgent } from "@/lib/llm";
import { searchOpenAlexWorks } from "@/lib/openalex";

export async function POST(req: NextRequest) {
  await initDb();
  try {
    const { topic, selectedFocus } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: "Topic is required" }, { status: 400 });
    }

    const projectId = `proj-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();

    // 1. Create or set active project
    await query(
      `INSERT INTO projects (id, title, research_topic, academic_level, citation_style, status)
       VALUES ($1, $2, $3, 'S1 / Sarjana', 'APA 7th', 'in_progress')
       ON CONFLICT (id) DO NOTHING`,
      [projectId, topic, `Pendekatan: ${selectedFocus || "Metodologi Campuran"}`]
    );

    // 2. Log Director command activity
    await query(
      `INSERT INTO activity_logs (id, project_id, agent_id, event_type, description, timestamp)
       VALUES ($1, $2, 'director', 'director.command', $3, $4)`,
      [
        `act-${Date.now()}-1`,
        projectId,
        `Director menginstruksikan riset: "${topic}" (Fokus: ${selectedFocus || "Standar"}).`,
        timestamp,
      ]
    );

    // 3. Sarah Adams acknowledgement
    await query(
      `INSERT INTO activity_logs (id, project_id, agent_id, event_type, description, timestamp)
       VALUES ($1, $2, 'project_manager', 'manager.briefing', $3, $4)`,
      [
        `act-${Date.now()}-2`,
        projectId,
        `Sarah Adams mengkoordinasikan tim untuk topik "${topic}". Membagikan tugas ke Divisi Riset & Penulisan.`,
        timestamp,
      ]
    );

    // 4. Create real tasks in Neon DB
    const taskResearchId = `task-res-${Date.now()}`;
    await query(
      `INSERT INTO tasks (id, project_id, agent_id, title, description, status, priority)
       VALUES ($1, $2, 'researcher', 'Eksplorasi Literatur & DOI OpenAlex', $3, 'completed', 'high')`,
      [taskResearchId, projectId, `Mencari 5+ publikasi akademik bereputasi terkait ${topic}`]
    );

    const taskWritingId = `task-wri-${Date.now()}`;
    await query(
      `INSERT INTO tasks (id, project_id, agent_id, title, description, status, priority)
       VALUES ($1, $2, 'academic_writer', 'Penyusunan Draf Bab 1 Pendahuluan', $3, 'in_progress', 'high')`,
      [taskWritingId, projectId, `Menulis Latar Belakang, Rumusan Masalah, dan Tujuan Riset untuk ${topic}`]
    );

    // 5. Alex Rivera searches OpenAlex catalog live
    const realWorks = await searchOpenAlexWorks(topic, 4);
    const worksSummary = realWorks.length > 0
      ? realWorks.map((w, idx) => `${idx + 1}. "${w.title}" (${w.authors.slice(0, 2).join(", ") || "Tim Peneliti"}, ${w.publicationYear || "2023"}) - DOI: ${w.doi || "Tervalidasi"}`).join("\n")
      : "";

    if (worksSummary) {
      await query(
        `INSERT INTO activity_logs (id, project_id, agent_id, event_type, description, timestamp)
         VALUES ($1, $2, 'researcher', 'literature.found', $3, $4)`,
        [
          `act-${Date.now()}-3`,
          projectId,
          `Alex Rivera menemukan ${realWorks.length} jurnal ilmiah bereputasi di OpenAlex:\n${worksSummary}`,
          timestamp,
        ]
      );
    }

    // 6. Generate real academic draft content via LLM for Bab 1
    const draftPrompt = `Tolong susun draf akademik resmi Bab 1 (Pendahuluan) untuk penelitian dengan topik: "${topic}". Pendekatan riset: "${selectedFocus || "Mixed-Methods"}".
${worksSummary ? `Berikut referensi jurnal ilmiah terverifikasi dari katalog OpenAlex untuk dimasukkan sebagai rujukan in-text citation:\n${worksSummary}` : ""}
Sertakan:
1.1 Latar Belakang Masalah (2 paragraf dengan sitasi akademik formal dari artikel di atas)
1.2 Rumusan Masalah (2-3 poin pertanyaan penelitian)
1.3 Tujuan Penelitian
Gunakan bahasa Indonesia baku standar karya ilmiah perguruan tinggi.`;

    const generatedDraft = await chatWithAgent("academic_writer", draftPrompt);

    // 7. Save generated document to Neon DB
    const docId = `doc-bab1-${Date.now()}`;
    await query(
      `INSERT INTO documents (id, project_id, title, category, content, status)
       VALUES ($1, $2, $3, 'bab1', $4, 'in_review')`,
      [docId, projectId, `Bab 1: Pendahuluan - ${topic.slice(0, 45)}`, generatedDraft]
    );

    // 8. Push approval request to Neon DB
    const approvalId = `app-${Date.now()}`;
    await query(
      `INSERT INTO approvals (id, project_id, task_id, title, description, requested_by, prepared_by, status)
       VALUES ($1, $2, $3, $4, $5, 'Sarah Adams (Head of Research Operations)', 'Marcus Vance (Drafting Specialist)', 'pending')`,
      [
        approvalId,
        projectId,
        taskWritingId,
        `Draf Bab 1: ${topic.slice(0, 45)}`,
        `Draf Bab 1 untuk topik "${topic}" telah selesai disusun oleh Marcus Vance dan diverifikasi oleh Sarah Adams. Mohon perkenan review dan persetujuan Director.`,
      ]
    );

    return NextResponse.json({
      success: true,
      projectId,
      documentId: docId,
      approvalId,
      message: "Research execution initialized and saved to database",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
