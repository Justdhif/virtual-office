"use client";

import React from "react";
import { RotateCw, Hand, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";

export function CameraControlToolbar() {
  const cameraMode = useOfficeStore((s) => s.cameraMode);
  const setCameraMode = useOfficeStore((s) => s.setCameraMode);
  const triggerZoomIn = useOfficeStore((s) => s.triggerZoomIn);
  const triggerZoomOut = useOfficeStore((s) => s.triggerZoomOut);
  const resetCamera = useOfficeStore((s) => s.resetCamera);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[80] select-none pointer-events-auto">
      <div
        className="flex items-center gap-1 p-1 sm:p-1.5 rounded-2xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.94) 0%, rgba(15,23,42,0.92) 100%)",
          border: "1px solid rgba(148,163,184,0.14)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        {/* Mode 1: Rotate (Orbit) */}
        <button
          onClick={() => setCameraMode("rotate")}
          title="Mode Putar Sudut Pandang (Orbit 3D)"
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            cameraMode === "rotate"
              ? "text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
          style={
            cameraMode === "rotate"
              ? {
                  background: "linear-gradient(135deg, #22d3ee 0%, #38bdf8 100%)",
                  boxShadow: "0 0 16px rgba(34,211,238,0.4)",
                }
              : undefined
          }
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Rotate</span>
        </button>

        {/* Mode 2: Grab (Pan / Geser) */}
        <button
          onClick={() => setCameraMode("grab")}
          title="Mode Geser Denah Kantor (Drag & Pan)"
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            cameraMode === "grab"
              ? "text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
          style={
            cameraMode === "grab"
              ? {
                  background: "linear-gradient(135deg, #22d3ee 0%, #38bdf8 100%)",
                  boxShadow: "0 0 16px rgba(34,211,238,0.4)",
                }
              : undefined
          }
        >
          <Hand className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Grab</span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-5 bg-slate-700/60 mx-0.5 sm:mx-1" />

        {/* Quick Zoom In */}
        <button
          onClick={triggerZoomIn}
          title="Zoom In"
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Quick Zoom Out */}
        <button
          onClick={triggerZoomOut}
          title="Zoom Out"
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Center / Reset View */}
        <button
          onClick={resetCamera}
          title="Pusatkan Kamera ke Tengah Kantor"
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
