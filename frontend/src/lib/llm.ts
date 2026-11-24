import { AGENT_REGISTRY } from "./agents";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithAgent(
  agentId: string,
  userMessage: string,
  history: { sender: string; message: string }[] = []
): Promise<string> {
  const agent = AGENT_REGISTRY[agentId] || AGENT_REGISTRY.project_manager;
  const systemPrompt = `${agent.systemPrompt}\nAlways reply in character as ${agent.name} (${agent.role}). Respond concisely and professionally in Indonesian or English depending on how the Director asks.`;

  // 1. Try Groq Cloud if available
  if (process.env.GROQ_API_KEY) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-6).map((h) => ({
          role: h.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: h.message,
        })),
        { role: "user", content: userMessage },
      ];

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply.trim();
      }
    } catch (err) {
      console.warn("Groq API call error, falling back to Gemini:", err);
    }
  }

  // 2. Try Google Gemini if available
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `${systemPrompt}\n\nRecent conversation:\n${history
        .slice(-4)
        .map((h) => `${h.sender === "user" ? "Director" : agent.name}: ${h.message}`)
        .join("\n")}\nDirector: ${userMessage}\n${agent.name}:`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply.trim();
      }
    } catch (err) {
      console.warn("Gemini API call error:", err);
    }
  }

  // 3. Fallback smart response
  return `Halo Director! Saya ${agent.name} (${agent.role}). Saya siap membantu dan memproses instruksi riset untuk divisi ${agent.department}. Apakah ada arahan spesifik yang perlu kami jalankan sekarang?`;
}
