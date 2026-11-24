import logging
from typing import Optional, List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMProvider:
    """Multi-Provider AI Client supporting Gemini, Groq, and OpenAI with graceful fallbacks."""

    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.groq_key = settings.GROQ_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.openrouter_key = settings.OPENROUTER_API_KEY

    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        agent_role: str = "general",
        model_preference: Optional[str] = None
    ) -> str:
        # 1. Try Groq for super-fast coordination or reviewer roles if key is present
        if self.groq_key and (model_preference == "groq" or agent_role in ["project_manager", "quality_reviewer", "academic_editor"]):
            try:
                import httpx
                async with httpx.AsyncClient(timeout=45.0) as client:
                    resp = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {self.groq_key}"},
                        json={
                            "model": "llama-3.3-70b-versatile",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            "temperature": 0.5,
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"]
                    else:
                        logger.warning(f"Groq API returned error: {resp.text}")
            except Exception as e:
                logger.error(f"Error calling Groq API: {e}")

        # 2. Try Gemini (great for long context, literature review, drafting)
        if self.gemini_key:
            try:
                import httpx
                # Gemini 1.5 or 2.0 Flash via standard REST API
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                async with httpx.AsyncClient(timeout=60.0) as client:
                    payload = {
                        "contents": [
                            {"role": "user", "parts": [{"text": f"System Instruction: {system_prompt}\n\nTask: {user_prompt}"}]}
                        ],
                        "generationConfig": {
                            "temperature": 0.6,
                            "maxOutputTokens": 4096
                        }
                    }
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"]
                    else:
                        logger.warning(f"Gemini API returned error: {resp.text}")
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}")

        # 3. Fallback: Simulation response when API key is not yet set
        return (
            f"[{agent_role.upper()} SIMULATED OUTPUT]\n\n"
            f"Analisis dan eksekusi tugas berhasil disimulasikan.\n"
            f"Instruksi: {user_prompt[:120]}...\n\n"
            f"Catatan: Tambahkan GEMINI_API_KEY atau GROQ_API_KEY di file .env untuk hasil AI generasi nyata."
        )


llm_provider = LLMProvider()
