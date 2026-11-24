"use client";

import React, { useState } from "react";
import { Download, FileText, CheckCircle, ExternalLink, Bookmark, Inbox } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function DocumentCenterView() {
  const currentProject = useOfficeStore((s) => s.currentProject);
  const documents = useOfficeStore((s) => s.documents);

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleExportTxt = () => {
    if (!activeDoc) return;
    const blob = new Blob([activeDoc.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDoc.title || "dokumen"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full p-4 sm:p-8 pt-20 sm:pt-24 overflow-y-auto bg-slate-950/95 text-white">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Document & Citation Center</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Hasil draf karya ilmiah & daftar pustaka yang tersimpan di database Neon PostgreSQL.
            </p>
          </div>
          {activeDoc && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportTxt}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition text-slate-200"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span>Export TXT</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-slate-800/60 border border-slate-700/60 text-slate-500">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Database Dokumen Kosong</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Belum ada draf akademik yang tersimpan di database. Kirimkan instruksi riset di halaman utama agar agen Academic Writer menyusun draf bab secara otomatis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Document Selection Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto scrollbar-none">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeDoc?.id === doc.id
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>

            {/* Document Content View */}
            {activeDoc && (
              <div
                className="rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl space-y-6 text-slate-200 text-sm leading-relaxed border"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.9) 100%)",
                  borderColor: "rgba(148,163,184,0.12)",
                }}
              >
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    DRAF RESMI DARI DATABASE POSTGRESQL
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {activeDoc.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-300">
                      Status: {activeDoc.status || "draft"}
                    </span>
                    {activeDoc.created_at && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Dibuat: {new Date(activeDoc.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  {activeDoc.content}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
