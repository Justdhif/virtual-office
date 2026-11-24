"use client";

import React, { useState } from "react";
import { HelpCircle, Users, Check, ArrowRight, X } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function SarahClarificationModal({
  onConfirmBriefing,
}: {
  onConfirmBriefing: (selectedFocus: string) => void;
}) {
  const sarahClarification = useOfficeStore((s) => s.sarahClarification);
  const closeSarahClarification = useOfficeStore((s) => s.closeSarahClarification);

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customNote, setCustomNote] = useState<string>("");

  if (!sarahClarification || !sarahClarification.isOpen) return null;

  const handleProceed = () => {
    const finalAnswer =
      customNote.trim() ||
      selectedOption ||
      "Metodologi Campuran (Mixed-Methods: Teori & Analisis Data)";
    closeSarahClarification();
    onConfirmBriefing(finalAnswer);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white relative"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.97) 0%, rgba(15,23,42,0.95) 100%)",
          border: "1px solid rgba(34,211,238,0.3)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(34,211,238,0.1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeSarahClarification}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition"
          style={{
            background: "rgba(30,41,59,0.5)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Sarah Adams Profile & Hierarchy */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
              boxShadow: "0 0 20px rgba(34,211,238,0.35)",
            }}
          >
            👩‍💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">Sarah Adams</h3>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                style={{
                  background: "rgba(34,211,238,0.12)",
                  border: "1px solid rgba(34,211,238,0.3)",
                  color: "#22d3ee",
                }}
              >
                Executive Lead
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Head of Research Operations</p>
          </div>
        </div>

        {/* Dialog Question */}
        <div className="mt-4 space-y-3">
          <div
            className="p-4 rounded-2xl text-xs text-slate-200 leading-relaxed"
            style={{
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <span className="font-bold text-cyan-300">Topik Arahan:</span>{" "}
            <span className="italic font-medium text-white">
              "{sarahClarification.instructionTopic}"
            </span>
            <p className="mt-2 text-slate-300">
              {sarahClarification.question}
            </p>
          </div>

          {/* Clarification Options */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pilih Fokus Pendekatan Riset:
            </p>
            {sarahClarification.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className="w-full p-3.5 rounded-2xl text-xs text-left transition-all flex items-center justify-between"
                style={
                  selectedOption === opt
                    ? {
                        background: "rgba(34,211,238,0.15)",
                        border: "1px solid #22d3ee",
                        color: "#67e8f9",
                        boxShadow: "0 0 16px rgba(34,211,238,0.15)",
                      }
                    : {
                        background: "rgba(15,23,42,0.5)",
                        border: "1px solid rgba(148,163,184,0.08)",
                        color: "rgba(226,232,240,0.8)",
                      }
                }
              >
                <span className="font-medium">{opt}</span>
                {selectedOption === opt && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Optional Direct Note */}
          <div className="mt-2">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Atau ketik catatan arahan tambahan khusus untuk Sarah..."
              className="w-full rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              style={{
                background: "rgba(10,15,30,0.8)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              closeSarahClarification();
              onConfirmBriefing("Instruksi Standar Terarah");
            }}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Lewati konfirmasi
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 text-slate-950 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              boxShadow: "0 0 20px rgba(34,211,238,0.3), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <Users className="w-4 h-4 text-slate-950" />
            <span>Mulai Rapat Tim</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
