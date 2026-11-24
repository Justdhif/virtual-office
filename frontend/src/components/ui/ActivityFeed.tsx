"use client";

import React, { useEffect } from "react";
import { Activity, ChevronDown, ChevronUp, Circle } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function ActivityFeed() {
  const activityFeed = useOfficeStore((s) => s.activityFeed);
  const isFeedOpen = useOfficeStore((s) => s.isFeedOpen);
  const toggleFeed = useOfficeStore((s) => s.toggleFeed);

  // Auto-collapse on small mobile screens on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && isFeedOpen) {
      toggleFeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-16 sm:top-20 left-2 sm:left-4 w-72 sm:w-80 max-w-[calc(100vw-1rem)] z-[80]">
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.92) 100%)",
          border: "1px solid rgba(148,163,184,0.1)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Header */}
        <div
          onClick={toggleFeed}
          className="px-4 py-3 flex items-center justify-between cursor-pointer select-none"
          style={{ borderBottom: "1px solid rgba(148,163,184,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(59,130,246,0.2))",
                border: "1px solid rgba(34,211,238,0.3)",
              }}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 tracking-wide">Office Activity</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">LIVE FEED</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activityFeed.length > 0 && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(34,211,238,0.15)",
                  border: "1px solid rgba(34,211,238,0.3)",
                  color: "#22d3ee",
                }}
              >
                {activityFeed.length}
              </span>
            )}
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              {isFeedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Feed list */}
        {isFeedOpen && (
          <div className="max-h-72 overflow-y-auto">
            {activityFeed.length === 0 ? (
              <div className="p-6 text-center">
                <Circle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600 italic">No activity yet</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {activityFeed.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl transition-all duration-200"
                    style={{
                      background: idx === 0 ? "rgba(34,211,238,0.06)" : "rgba(15,23,42,0.5)",
                      border: idx === 0 ? "1px solid rgba(34,211,238,0.15)" : "1px solid rgba(148,163,184,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: "#22d3ee" }}
                      >
                        {item.agentId || "System"}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
