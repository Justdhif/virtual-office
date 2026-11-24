"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Clock } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function OfficeScheduleWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const virtualTime = useOfficeStore((s) => s.virtualTime);
  const setVirtualTime = useOfficeStore((s) => s.setVirtualTime);
  const stepVirtualTime = useOfficeStore((s) => s.stepVirtualTime);

  // Office clock runs continuously: 1 real second = 1 office minute
  useEffect(() => {
    const interval = setInterval(() => {
      stepVirtualTime(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stepVirtualTime]);

  const hours = Math.floor(virtualTime / 60) % 24;
  const minutes = Math.floor(virtualTime % 60);
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  const isNight = virtualTime >= 1170 || virtualTime < 390;

  return (
    <div className="relative pointer-events-auto">
      {/* Pure Digital Clock Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl hover:bg-slate-800/60 transition text-xs font-medium"
        style={{
          background: "rgba(15,23,42,0.8)",
          border: "1px solid rgba(148,163,184,0.12)",
          backdropFilter: "blur(12px)",
        }}
        title="Atur Waktu Kantor"
      >
        {isNight ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="font-mono font-bold text-slate-100 tracking-wider text-[11px] sm:text-xs">{formattedTime}</span>
      </button>

      {/* Minimalist Slider Popover to adjust time / lighting */}
      {isOpen && (
        <div
          className="absolute top-11 right-0 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)] p-3.5 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{
            background: "linear-gradient(135deg, rgba(2,6,23,0.98) 0%, rgba(15,23,42,0.95) 100%)",
            border: "1px solid rgba(148,163,184,0.15)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Waktu Kantor</span>
            </span>
            <span className="font-mono font-bold text-xs text-cyan-400">{formattedTime}</span>
          </div>

          <input
            type="range"
            min="0"
            max="1439"
            step="10"
            value={virtualTime}
            onChange={(e) => setVirtualTime(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-mono">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>
      )}
    </div>
  );
}
