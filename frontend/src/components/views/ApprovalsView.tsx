"use client";

import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, Inbox } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function ApprovalsView() {
  const approvals = useOfficeStore((s) => s.approvals);
  const resolveApproval = useOfficeStore((s) => s.resolveApproval);
  const addActivity = useOfficeStore((s) => s.addActivity);

  return (
    <div className="w-full h-full p-4 sm:p-8 pt-20 sm:pt-24 overflow-y-auto bg-slate-950/95 text-white">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Director Approval Checkpoints</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Prinsip Human-in-the-Loop: Agen AI tidak membuat keputusan akademik akhir tanpa otorisasi Director.
            </p>
          </div>
          <div className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            Pending: <span className="font-bold text-amber-400">{approvals.filter((a) => a.status === "pending").length}</span>
          </div>
        </div>

        {approvals.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-slate-800/60 border border-slate-700/60 text-slate-500">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Database Approval Kosong</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Tidak ada permohonan persetujuan di database. Ketika draf selesai disusun oleh tim agen AI, Sarah Adams akan mengirimkan permohonan approval ke sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 ${
                  item.status === "pending"
                    ? "bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-500/10"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.status === "pending"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : item.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">Diajukan: {item.requestedBy}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    {item.revisionNotes && (
                      <p className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                        Catatan Revisi: {item.revisionNotes}
                      </p>
                    )}
                  </div>

                  {item.status === "pending" && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const note = prompt("Catatan instruksi revisi untuk Sarah & Marcus:") || "Perlu revisi lebih mendalam.";
                          resolveApproval(item.id, "rejected", note);
                          addActivity({
                            id: `act-${Date.now()}`,
                            timestamp: new Date().toLocaleTimeString(),
                            agentId: "director",
                            eventType: "approval.rejected",
                            description: `Director meminta revisi untuk: "${item.title}". Catatan: ${note}`,
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <XCircle className="w-4 h-4" /> Minta Revisi
                      </button>
                      <button
                        onClick={() => {
                          resolveApproval(item.id, "approved");
                          addActivity({
                            id: `act-${Date.now()}`,
                            timestamp: new Date().toLocaleTimeString(),
                            agentId: "director",
                            eventType: "approval.approved",
                            description: `Director menyetujui: "${item.title}". Draf resmi disahkan.`,
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
