export type AgentStatus =
  | "idle"
  | "thinking"
  | "working"
  | "meeting"
  | "completed"
  | "error"
  | "break"
  | "dorm_relax"
  | "dorm_sleep"
  | "clock_in";

export type OfficeSchedulePeriod = "clock_in" | "work" | "break" | "dorm_relax" | "dorm_sleep";

export interface ScheduleInfo {
  period: OfficeSchedulePeriod;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
}

export interface AgentVisual {
  id: string;
  name: string;
  role: string;
  department: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  status: AgentStatus;
  currentTask?: string;
  avatar: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId?: string;
  eventType: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface ProjectData {
  id: string;
  title: string;
  researchTopic: string;
  status: string;
  academicLevel: string;
  citationStyle: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  preparedBy?: string;
  status: "pending" | "approved" | "rejected";
  revisionNotes?: string;
}

export interface TaskItem {
  id: string;
  project_id?: string;
  agent_id: string;
  title: string;
  description?: string;
  status: "backlog" | "in_progress" | "review" | "completed";
  priority?: string;
  result?: any;
}

export interface DocumentItem {
  id: string;
  project_id?: string;
  title: string;
  category: "bab1" | "literature" | "references" | "general" | string;
  content: string;
  status?: string;
  created_at?: string;
}

export interface ConversationMessage {
  id: string;
  agent_id: string;
  sender: "user" | "agent";
  message: string;
  created_at?: string;
}
