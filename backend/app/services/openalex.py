import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


def reconstruct_abstract(inverted_index: Optional[Dict[str, List[int]]]) -> str:
    """Reconstructs text from OpenAlex's abstract_inverted_index."""
    if not inverted_index:
        return ""
    try:
        word_positions = []
        for word, positions in inverted_index.items():
            for pos in positions:
                word_positions.append((pos, word))
        word_positions.sort(key=lambda x: x[0])
        return " ".join(word for _, word in word_positions)
    except Exception:
        return ""


class OpenAlexClient:
    """Client for OpenAlex Academic API (250M+ scholarly works, 100% free, no API key needed)."""

    def __init__(self):
        self.base_url = "https://api.openalex.org"
        self.email = settings.OPENALEX_MAILTO

    async def search_works(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Searches academic papers and journals related to a query topic."""
        headers = {
            "User-Agent": f"ResearchVerse-AI/1.0 (mailto:{self.email})"
        }
        params = {
            "search": query,
            "per_page": limit,
            "mailto": self.email,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self.base_url}/works",
                    params=params,
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    results = []
                    for work in data.get("results", []):
                        # Extract author names
                        authors = [
                            authorship.get("author", {}).get("display_name", "")
                            for authorship in work.get("authorships", [])
                            if authorship.get("author", {}).get("display_name")
                        ]

                        abstract = reconstruct_abstract(work.get("abstract_inverted_index"))

                        doi = work.get("doi")
                        url = doi or work.get("id")

                        results.append({
                            "id": work.get("id"),
                            "title": work.get("title") or "Untitled Academic Work",
                            "authors": authors[:5],
                            "publication_year": work.get("publication_year"),
                            "doi": doi,
                            "url": url,
                            "abstract": abstract[:500] if abstract else "Abstract not available in open index.",
                            "cited_by_count": work.get("cited_by_count", 0),
                            "verification_status": "verified" if doi else "unverified",
                            "source": "OpenAlex"
                        })
                    return results
                else:
                    logger.warning(f"OpenAlex returned HTTP {response.status_code}: {response.text}")
                    return []
        except Exception as e:
            logger.error(f"Error querying OpenAlex API: {e}")
            return []


openalex_client = OpenAlexClient()
