"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X, Send, ArrowRight, CornerDownRight } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function ApprovalModal() {
  const approvals = useOfficeStore((s) => s.approvals);
  const resolveApproval = useOfficeStore((s) => s.resolveApproval);
  const addApproval = useOfficeStore((s) => s.addApproval);
  const addActivity = useOfficeStore((s) => s.addActivity);
  const updateAgentStatus = useOfficeStore((s) => s.updateAgentStatus);

  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const pendingApprovals = approvals.filter((a) => a.status === "pending" && a.id !== dismissedId);
  if (pendingApprovals.length === 0) return null;

  const current = pendingApprovals[0];

  const handleApprove = () => {
    resolveApproval(current.id, "approved");
    setIsRevisionMode(false);
    setRevisionNote("");

    // Sarah reports success to Director
    addActivity({
      id: `app-res-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "director",
      eventType: "director.approval",
      description: `Director telah menyetujui (APPROVE) "${current.title}".`,
    });

    addActivity({
      id: `sarah-ack-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "task.approved",
      description:
        'Sarah Adams: "Terima kasih banyak, Director! Draf Bab 1 telah resmi di-approve. Tim akan melanjutkan ke tahapan riset berikutnya."',
    });
  };

  const handleSendRevisionToSarah = () => {
    const finalNote = revisionNote.trim() || "Perkuat argumen latar belakang masalah dan tambahkan perbandingan studi 2024.";
    resolveApproval(current.id, "rejected", finalNote);
    setIsRevisionMode(false);
    setRevisionNote("");

    // 1. Director sends revision instruction to Sarah Adams
    addActivity({
      id: `rev-cmd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "director",
      eventType: "director.revision",
      description: `Director memberikan instruksi revisi kepada Sarah Adams: "${finalNote}".`,
    });

    // 2. Sarah Adams commands the author (Marcus Vance)
    setTimeout(() => {
      addActivity({
        id: `sarah-relay-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: "project_manager",
        eventType: "manager.delegate_revision",
        description: `Sarah Adams memanggil Marcus Vance: "Marcus, Director telah mereview dan meminta revisi: '${finalNote}'. Segera perbaiki ya."`,
      });

      // 3. Marcus Vance accepts and starts working on revision
      setTimeout(() => {
        addActivity({
          id: `marcus-ack-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          agentId: "academic_writer",
          eventType: "worker.ack_revision",
          description:
            'Marcus Vance: "Siap Bu Sarah, catatan dari Director segera saya perbaiki sekarang."',
        });
        updateAgentStatus("academic_writer", "working", `Merevisi draf Bab 1: ${finalNote}`);

        // 4. After finishing revision, Marcus reports back to Sarah, and Sarah requests review from Director again!
        setTimeout(() => {
          updateAgentStatus("academic_writer", "idle");

          addActivity({
            id: `marcus-done-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            agentId: "academic_writer",
            eventType: "worker.report_to_manager",
            description:
              'Marcus Vance lapor ke Sarah Adams: "Izin Bu Sarah, revisi draf Bab 1 telah selesai saya perbaiki sesuai catatan Director. Mohon di-review."',
          });

          setTimeout(() => {
            addActivity({
              id: `sarah-to-director-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              agentId: "project_manager",
              eventType: "manager.report_to_director",
              description:
                'Sarah Adams menghadap Director: "Director, revisi Bab 1 dari Marcus telah siap di meja Anda. Mohon perkenan Director untuk mereview kembali."',
            });

            // Re-submit revised document for Director approval
            addApproval({
              id: `app-revised-${Date.now()}`,
              title: `[Hasil Revisi] ${current.title}`,
              description: `Draf Bab 1 telah disesuaikan dengan instruksi Director: "${finalNote}".`,
              requestedBy: "Sarah Adams (Head of Research Operations)",
              preparedBy: "Marcus Vance (Drafting Specialist)",
              status: "pending",
            });
          }, 1800);
        }, 5000);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-lg z-[110] animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl border-2 border-amber-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-amber-500/20 text-white relative">
        <button
          onClick={() => setDismissedId(current.id)}
          title="Tutup (dapat ditinjau nanti)"
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Hierarchical Attribution */}
        <div className="flex items-start gap-3 pr-6">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Persetujuan Director Diperlukan
              </span>
              <span className="text-[11px] font-semibold text-cyan-300">
                {current.requestedBy || "Sarah Adams (Head of Operations)"}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-100 mt-1">{current.title}</h3>
            {current.preparedBy && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <CornerDownRight className="w-3 h-3 text-emerald-400" />
                <span>Disusun oleh: <strong className="text-slate-200">{current.preparedBy}</strong></span>
              </p>
            )}
            <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              {current.description}
            </p>
          </div>
        </div>

        {/* Revision Input Box */}
        {isRevisionMode ? (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-300">
                Instruksi Catatan Revisi Anda ke Sarah Adams:
              </span>
              <button
                type="button"
                onClick={() => setIsRevisionMode(false)}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Batal
              </button>
            </div>

            {/* Quick Note Suggestions */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {[
                "Tambahkan perbandingan studi 2024",
                "Perkuat latar belakang & urgensi riset",
                "Perbaiki keterbacaan & format sitasi APA 7th",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRevisionNote(chip)}
                  className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Ketik catatan revisi Anda di sini, Sarah Adams yang akan meneruskan ke tim..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRevisionMode(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSendRevisionToSarah}
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Kirim Instruksi Revisi ke Sarah</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Action Buttons */
          <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="text-[11px] text-slate-400">
              Sarah Adams menunggu keputusan Anda:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRevisionMode(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <XCircle className="w-4 h-4" />
                <span>Minta Revisi</span>
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui Draf (Approve)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
