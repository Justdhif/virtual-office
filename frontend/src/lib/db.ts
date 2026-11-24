import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure websocket for Neon driver in Node.js environments
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL || "";

export const pool = new Pool({ connectionString });

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not configured in environment variables.");
    return [];
  }
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  try {
    // 1. Projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        research_topic TEXT,
        academic_level VARCHAR(50) DEFAULT 'undergraduate',
        citation_style VARCHAR(50) DEFAULT 'APA 7th',
        status VARCHAR(50) DEFAULT 'planning',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Tasks table
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100),
        agent_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'backlog',
        priority VARCHAR(20) DEFAULT 'medium',
        result JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 3. Documents table
    await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) DEFAULT 'bab1',
        content TEXT,
        metadata JSONB,
        version INT DEFAULT 1,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Approvals table
    await query(`
      CREATE TABLE IF NOT EXISTS approvals (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100),
        task_id VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        requested_by VARCHAR(100) NOT NULL,
        prepared_by VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        reviewer_comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Activity logs table
    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100),
        agent_id VARCHAR(50) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Conversations table (Interactive AI Agent Conversations)
    await query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(100) PRIMARY KEY,
        agent_id VARCHAR(50) NOT NULL,
        sender VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    isInitialized = true;
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
  }
}
