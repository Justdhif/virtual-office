import { create } from "zustand";
import {
  AgentVisual,
  ActivityEvent,
  ProjectData,
  ApprovalItem,
  TaskItem,
  DocumentItem,
  ConversationMessage,
  ScheduleInfo,
} from "@/types";

export function getSchedulePeriodInfo(timeInMinutes: number): ScheduleInfo {
  const m = ((timeInMinutes % 1440) + 1440) % 1440;

  if (m >= 480 && m < 540) {
    // 08:00 - 09:00
    return {
      period: "clock_in",
      label: "Jam Masuk Kantor",
      sublabel: "Persiapan & Menuju Meja Kerja (08:00 - 09:00)",
      icon: "🌅",
      color: "#06b6d4",
    };
  } else if ((m >= 540 && m < 720) || (m >= 780 && m < 1020)) {
    // 09:00 - 12:00 atau 13:00 - 17:00
    return {
      period: "work",
      label: "Jam Kerja",
      sublabel: m < 720 ? "Sesi Kerja Pagi (09:00 - 12:00)" : "Sesi Kerja Siang (13:00 - 17:00)",
      icon: "💼",
      color: "#10b981",
    };
  } else if (m >= 720 && m < 780) {
    // 12:00 - 13:00
    return {
      period: "break",
      label: "Jam Istirahat Siang",
      sublabel: "Makan Siang & Santai di Pantry (12:00 - 13:00)",
      icon: "🍱",
      color: "#f59e0b",
    };
  } else if ((m >= 1020 && m < 1320) || (m >= 390 && m < 480)) {
    // 17:00 - 22:00 atau 06:30 - 08:00
    return {
      period: "dorm_relax",
      label: "Jam Pulang & Kamar",
      sublabel: m >= 1020 ? "Nonton TV & Santai di Kamar (17:00 - 22:00)" : "Pagi di Kamar (06:30 - 08:00)",
      icon: "🛋️",
      color: "#8b5cf6",
    };
  } else {
    // 22:00 - 06:30
    return {
      period: "dorm_sleep",
      label: "Jam Tidur Malam",
      sublabel: "Istirahat di Ranjang Asrama (22:00 - 06:30)",
      icon: "🌙",
      color: "#6366f1",
    };
  }
}

interface OfficeState {
  // Agents (3D visual coordinates & identities)
  agents: AgentVisual[];
  selectedAgentId: string | null;
  selectAgent: (agentId: string | null) => void;
  updateAgentStatus: (agentId: string, status: AgentVisual["status"], task?: string) => void;

  // Camera Target & Mode
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;
  resetCamera: () => void;
  cameraMode: "rotate" | "grab";
  setCameraMode: (mode: "rotate" | "grab") => void;
  zoomAction: number;
  triggerZoomIn: () => void;
  triggerZoomOut: () => void;

  // Active Project (No hardcoded data - starts null!)
  currentProject: ProjectData | null;
  setCurrentProject: (proj: ProjectData | null) => void;

  // Tasks (No hardcoded dummy cards - starts empty!)
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
  addTask: (task: TaskItem) => void;

  // Documents (No hardcoded mock papers - starts empty!)
  documents: DocumentItem[];
  setDocuments: (docs: DocumentItem[]) => void;
  addDocument: (doc: DocumentItem) => void;

  // Approvals (Starts empty!)
  approvals: ApprovalItem[];
  setApprovals: (approvals: ApprovalItem[]) => void;
  addApproval: (approval: ApprovalItem) => void;
  resolveApproval: (approvalId: string, status: "approved" | "rejected", revisionNote?: string) => void;

  // Activity Stream (Starts empty!)
  activityFeed: ActivityEvent[];
  setActivityFeed: (activities: ActivityEvent[]) => void;
  addActivity: (activity: ActivityEvent) => void;

  // Conversations with AI Agents
  conversations: Record<string, ConversationMessage[]>;
  activeChatAgentId: string | null;
  isChatOpen: boolean;
  openChat: (agentId: string) => void;
  closeChat: () => void;
  addConversationMessage: (agentId: string, msg: ConversationMessage) => void;
  loadConversations: (agentId?: string) => Promise<void>;
  sendMessageToAgent: (agentId: string, text: string) => Promise<string | null>;

  // Data sync from backend
  isLoadingData: boolean;
  fetchOfficeState: () => Promise<void>;

  // Sarah Adams Clarification Dialog
  sarahClarification: {
    isOpen: boolean;
    instructionTopic: string;
    question: string;
    options: string[];
  } | null;
  openSarahClarification: (data: { instructionTopic: string; question: string; options: string[] }) => void;
  closeSarahClarification: () => void;

  // UI Panels
  activeTab: "office" | "tasks" | "documents" | "approvals" | "activity";
  setActiveTab: (tab: "office" | "tasks" | "documents" | "approvals" | "activity") => void;
  isFeedOpen: boolean;
  toggleFeed: () => void;

  // Team Meeting Event
  isMeetingActive: boolean;
  toggleMeeting: () => void;

  // Office Schedule & Virtual Time System
  virtualTime: number; // in minutes (0 - 1439, e.g. 570 = 09:30 AM)
  isTimeRunning: boolean;
  timeSpeed: number;
  setVirtualTime: (minutes: number) => void;
  toggleTimeRunning: () => void;
  setTimeSpeed: (speed: number) => void;
  stepVirtualTime: (deltaMinutes: number) => void;
}

const INITIAL_AGENTS: AgentVisual[] = [
  {
    id: "project_manager",
    name: "Sarah Adams",
    role: "Head of Research Operations",
    department: "Director Office",
    position: [-6.8, 0, -5.38],
    rotation: [0, Math.PI, 0],
    color: "#3b82f6",
    status: "idle",
    avatar: "👩‍💼",
  },
  {
    id: "researcher",
    name: "Alex Rivera",
    role: "Literature Explorer",
    department: "Research Department",
    position: [-8.0, 0, 5.38],
    rotation: [0, 0, 0],
    color: "#06b6d4",
    status: "idle",
    avatar: "🔬",
  },
  {
    id: "literature_analyst",
    name: "Elena Rostova",
    role: "Gap & Theory Specialist",
    department: "Research Department",
    position: [-5.2, 0, 5.38],
    rotation: [0, 0, 0],
    color: "#8b5cf6",
    status: "idle",
    avatar: "📚",
  },
  {
    id: "academic_writer",
    name: "Marcus Vance",
    role: "Drafting Specialist",
    department: "Writing Department",
    position: [5.2, 0, 5.38],
    rotation: [0, 0, 0],
    color: "#10b981",
    status: "idle",
    avatar: "✍️",
  },
  {
    id: "citation_specialist",
    name: "Chloe Lin",
    role: "Reference & DOI Formatter",
    department: "Writing Department",
    position: [8.0, 0, 5.38],
    rotation: [0, 0, 0],
    color: "#f59e0b",
    status: "idle",
    avatar: "🔖",
  },
  {
    id: "data_analyst",
    name: "Liam Thorne",
    role: "Statistical Analyst",
    department: "Data Analysis Hub",
    position: [0, 0, 5.38],
    rotation: [0, 0, 0],
    color: "#ec4899",
    status: "idle",
    avatar: "📊",
  },
  {
    id: "academic_editor",
    name: "David Miller",
    role: "Tone & Grammar Editor",
    department: "Quality Control",
    position: [1.6, 0, -5.88],
    rotation: [0, Math.PI, 0],
    color: "#14b8a6",
    status: "idle",
    avatar: "📝",
  },
  {
    id: "quality_reviewer",
    name: "Beatrice Ramos",
    role: "Academic Integrity Auditor",
    department: "Quality Control",
    position: [-1.6, 0, -5.88],
    rotation: [0, Math.PI, 0],
    color: "#ef4444",
    status: "idle",
    avatar: "⚖️",
  },
];

export const useOfficeStore = create<OfficeState>((set, get) => ({
  agents: INITIAL_AGENTS,
  selectedAgentId: null,
  selectAgent: (agentId) => {
    set({ selectedAgentId: agentId });
    if (agentId) {
      const agent = get().agents.find((a) => a.id === agentId);
      if (agent) {
        set({ cameraTarget: [agent.position[0], 1, agent.position[2]] });
      }
    }
  },
  updateAgentStatus: (agentId, status, task) => {
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === agentId ? { ...a, status, currentTask: task ?? a.currentTask } : a
      ),
    }));
  },

  cameraTarget: [0, 1, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),
  resetCamera: () => set({ cameraTarget: [0, 1, 0], selectedAgentId: null }),
  cameraMode: "rotate",
  setCameraMode: (mode) => set({ cameraMode: mode }),
  zoomAction: 0,
  triggerZoomIn: () => set((s) => ({ zoomAction: s.zoomAction + 1 })),
  triggerZoomOut: () => set((s) => ({ zoomAction: s.zoomAction - 1 })),

  // 100% Dynamic - starts NULL/empty as requested by user
  currentProject: null,
  setCurrentProject: (proj) => set({ currentProject: proj }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  documents: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),

  approvals: [],
  setApprovals: (approvals) => set({ approvals }),
  addApproval: (approval) =>
    set((state) => ({ approvals: [approval, ...state.approvals] })),
  resolveApproval: async (approvalId, status, revisionNote) => {
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === approvalId
          ? { ...a, status, revisionNotes: revisionNote || a.revisionNotes }
          : a
      ),
    }));
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: approvalId, status, reviewerComment: revisionNote }),
      });
    } catch (err) {
      console.warn("Failed to update approval on server:", err);
    }
  },

  activityFeed: [],
  setActivityFeed: (activities) => set({ activityFeed: activities }),
  addActivity: (activity) => {
    set((state) => ({
      activityFeed: [activity, ...state.activityFeed].slice(0, 50),
    }));
    // Also persist to DB in background
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    }).catch(() => {});
  },

  // Conversations with AI Agents
  conversations: {},
  activeChatAgentId: null,
  isChatOpen: false,
  openChat: (agentId) => {
    set({ activeChatAgentId: agentId, isChatOpen: true });
    get().loadConversations(agentId);
  },
  closeChat: () => set({ isChatOpen: false }),
  addConversationMessage: (agentId, msg) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [agentId]: [...(state.conversations[agentId] || []), msg],
      },
    }));
  },
  loadConversations: async (agentId) => {
    try {
      const url = agentId ? `/api/chat?agentId=${agentId}` : `/api/chat`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.conversations) {
          const grouped: Record<string, ConversationMessage[]> = {};
          for (const c of data.conversations) {
            if (!grouped[c.agent_id]) grouped[c.agent_id] = [];
            grouped[c.agent_id].push(c);
          }
          set((state) => ({
            conversations: {
              ...state.conversations,
              ...grouped,
            },
          }));
        }
      }
    } catch (err) {
      console.warn("Error loading conversations:", err);
    }
  },
  sendMessageToAgent: async (agentId, text) => {
    if (!text.trim()) return null;

    const optimisticMsg: ConversationMessage = {
      id: `local-${Date.now()}`,
      agent_id: agentId,
      sender: "user",
      message: text,
      created_at: new Date().toISOString(),
    };
    get().addConversationMessage(agentId, optimisticMsg);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.agentMessage) {
          get().addConversationMessage(agentId, data.agentMessage);
          return data.agentMessage.message;
        }
      }
    } catch (err) {
      console.error("Error sending message to agent:", err);
    }
    return null;
  },

  // Fetch all data from Neon DB
  isLoadingData: false,
  fetchOfficeState: async () => {
    set({ isLoadingData: true });
    try {
      // 1. Projects
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.activeProject) {
          set({
            currentProject: {
              id: projData.activeProject.id,
              title: projData.activeProject.title,
              researchTopic: projData.activeProject.research_topic || "",
              status: projData.activeProject.status || "in_progress",
              academicLevel: projData.activeProject.academic_level || "S1 / Sarjana",
              citationStyle: projData.activeProject.citation_style || "APA 7th",
            },
          });
        } else {
          set({ currentProject: null });
        }
      }

      // 2. Tasks
      const tasksRes = await fetch("/api/tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        set({ tasks: tasksData.tasks || [] });
      }

      // 3. Documents
      const docsRes = await fetch("/api/documents");
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        set({ documents: docsData.documents || [] });
      }

      // 4. Approvals
      const appsRes = await fetch("/api/approvals");
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        const formatted = (appsData.approvals || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          requestedBy: a.requested_by,
          preparedBy: a.prepared_by,
          status: a.status,
          revisionNotes: a.reviewer_comment,
        }));
        set({ approvals: formatted });
      }

      // 5. Activities
      const actRes = await fetch("/api/activities?limit=40");
      if (actRes.ok) {
        const actData = await actRes.json();
        const formatted = (actData.activities || []).map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          agentId: a.agent_id,
          eventType: a.event_type,
          description: a.description,
          metadata: a.metadata,
        }));
        set({ activityFeed: formatted });
      }
    } catch (err) {
      console.warn("Could not sync office state from backend:", err);
    } finally {
      set({ isLoadingData: false });
    }
  },

  sarahClarification: null,
  openSarahClarification: (data) =>
    set({ sarahClarification: { ...data, isOpen: true } }),
  closeSarahClarification: () => set({ sarahClarification: null }),

  activeTab: "office",
  setActiveTab: (tab) => set({ activeTab: tab }),
  isFeedOpen: true,
  toggleFeed: () => set((state) => ({ isFeedOpen: !state.isFeedOpen })),

  isMeetingActive: false,
  toggleMeeting: () => {
    const nextMeetingState = !get().isMeetingActive;
    set((state) => ({
      isMeetingActive: nextMeetingState,
      agents: state.agents.map((a) => ({
        ...a,
        status: nextMeetingState ? "meeting" : "idle",
      })),
    }));
    get().addActivity({
      id: `mtg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: "project_manager",
      eventType: nextMeetingState ? "meeting.started" : "meeting.ended",
      description: nextMeetingState
        ? "Director memulai rapat koordinasi tim di Meja Konferensi Sentral."
        : "Rapat koordinasi tim selesai. Seluruh karyawan kembali ke meja masing-masing.",
    });
  },

  // Office Shift & Virtual Clock State (Default: 09:30 AM)
  virtualTime: 570,
  isTimeRunning: true,
  timeSpeed: 1,
  setVirtualTime: (minutes) => {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    set({ virtualTime: normalized });
  },
  toggleTimeRunning: () => set((state) => ({ isTimeRunning: !state.isTimeRunning })),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  stepVirtualTime: (deltaMinutes) => {
    set((state) => ({
      virtualTime: (((state.virtualTime + deltaMinutes) % 1440) + 1440) % 1440,
    }));
  },
}));
