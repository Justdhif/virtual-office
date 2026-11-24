"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Sparkles,
  MessageSquare,
  Bot,
  Inbox,
  Calendar,
} from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function ActivityFeedView() {
  const activityFeed = useOfficeStore((s) => s.activityFeed);
  const agents = useOfficeStore((s) => s.agents);
  const openChat = useOfficeStore((s) => s.openChat);
  const fetchOfficeState = useOfficeStore((s) => s.fetchOfficeState);
  const isLoadingData = useOfficeStore((s) => s.isLoadingData);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>("all");

  // Create a quick lookup map for agent visual data
  const agentMap = useMemo(() => {
    const map = new Map<string, (typeof agents)[0]>();
    agents.forEach((a) => map.set(a.id, a));
    return map;
  }, [agents]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activityFeed.filter((act) => {
      // Filter by agent
      if (selectedAgentFilter !== "all") {
        const matchesAgent =
          act.agentId === selectedAgentFilter ||
          (!act.agentId && selectedAgentFilter === "system");
        if (!matchesAgent) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const descMatch = act.description?.toLowerCase().includes(q);
        const typeMatch = act.eventType?.toLowerCase().includes(q);
        const agentNameMatch = act.agentId
          ? agentMap.get(act.agentId)?.name.toLowerCase().includes(q)
          : false;

        if (!descMatch && !typeMatch && !agentNameMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activityFeed, selectedAgentFilter, searchQuery, agentMap]);

  const getEventTypeBadge = (type?: string) => {
    const t = (type || "log").toLowerCase();
    if (t.includes("task") || t.includes("complete")) {
      return {
        bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        label: type || "Task",
      };
    }
    if (t.includes("approval") || t.includes("review")) {
      return {
        bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        label: type || "Approval",
      };
    }
    if (t.includes("error") || t.includes("fail")) {
      return {
        bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        label: type || "Alert",
      };
    }
    if (t.includes("research") || t.includes("doc")) {
      return {
        bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        label: type || "Research",
      };
    }
    return {
      bg: "bg-slate-700/30 text-slate-300 border-slate-600/40",
      label: type || "Event",
    };
  };

  return (
    <div className="w-full h-full p-4 sm:p-8 pt-20 sm:pt-24 overflow-y-auto bg-slate-950/95 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(59,130,246,0.2) 100%)",
                  border: "1px solid rgba(34,211,238,0.35)",
                  boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                }}
              >
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                  Office Activity & Audit Logs
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Feed
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Histori aktivitas kantor virtual, progres pengerjaan agen AI, sinkronisasi literatur, dan log eksekusi riset.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total:</span>
              <span className="font-bold text-cyan-300">{activityFeed.length}</span>
            </div>

            <button
              onClick={() => fetchOfficeState()}
              disabled={isLoadingData}
              title="Refresh Aktivitas"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin text-cyan-400" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari aktivitas, keyword, atau tipe event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Agent Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3" />
              Filter Agen:
            </span>

            <button
              onClick={() => setSelectedAgentFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedAgentFilter === "all"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              Semua ({activityFeed.length})
            </button>

            {agents.map((agent) => {
              const count = activityFeed.filter((a) => a.agentId === agent.id).length;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentFilter(agent.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 ${
                    selectedAgentFilter === agent.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{agent.avatar}</span>
                  <span>{agent.name.split(" ")[0]}</span>
                  {count > 0 && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        selectedAgentFilter === agent.id
                          ? "bg-slate-950/30 text-slate-950"
                          : "bg-slate-800 text-cyan-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setSelectedAgentFilter("system")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 ${
                selectedAgentFilter === "system"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Bot className="w-3 h-3" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Activity Feed Content List */}
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-slate-800/60 border border-slate-700/60 text-slate-500">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              {searchQuery || selectedAgentFilter !== "all"
                ? "Tidak Ada Log Aktivitas yang Cocok"
                : "Belum Ada Catatan Aktivitas Kantor"}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {searchQuery || selectedAgentFilter !== "all"
                ? "Coba ubah kata kunci pencarian atau reset filter agen untuk melihat seluruh riwayat."
                : "Ketika agen AI mulai bekerja, menyusun draf, menganalisis jurnal, atau menghadiri rapat tim, seluruh aktivitas akan tercatat secara otomatis di sini."}
            </p>
            {(searchQuery || selectedAgentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAgentFilter("all");
                }}
                className="mt-2 text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((act, index) => {
              const agent = act.agentId ? agentMap.get(act.agentId) : null;
              const badge = getEventTypeBadge(act.eventType);

              return (
                <div
                  key={act.id || `act-${index}`}
                  className="p-4 rounded-2xl border transition-all duration-200 hover:border-slate-700/80 group"
                  style={{
                    background:
                      index === 0 && selectedAgentFilter === "all" && !searchQuery
                        ? "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(15,23,42,0.6) 100%)"
                        : "rgba(15,23,42,0.6)",
                    borderColor:
                      index === 0 && selectedAgentFilter === "all" && !searchQuery
                        ? "rgba(34,211,238,0.25)"
                        : "rgba(148,163,184,0.08)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar / Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg shadow-inner"
                        style={{
                          background: agent
                            ? `${agent.color}20`
                            : "rgba(30,41,59,0.8)",
                          border: `1px solid ${agent ? agent.color + "40" : "rgba(148,163,184,0.2)"}`,
                        }}
                      >
                        {agent?.avatar || "🤖"}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-200">
                            {agent ? agent.name : act.agentId || "System Core"}
                          </span>

                          {agent && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {agent.role}
                            </span>
                          )}

                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>

                          {index === 0 && !searchQuery && selectedAgentFilter === "all" && (
                            <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Terbaru
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {act.description}
                        </p>

                        {/* Metadata preview if exists */}
                        {act.metadata && Object.keys(act.metadata).length > 0 && (
                          <div className="pt-1 flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-mono">
                            {Object.entries(act.metadata).map(([key, val]) => (
                              <span
                                key={key}
                                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800"
                              >
                                {key}: {String(val)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Timestamp & Quick Chat */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{act.timestamp || "Baru saja"}</span>
                      </div>

                      {act.agentId && (
                        <button
                          onClick={() => openChat(act.agentId!)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 transition-all opacity-85 hover:opacity-100"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
