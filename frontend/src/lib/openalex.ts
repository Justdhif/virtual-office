export interface OpenAlexWork {
  id: string;
  doi?: string;
  title: string;
  publicationYear?: number;
  authors: string[];
  venue?: string;
  citedByCount?: number;
  openAccessUrl?: string;
}

export async function searchOpenAlexWorks(
  query: string,
  limit: number = 5
): Promise<OpenAlexWork[]> {
  try {
    const mailto = process.env.OPENALEX_MAILTO || "researcher@researchverse.ai";
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", query);
    url.searchParams.set("per_page", String(limit));
    url.searchParams.set("mailto", mailto);

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": `ResearchVerse-AI/1.0 (mailto:${mailto})`,
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((w: any) => ({
      id: w.id,
      doi: w.doi,
      title: w.title,
      publicationYear: w.publication_year,
      authors: (w.authorships || []).map((a: any) => a.author?.display_name).filter(Boolean),
      venue: w.primary_location?.source?.display_name || "Jurnal Akademik",
      citedByCount: w.cited_by_count,
      openAccessUrl: w.open_access?.oa_url,
    }));
  } catch (err) {
    console.warn("OpenAlex API error:", err);
    return [];
  }
}
