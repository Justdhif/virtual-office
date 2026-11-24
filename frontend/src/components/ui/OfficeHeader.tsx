"use client";

import React from "react";
import { Building2, RotateCcw, Layers, FileText, CheckSquare, Zap, Activity } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { OfficeScheduleWidget } from "./OfficeScheduleWidget";

export function OfficeHeader() {
  const resetCamera = useOfficeStore((s) => s.resetCamera);
  const currentProject = useOfficeStore((s) => s.currentProject);
  const activeTab = useOfficeStore((s) => s.activeTab);
  const setActiveTab = useOfficeStore((s) => s.setActiveTab);
  const approvals = useOfficeStore((s) => s.approvals);

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] pointer-events-none">
      {/* Main header bar */}
      <div
        className="mx-2 sm:mx-4 mt-2 sm:mt-3 flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl pointer-events-auto"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.92) 100%)",
          border: "1px solid rgba(148,163,184,0.12)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              boxShadow: "0 0 20px rgba(34,211,238,0.35), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </div>

          {/* Brand name */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-white">
                ResearchVerse
              </h1>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  background: "linear-gradient(135deg, #22d3ee20, #3b82f620)",
                  border: "1px solid #22d3ee40",
                  color: "#22d3ee",
                }}
              >
                AI
              </span>
              {/* Live badge */}
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[9px] text-slate-500 tracking-wide font-medium mt-0.5">
              3D Multi-Agent Virtual Research Office
            </p>
          </div>

          {/* Project pill */}
          {currentProject && (
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
              style={{
                background: "rgba(30,41,59,0.6)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-200 font-medium truncate max-w-[200px]">
                {currentProject.title}
              </span>
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.3)",
                  color: "#22d3ee",
                }}
              >
                {currentProject.citationStyle}
              </span>
            </div>
          )}
        </div>

        {/* Center: Navigation tabs */}
        <div
          className="flex items-center rounded-xl p-0.5 sm:p-1 gap-0.5"
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(148,163,184,0.08)",
          }}
        >
          {[
            { id: "office", label: "3D Office", Icon: Building2 },
            { id: "tasks", label: "Tasks", Icon: Layers },
            { id: "documents", label: "Docs", Icon: FileText },
            { id: "approvals", label: "Approvals", Icon: CheckSquare },
            { id: "activity", label: "Activity", Icon: Activity },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as "office" | "tasks" | "documents" | "approvals" | "activity")}
              className="relative px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
              style={
                activeTab === id
                  ? {
                      background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
                      color: "#020617",
                      boxShadow: "0 0 16px rgba(34,211,238,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                    }
                  : { color: "rgba(148,163,184,0.8)" }
              }
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              {id === "approvals" && pendingCount > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <OfficeScheduleWidget />

          <button
            onClick={resetCamera}
            title="Reset Posisi Kamera"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all duration-200"
            style={{
              background: "rgba(30,41,59,0.6)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
