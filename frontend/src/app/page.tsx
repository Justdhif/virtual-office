"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { MessageSquare } from "lucide-react";
import { OfficeHeader } from "@/components/ui/OfficeHeader";
import { AgentProfileModal } from "@/components/ui/AgentProfileModal";
import { ApprovalModal } from "@/components/ui/ApprovalModal";
import { AgentChatDrawer } from "@/components/ui/AgentChatDrawer";
import { CameraControlToolbar } from "@/components/ui/CameraControlToolbar";
import { TaskBoardView } from "@/components/views/TaskBoardView";
import { DocumentCenterView } from "@/components/views/DocumentCenterView";
import { ApprovalsView } from "@/components/views/ApprovalsView";
import { ActivityFeedView } from "@/components/views/ActivityFeedView";
import { useOfficeStore } from "@/store/useOfficeStore";

// Dynamically load 3D Canvas to bypass SSR
const OfficeCanvas = dynamic(
  () => import("@/components/office/OfficeCanvas").then((mod) => mod.OfficeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest uppercase text-cyan-400">
          Loading 3D Virtual Office Environment...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const activeTab = useOfficeStore((s) => s.activeTab);
  const fetchOfficeState = useOfficeStore((s) => s.fetchOfficeState);
  const openChat = useOfficeStore((s) => s.openChat);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const isChatOpen = useOfficeStore((s) => s.isChatOpen);

  useEffect(() => {
    // Dynamically fetch current state from backend/Neon DB
    fetchOfficeState();
  }, [fetchOfficeState]);

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950 select-none">
      {/* Universal Floating Header */}
      <OfficeHeader />

      {/* Main View Switcher */}
      {activeTab === "office" && (
        <>
          {/* 3D Three.js Office Canvas */}
          <div className="w-full h-full">
            <OfficeCanvas />
          </div>

          {/* Floating UI Overlays */}
          <AgentProfileModal />
          <ApprovalModal />
          <CameraControlToolbar />

          {/* Quick Floating Chat Button (Bottom Right) - hidden when drawer is already open */}
          {!isChatOpen && (
            <button
              onClick={() => openChat(selectedAgentId || "project_manager")}
              title="Bicara dengan AI Agent"
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80] p-3 sm:px-5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-2.5 text-xs font-bold text-slate-950 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
                boxShadow: "0 8px 32px rgba(34,211,238,0.45), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span className="hidden xs:inline">Chat dengan Agen</span>
              <span className="xs:hidden">Chat</span>
            </button>
          )}
        </>
      )}

      {/* Interactive AI Agent Conversation Drawer (Available in any tab) */}
      <AgentChatDrawer />

      {activeTab === "tasks" && <TaskBoardView />}
      {activeTab === "documents" && <DocumentCenterView />}
      {activeTab === "approvals" && <ApprovalsView />}
      {activeTab === "activity" && <ActivityFeedView />}
    </main>
  );
}
