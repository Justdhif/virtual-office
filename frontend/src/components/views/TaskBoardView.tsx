"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Layers, Inbox } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENT_REGISTRY } from "@/lib/agents";

export function TaskBoardView() {
  const tasks = useOfficeStore((s) => s.tasks);
  const agents = useOfficeStore((s) => s.agents);
  const [mobileFilter, setMobileFilter] = useState<"all" | "backlog" | "in_progress" | "review" | "completed">("all");

  const backlogTasks = tasks.filter((t) => t.status === "backlog");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const reviewTasks = tasks.filter((t) => t.status === "review");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const getAgentName = (agentId: string) => {
    return AGENT_REGISTRY[agentId]?.name || agentId;
  };

  const getAgentColor = (agentId: string) => {
    return AGENT_REGISTRY[agentId]?.color || "#38bdf8";
  };

  return (
    <div className="w-full h-full p-4 sm:p-8 pt-20 sm:pt-24 overflow-y-auto bg-slate-950/95 text-white">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Multi-Agent Task Board</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Status tugas real-time dari database — sinkron dengan backend serverless.
            </p>
          </div>
          <div className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            Total Tugas: <span className="font-bold text-cyan-400">{tasks.length}</span>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "all", label: "Semua", count: tasks.length },
              { id: "backlog", label: "Backlog", count: backlogTasks.length },
              { id: "in_progress", label: "Active", count: inProgressTasks.length },
              { id: "review", label: "Review", count: reviewTasks.length },
              { id: "completed", label: "Selesai", count: completedTasks.length },
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setMobileFilter(id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  mobileFilter === id
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                <span>{label}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            ))}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto flex items-center justify-center bg-slate-800/60 border border-slate-700/60 text-slate-500">
              <Inbox className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-200">Database Tugas Kosong</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Belum ada tugas di database. Masukkan instruksi riset melalui Chat Agen untuk memulai alur kerja otomatis dan membagikan tugas ke tim divisi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. Backlog */}
            {(mobileFilter === "all" || mobileFilter === "backlog") && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>BACKLOG</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {backlogTasks.length}
                  </span>
                </div>
                {backlogTasks.length === 0 ? (
                  <p className="text-xs text-slate-600 italic text-center py-6">Kosong</p>
                ) : (
                  backlogTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <span
                        className="text-[10px] font-mono font-bold uppercase"
                        style={{ color: getAgentColor(task.agent_id) }}
                      >
                        {getAgentName(task.agent_id)}
                      </span>
                      <h4 className="font-semibold text-slate-200">{task.title}</h4>
                      {task.description && (
                        <p className="text-slate-400 text-[11px] leading-relaxed">{task.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. In Progress */}
            {(mobileFilter === "all" || mobileFilter === "in_progress") && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>IN PROGRESS</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">
                    {inProgressTasks.length}
                  </span>
                </div>
                {inProgressTasks.length === 0 ? (
                  <p className="text-xs text-slate-600 italic text-center py-6">Tidak ada tugas aktif</p>
                ) : (
                  inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-xs space-y-1.5 shadow-lg shadow-cyan-950/20"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className="font-mono font-bold uppercase"
                          style={{ color: getAgentColor(task.agent_id) }}
                        >
                          {getAgentName(task.agent_id)}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                      <h4 className="font-semibold text-slate-100">{task.title}</h4>
                      {task.description && (
                        <p className="text-slate-400 text-[11px] font-mono leading-relaxed">{task.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. Review & Verification */}
            {(mobileFilter === "all" || mobileFilter === "review") && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>REVIEW & VERIFIKASI</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px]">
                    {reviewTasks.length}
                  </span>
                </div>
                {reviewTasks.length === 0 ? (
                  <p className="text-xs text-slate-600 italic text-center py-6">Kosong</p>
                ) : (
                  reviewTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs space-y-1.5"
                    >
                      <span
                        className="text-[10px] font-mono font-bold uppercase"
                        style={{ color: getAgentColor(task.agent_id) }}
                      >
                        {getAgentName(task.agent_id)}
                      </span>
                      <h4 className="font-semibold text-slate-200">{task.title}</h4>
                      {task.description && (
                        <p className="text-slate-400 text-[11px] leading-relaxed">{task.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. Completed */}
            {(mobileFilter === "all" || mobileFilter === "completed") && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>SELESAI</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">
                    {completedTasks.length}
                  </span>
                </div>
                {completedTasks.length === 0 ? (
                  <p className="text-xs text-slate-600 italic text-center py-6">Belum ada tugas selesai</p>
                ) : (
                  completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs space-y-1.5"
                    >
                      <span
                        className="text-[10px] font-mono font-bold uppercase"
                        style={{ color: getAgentColor(task.agent_id) }}
                      >
                        {getAgentName(task.agent_id)}
                      </span>
                      <h4 className="font-semibold text-slate-200">{task.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi selesai
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
