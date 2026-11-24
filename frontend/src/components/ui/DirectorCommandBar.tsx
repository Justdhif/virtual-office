"use client";

import React, { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useOfficeStore, getSchedulePeriodInfo } from "@/store/useOfficeStore";
import { SarahClarificationModal } from "./SarahClarificationModal";

export function DirectorCommandBar() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");

  const currentProject = useOfficeStore((s) => s.currentProject);
  const addActivity = useOfficeStore((s) => s.addActivity);
  const updateAgentStatus = useOfficeStore((s) => s.updateAgentStatus);
  const addApproval = useOfficeStore((s) => s.addApproval);
  const virtualTime = useOfficeStore((s) => s.virtualTime);
  const toggleMeeting = useOfficeStore((s) => s.toggleMeeting);
  const setCameraTarget = useOfficeStore((s) => s.setCameraTarget);
  const openSarahClarification = useOfficeStore((s) => s.openSarahClarification);
  const fetchOfficeState = useOfficeStore((s) => s.fetchOfficeState);

  const handleExecute = async (inputPrompt: string) => {
    if (!inputPrompt.trim() || isRunning) return;

    // Check current schedule period
    const schedule = getSchedulePeriodInfo(virtualTime);
    if (schedule.period === "break") {
      addActivity({
        id: `break-notice-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: "project_manager",
        eventType: "schedule.break",
        description:
          "🍱 [JAM ISTIRAHAT SIANG] Seluruh karyawan sedang istirahat & makan siang di pantry. Sesuai kebijakan kantor, karyawan pure istirahat dan tidak mengerjakan pekerjaan. Tugas telah diantrekan untuk pukul 13:00. (Gunakan widget jam di atas jika ingin melompat langsung ke jam kerja).",
      });
      return;
    }

    if (schedule.period === "dorm_sleep") {
      addActivity({
        id: `sleep-notice-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: "project_manager",
        eventType: "schedule.sleep",
        description:
          "🌙 [JAM TIDUR MALAM] Karyawan sedang tidur di ranjang kamar asrama. Tugas diantrekan untuk jam masuk kerja esok hari. (Gunakan widget jam di atas jika ingin melompat langsung ke jam kerja).",
      });
      return;
    }

    if (schedule.period === "dorm_relax") {
      addActivity({
        id: `relax-notice-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: "project_manager",
        eventType: "schedule.relax",
        description:
          "🛋️ [JAM PULANG & SANTAI KAMAR] Karyawan sedang jam pulang santai menonton TV di kamar asrama. Tugas telah diantrekan untuk jam kerja esok hari. (Gunakan widget jam di atas jika ingin melompat langsung ke jam kerja).",
      });
      return;
    }

    // 1. Director sends instruction to Sarah Adams
    addActivity({
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "director",
      eventType: "director.command",
      description: `Director memberikan instruksi kepada Sarah Adams: "${inputPrompt}"`,
    });

    setPendingPrompt(inputPrompt);

    // 2. Sarah Adams presents clarification / confirmation modal before briefing the team
    openSarahClarification({
      instructionTopic: inputPrompt,
      question:
        "Director, instruksi topik riset telah saya terima. Sebelum saya kumpulkan seluruh tim divisi ke Meja Rapat Konferensi untuk membagikan tugas divisi, mohon izin konfirmasi fokus pendekatan riset yang diinginkan:",
      options: [
        "Metodologi Campuran (Mixed-Methods: Teori & Analisis Data)",
        "Kualitatif Murni (Tinjauan Teori & Studi Literatur Mendalam)",
        "Kuantitatif Murni (Uji Hipotesis & Analisis Statistik Regresi)",
      ],
    });
  };

  // Called when Director confirms clarification in SarahClarificationModal
  const handleConfirmBriefing = async (selectedFocus: string) => {
    const topic = pendingPrompt || prompt;
    if (!topic) return;

    setIsRunning(true);
    setPrompt("");

    // Trigger backend research orchestration & database persistence in background
    const backendPromise = fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, selectedFocus }),
    }).catch((err) => console.warn("Backend command trigger error:", err));

    // 1. Sarah acknowledges and announces team meeting
    addActivity({
      id: `sarah-ack-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "manager.call_meeting",
      description: `Sarah Adams: "Instruksi diterima, Director! Fokus riset: ${selectedFocus}. Saya kumpulkan seluruh tim divisi ke Meja Rapat Konferensi untuk briefing pembagian tugas sekarang."`,
    });

    // 2. Start meeting event: all 8 agents walk to meeting table & sit
    toggleMeeting();
    setCameraTarget([0, 0, 0]);

    await new Promise((r) => setTimeout(r, 4500));

    // 3. Sequential briefing speeches at conference table
    addActivity({
      id: `brief-1-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "meeting.briefing",
      description: `Sarah Adams memimpin rapat: "Selamat pagi rekan-rekan. Director menginstruksikan topik riset resmi: '${topic}'. Pendekatan: ${selectedFocus}. Mari bagi tugas divisi."`,
    });

    await new Promise((r) => setTimeout(r, 3000));

    addActivity({
      id: `brief-2-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "meeting.delegation",
      description: `Sarah Adams mendelegasikan tugas: "Divisi Riset (Alex & Elena), kumpulkan 10 metadata jurnal di OpenAlex/Crossref. Divisi Penulisan (Marcus & Chloe), siapkan kerangka draf Bab 1 & format sitasi APA 7th."`,
    });

    await new Promise((r) => setTimeout(r, 2500));

    addActivity({
      id: `brief-3-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "researcher",
      eventType: "meeting.response",
      description: `Alex Rivera: "Siap Bu Sarah, pencarian literatur dan verifikasi DOI segera kami proses."`,
    });

    await new Promise((r) => setTimeout(r, 2200));

    addActivity({
      id: `brief-4-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "academic_writer",
      eventType: "meeting.response",
      description: `Marcus Vance: "Siap Bu Sarah, penulisan kerangka draf Bab 1 segera kami mulai."`,
    });

    await new Promise((r) => setTimeout(r, 2500));

    addActivity({
      id: `brief-5-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "meeting.conclude",
      description: `Sarah Adams: "Briefing selesai! Silakan kembali ke workstation masing-masing dan mulai pengerjaan. Jika draf Bab 1 selesai, laporkan langsung ke saya."`,
    });

    // 4. Meeting ends: agents walk back to their desks
    toggleMeeting();

    await new Promise((r) => setTimeout(r, 4000));

    // 5. Execution Phase at Workstations:
    // Step A: Alex Rivera (Research)
    updateAgentStatus("researcher", "working", "Mencari publikasi akademik di OpenAlex & Crossref");
    addActivity({
      id: `work-1-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "researcher",
      eventType: "task.started",
      description: `Alex Rivera menemukan 5 artikel ilmiah open-access dengan DOI valid dari OpenAlex.`,
    });

    await new Promise((r) => setTimeout(r, 3500));
    updateAgentStatus("researcher", "idle");

    // Step B: Elena Rostova (Literature Gap)
    updateAgentStatus("literature_analyst", "thinking", "Memetakan Research Gap & Landasan Teori");
    addActivity({
      id: `work-2-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "literature_analyst",
      eventType: "task.progress",
      description: `Elena Rostova menyelesaikan matriks komparasi teori dan research gap.`,
    });

    await new Promise((r) => setTimeout(r, 3000));
    updateAgentStatus("literature_analyst", "idle");

    // Step C: Marcus Vance (Academic Writer) drafts Chapter 1
    updateAgentStatus("academic_writer", "working", "Menulis draf akademik Bab 1 (Pendahuluan)");
    addActivity({
      id: `work-3-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "academic_writer",
      eventType: "task.writing",
      description: `Marcus Vance sedang mengetik draf Bab 1 di workstation...`,
    });

    await new Promise((r) => setTimeout(r, 5500));
    updateAgentStatus("academic_writer", "idle");

    // 6. Marcus Vance reports to Sarah Adams (Hierarchical Reporting!)
    addActivity({
      id: `marcus-rep-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "academic_writer",
      eventType: "worker.report_to_manager",
      description: `Marcus Vance melapor ke Sarah Adams: "Izin Bu Sarah, draf Bab 1 untuk topik '${topic}' telah selesai saya susun. Mohon di-review."`,
    });

    await new Promise((r) => setTimeout(r, 2200));

    // 7. Sarah Adams reviews and reports to Director
    addActivity({
      id: `sarah-rep-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "manager.report_to_director",
      description: `Sarah Adams menghadap Director: "Director, draf Bab 1 dari Marcus telah saya verifikasi awal. Mutu penulisan sudah memenuhi kaidah. Saya ajukan ke meja Director untuk perkenan review dan approval."`,
    });

    await new Promise((r) => setTimeout(r, 1200));

    // 8. Push Approval Item for Director!
    addApproval({
      id: `app-${Date.now()}`,
      title: `Draf Bab 1: ${topic.slice(0, 45)}`,
      description: `Draf Bab 1 telah selesai disusun oleh Marcus Vance (Writing Department) dan diverifikasi oleh Sarah Adams. Mohon review Director apakah dapat di-Approve atau memerlukan instruksi revisi.`,
      requestedBy: "Sarah Adams (Head of Research Operations)",
      preparedBy: "Marcus Vance (Drafting Specialist)",
      status: "pending",
    });

    await backendPromise;
    await fetchOfficeState();

    setIsRunning(false);
  };

  return (
    <>
      {/* Sarah Adams Clarification Modal */}
      <SarahClarificationModal onConfirmBriefing={handleConfirmBriefing} />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-30 pointer-events-auto">
        <div
          className="rounded-2xl p-3 flex flex-col gap-2.5 shadow-2xl transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.92) 100%)",
            border: "1px solid rgba(148,163,184,0.12)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Quick action chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-0.5 scrollbar-none">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 pl-1 text-[11px] uppercase tracking-wider whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contoh Arahan:</span>
            </span>
            <button
              onClick={() => handleExecute("Pengaruh AI terhadap produktivitas skripsi mahasiswa")}
              disabled={isRunning}
              className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap"
              style={{
                background: "rgba(30,41,59,0.7)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              🚀 AI & Produktivitas Skripsi
            </button>
            <button
              onClick={() => handleExecute("Tantangan integritas akademik dan etika riset di era LLM")}
              disabled={isRunning}
              className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap"
              style={{
                background: "rgba(30,41,59,0.7)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              📚 Integritas Akademik di Era LLM
            </button>
            <button
              onClick={() => handleExecute("Analisis metodologi penelitian kuantitatif vs kualitatif")}
              disabled={isRunning}
              className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all whitespace-nowrap"
              style={{
                background: "rgba(30,41,59,0.7)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              🔬 Analisis Metodologi
            </button>
          </div>

          {/* Input Form: Instruction to Sarah Adams */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute(prompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
              placeholder={
                isRunning
                  ? "Sarah Adams sedang memimpin koordinasi tim riset..."
                  : "Instruksi Director ke Sarah Adams: Berikan tugas riset (Sarah akan memimpin briefing tim)..."
              }
              className="flex-1 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
              style={{
                background: "rgba(10,15,30,0.8)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isRunning}
              className="disabled:opacity-40 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm transition-all duration-200 text-slate-950 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
                boxShadow: "0 0 20px rgba(34,211,238,0.3), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <span>Kirim ke Sarah</span>
                  <Send className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
