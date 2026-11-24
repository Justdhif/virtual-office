"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Loader2, MessageSquare, ChevronDown } from "lucide-react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENT_REGISTRY, AgentInfo } from "@/lib/agents";

export function AgentChatDrawer() {
  const isChatOpen = useOfficeStore((s) => s.isChatOpen);
  const closeChat = useOfficeStore((s) => s.closeChat);
  const activeChatAgentId = useOfficeStore((s) => s.activeChatAgentId);
  const openChat = useOfficeStore((s) => s.openChat);
  const conversations = useOfficeStore((s) => s.conversations);
  const sendMessageToAgent = useOfficeStore((s) => s.sendMessageToAgent);
  const addActivity = useOfficeStore((s) => s.addActivity);
  const toggleMeeting = useOfficeStore((s) => s.toggleMeeting);
  const setCameraTarget = useOfficeStore((s) => s.setCameraTarget);
  const updateAgentStatus = useOfficeStore((s) => s.updateAgentStatus);
  const addApproval = useOfficeStore((s) => s.addApproval);
  const fetchOfficeState = useOfficeStore((s) => s.fetchOfficeState);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showAgentList, setShowAgentList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = activeChatAgentId ? AGENT_REGISTRY[activeChatAgentId] : null;
  const chatMessages = (activeChatAgentId && conversations[activeChatAgentId]) || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSending]);

  if (!isChatOpen || !agent) return null;

  // Execute full research workflow if message is a research instruction to Sarah Adams
  const triggerResearchWorkflow = async (topic: string) => {
    // 1. Send command to backend API (saves project, tasks, doc, approval to DB)
    const backendPromise = fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, selectedFocus: "Metodologi Campuran" }),
    }).catch((err) => console.warn("Backend command trigger error:", err));

    // 2. Sarah acknowledgment activity
    addActivity({
      id: `sarah-ack-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "manager.call_meeting",
      description: `Sarah Adams: "Instruksi diterima, Director! Topik: '${topic}'. Saya kumpulkan tim ke Meja Rapat Konferensi sekarang."`,
    });

    // 3. Start 3D Meeting animation
    toggleMeeting();
    setCameraTarget([0, 0, 0]);

    await new Promise((r) => setTimeout(r, 4500));

    addActivity({
      id: `brief-1-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "meeting.briefing",
      description: `Sarah Adams memimpin rapat: "Selamat pagi tim. Director menginstruksikan riset: '${topic}'. Mari bagi tugas divisi."`,
    });

    await new Promise((r) => setTimeout(r, 3000));

    addActivity({
      id: `brief-2-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "meeting.delegation",
      description: `Sarah Adams mendelegasikan tugas: "Alex & Elena kumpulkan literatur. Marcus siapkan draf Bab 1 & Chloe format sitasi APA 7th."`,
    });

    await new Promise((r) => setTimeout(r, 2500));

    // 4. End meeting and walk to desks
    toggleMeeting();

    await new Promise((r) => setTimeout(r, 3500));

    // 5. Workstation execution
    updateAgentStatus("researcher", "working", "Mencari publikasi akademik di OpenAlex & Crossref");
    addActivity({
      id: `work-1-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "researcher",
      eventType: "task.started",
      description: `Alex Rivera menemukan artikel ilmiah relevan dengan DOI terverifikasi.`,
    });

    await new Promise((r) => setTimeout(r, 3500));
    updateAgentStatus("researcher", "idle");

    updateAgentStatus("academic_writer", "working", "Menulis draf Bab 1 Pendahuluan");
    addActivity({
      id: `work-3-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "academic_writer",
      eventType: "task.writing",
      description: `Marcus Vance sedang menyusun draf Bab 1 di workstation...`,
    });

    await new Promise((r) => setTimeout(r, 4500));
    updateAgentStatus("academic_writer", "idle");

    addActivity({
      id: `sarah-rep-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: "manager.report_to_director",
      description: `Sarah Adams: "Director, draf Bab 1 telah selesai diverifikasi. Saya ajukan ke meja persetujuan Director."`,
    });

    addApproval({
      id: `app-${Date.now()}`,
      title: `Draf Bab 1: ${topic.slice(0, 45)}`,
      description: `Draf Bab 1 telah selesai disusun oleh Marcus Vance dan diverifikasi oleh Sarah Adams. Mohon perkenan review dan persetujuan Director.`,
      requestedBy: "Sarah Adams (Head of Research Operations)",
      preparedBy: "Marcus Vance (Drafting Specialist)",
      status: "pending",
    });

    await backendPromise;
    await fetchOfficeState();
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    try {
      await sendMessageToAgent(agent.id, text);

      // If user instructed Sarah Adams to start research, trigger the workflow
      const lower = text.toLowerCase();
      if (
        agent.id === "project_manager" &&
        (lower.includes("riset") || lower.includes("teliti") || lower.includes("skripsi") || lower.includes("bab 1") || lower.includes("pengaruh") || lower.includes("analisis"))
      ) {
        triggerResearchWorkflow(text);
      }
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts: Record<string, string[]> = {
    project_manager: [
      "🚀 Pengaruh AI terhadap produktivitas skripsi mahasiswa",
      "📚 Tantangan integritas akademik dan etika riset di era LLM",
      "🔬 Analisis metodologi penelitian kuantitatif vs kualitatif",
      "Bagaimana status progres tim riset saat ini?",
    ],
    researcher: [
      "Jurnal apa yang relevan dengan topik kita?",
      "Berapa banyak paper bereputasi yang sudah dicek?",
      "Bisa carikan studi empiris 5 tahun terakhir?",
    ],
    literature_analyst: [
      "Apa research gap paling menarik yang kamu temukan?",
      "Teori utama apa yang mendasari topik ini?",
    ],
    academic_writer: [
      "Bagaimana kerangka draf Bab 1 kita?",
      "Tolong jelaskan rumusan masalah yang tepat.",
    ],
    citation_specialist: [
      "Apakah format daftar pustaka sudah sesuai APA 7th?",
      "Pastikan semua DOI jurnal sudah valid ya.",
    ],
    data_analyst: [
      "Metode statistik apa yang paling tepat untuk hipotesis ini?",
      "Bagaimana interpretasi visualisasi chart-nya?",
    ],
    academic_editor: [
      "Bagaimana kualitas tata bahasa dan diksi akademik draf kita?",
      "Apakah alur argumen antar-paragraf sudah kohesif?",
    ],
    quality_reviewer: [
      "Apakah ada klaim tanpa rujukan yang perlu diwaspadai?",
      "Bagaimana hasil simulasi peer review draf ini?",
    ],
  };

  const suggestions = quickPrompts[agent.id] || [
    "Apa tugas utama yang sedang kamu kerjakan?",
    "Bagaimana pandanganmu tentang topik riset ini?",
  ];

  const allAgents = Object.values(AGENT_REGISTRY);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] z-[100] animate-in slide-in-from-right duration-300">
      <div
        className="h-full flex flex-col shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(2,6,23,0.98) 0%, rgba(15,23,42,0.96) 100%)",
          borderLeft: "1px solid rgba(148,163,184,0.15)",
          backdropFilter: "blur(32px)",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header with Agent Switcher */}
        <div
          className="p-3.5 flex items-center justify-between border-b relative"
          style={{
            background: `linear-gradient(135deg, ${agent.color}20, transparent)`,
            borderColor: "rgba(148,163,184,0.1)",
          }}
        >
          {/* Agent Selector Button */}
          <button
            onClick={() => setShowAgentList(!showAgentList)}
            className="flex items-center gap-2.5 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-800/60 transition text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${agent.color}44, ${agent.color}22)`,
                border: `1px solid ${agent.color}60`,
                boxShadow: `0 4px 16px ${agent.color}30`,
              }}
            >
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{agent.name}</h3>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{agent.role}</p>
            </div>
          </button>

          <button
            onClick={closeChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition"
            style={{
              background: "rgba(30,41,59,0.5)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dropdown Agent Switcher Popover */}
          {showAgentList && (
            <div
              className="absolute top-16 left-3 right-3 p-2 rounded-2xl z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1"
              style={{
                background: "rgba(2,6,23,0.98)",
                border: "1px solid rgba(148,163,184,0.15)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="px-2 py-1 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                Pilih Agen untuk Bicara:
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                {allAgents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      openChat(a.id);
                      setShowAgentList(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs transition ${
                      a.id === agent.id ? "bg-slate-800 text-cyan-300 font-bold" : "hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <span className="text-base">{a.avatar}</span>
                    <div className="flex-1 truncate">
                      <div className="truncate font-semibold">{a.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{a.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                style={{
                  background: `rgba(${parseInt(agent.color.slice(1, 3), 16) || 6}, ${parseInt(
                    agent.color.slice(3, 5),
                    16
                  ) || 182}, ${parseInt(agent.color.slice(5, 7), 16) || 212}, 0.15)`,
                  border: `1px solid ${agent.color}40`,
                }}
              >
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Mulai Percakapan dengan {agent.name}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  Bicara langsung dengan agen AI untuk menanyakan progres, merancang strategi riset, atau memberikan instruksi riset.
                </p>
              </div>

              {/* Suggestions / Quick Chips */}
              <div className="pt-3 space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Contoh Arahan & Pertanyaan:
                </span>
                {suggestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="w-full p-2.5 rounded-xl text-left text-xs transition-all text-slate-300 hover:text-white flex items-center justify-between group"
                    style={{
                      background: "rgba(30,41,59,0.5)",
                      border: "1px solid rgba(148,163,184,0.08)",
                    }}
                  >
                    <span className="leading-relaxed">{q}</span>
                    <Send className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: `${agent.color}33`, border: `1px solid ${agent.color}50` }}
                  >
                    {agent.avatar}
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "text-slate-950 font-medium"
                      : "text-slate-200"
                  }`}
                  style={
                    msg.sender === "user"
                      ? {
                          background: "linear-gradient(135deg, #22d3ee, #38bdf8)",
                          boxShadow: "0 2px 10px rgba(34,211,238,0.25)",
                        }
                      : {
                          background: "rgba(30,41,59,0.7)",
                          border: "1px solid rgba(148,163,184,0.1)",
                        }
                  }
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>

                {msg.sender === "user" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                    style={{
                      background: "linear-gradient(135deg, #0284c7, #2563eb)",
                      color: "#fff",
                    }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isSending && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${agent.color}33`, border: `1px solid ${agent.color}50` }}
              >
                {agent.avatar}
              </div>
              <div
                className="px-3 py-2 rounded-2xl flex items-center gap-2"
                style={{
                  background: "rgba(30,41,59,0.7)",
                  border: "1px solid rgba(148,163,184,0.1)",
                }}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="text-[11px] text-slate-300 font-medium">
                  {agent.name} sedang mengetik...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills Bar Above Input */}
        {agent.id === "project_manager" && (
          <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-800/80 bg-slate-950/60">
            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Arahan Cepat:
            </span>
            <button
              onClick={() => handleSend("Pengaruh AI terhadap produktivitas skripsi mahasiswa")}
              className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition"
            >
              🚀 AI & Skripsi
            </button>
            <button
              onClick={() => handleSend("Tantangan integritas akademik di era LLM")}
              className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition"
            >
              📚 Etika LLM
            </button>
            <button
              onClick={() => handleSend("Analisis metodologi kuantitatif vs kualitatif")}
              className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition"
            >
              🔬 Metodologi
            </button>
          </div>
        )}

        {/* Input Bar at Bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 pb-4 sm:pb-3 border-t flex-shrink-0"
          style={{
            background: "rgba(10,15,30,0.9)",
            borderColor: "rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder={`Bicara dengan ${agent.name}...`}
              className="flex-1 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              style={{
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.18)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2.5 rounded-xl transition text-slate-950 font-bold disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                boxShadow: "0 0 16px rgba(34,211,238,0.3)",
              }}
            >
              <Send className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
