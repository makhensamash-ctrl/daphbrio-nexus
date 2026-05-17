import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights & News — Daph Brio Cabling" },
      { name: "description", content: "Company news, contract wins and infrastructure thought leadership from Daph Brio Cabling." },
      { property: "og:title", content: "Insights — Daph Brio Cabling" },
      { property: "og:description", content: "Articles on IT cabling, fibre optic and industrial infrastructure across South Africa." },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

type Post = { id: string; title: string; slug: string; category: string; summary: string; published_at: string; cover_url: string | null };

function InsightsPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["news_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("id, title, slug, category, summary, published_at, cover_url")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

  return (
    <SiteLayout>
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">Insights</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            News, contract wins and thought leadership.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No insights published yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-card flex flex-col">
                {p.cover_url ? (
                  <img src={p.cover_url} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/10] gradient-hero grid-pattern" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold uppercase tracking-[0.12em]">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.published_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold leading-snug">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{p.summary}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read more <ArrowRight className="h-4 w-4" />
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
