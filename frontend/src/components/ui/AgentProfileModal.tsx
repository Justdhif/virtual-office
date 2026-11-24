"use client";

import React from "react";
import { X, Bot, Activity, Cpu, Shield, MessageSquare } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

const STATUS_CONFIG = {
  working: { color: "#4ade80", label: "Working", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
  thinking: { color: "#fbbf24", label: "Thinking", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)" },
  meeting: { color: "#22d3ee", label: "In Meeting", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.3)" },
  idle: { color: "#94a3b8", label: "Idle", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
};

export function AgentProfileModal() {
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const agents = useOfficeStore((s) => s.agents);
  const openChat = useOfficeStore((s) => s.openChat);

  if (!selectedAgentId) return null;
  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const statusCfg = STATUS_CONFIG[agent.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.idle;

  return (
    <div className="fixed top-16 sm:top-20 inset-x-3 sm:inset-x-auto sm:right-4 sm:w-96 max-h-[84vh] z-[90] animate-in slide-in-from-right duration-200 flex flex-col">
      <div
        className="rounded-2xl overflow-hidden flex flex-col max-h-full"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.97) 0%, rgba(15,23,42,0.95) 100%)",
          border: "1px solid rgba(148,163,184,0.12)",
          backdropFilter: "blur(32px)",
          boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 40px ${agent.color}15`,
        }}
      >
        {/* Header banner */}
        <div
          className="relative p-4 overflow-hidden flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${agent.color}22 0%, ${agent.color}08 100%)`,
            borderBottom: `1px solid ${agent.color}25`,
          }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20"
            style={{ background: agent.color }}
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-2xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${agent.color}44, ${agent.color}22)`,
                  border: `2px solid ${agent.color}50`,
                  boxShadow: `0 8px 24px ${agent.color}30`,
                }}
              >
                {agent.avatar}
              </div>

              <div>
                <h3 className="font-black text-white text-sm sm:text-base tracking-tight">{agent.name}</h3>
                <p className="text-xs font-medium mt-0.5" style={{ color: `${agent.color}cc` }}>
                  {agent.role}
                </p>
                {/* Status badge */}
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1"
                  style={{
                    background: statusCfg.bg,
                    border: `1px solid ${statusCfg.border}`,
                    color: statusCfg.color,
                  }}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === "working" ? "animate-ping" : "animate-pulse"
                    }`}
                    style={{ background: statusCfg.color }}
                  />
                  {statusCfg.label}
                </span>
              </div>
            </div>

            <button
              onClick={() => selectAgent(null)}
              className="p-2 rounded-xl text-slate-500 hover:text-white transition-all duration-200 flex-shrink-0"
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Grid stats */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(148,163,184,0.08)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Cpu className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Department</span>
              </div>
              <span className="text-xs font-bold text-slate-200">{agent.department}</span>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(148,163,184,0.08)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Activity className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Status</span>
              </div>
              <span className="text-xs font-bold" style={{ color: statusCfg.color }}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Current task */}
          <div
            className="p-3.5 rounded-xl"
            style={{
              background: "rgba(6,182,212,0.05)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Bot className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Current Task</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {agent.currentTask || "Standby — awaiting directives from Project Manager."}
            </p>
          </div>

          {/* Start Conversation Button */}
          <button
            onClick={() => {
              openChat(agent.id);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 text-slate-950 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              boxShadow: "0 4px 20px rgba(34,211,238,0.3)",
            }}
          >
            <MessageSquare className="w-4 h-4 text-slate-950" />
            <span>Bicara Langsung dengan {agent.name.split(" ")[0]}</span>
          </button>

          {/* Capabilities */}
          <div
            className="p-3.5 rounded-xl"
            style={{
              background: "rgba(15,23,42,0.5)",
              border: "1px solid rgba(148,163,184,0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</span>
            </div>
            <ul className="text-[11px] space-y-1.5 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                Academic data verification & scholarly reference checking
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                Structured inter-agent data communication protocol
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                Real-time status reporting via WebSocket pipeline
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(148,163,184,0.06)" }}
        >
          <span className="text-[9px] text-slate-600 font-mono tracking-wider">
            AGT/{agent.id.toUpperCase()}
          </span>
          <span
            className="text-[9px] font-bold flex items-center gap-1"
            style={{ color: "#4ade80" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
}
