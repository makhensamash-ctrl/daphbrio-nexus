import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Quote, X } from "lucide-react";

// seed gallery (shipped from company profile photos)
import g1 from "@/assets/gallery-cable-tray-factory.jpg";
import g2 from "@/assets/gallery-cable-trays-closeup.jpg";
import g3 from "@/assets/gallery-network-switch.jpg";
import g4 from "@/assets/gallery-scissor-lift.jpg";
import g5 from "@/assets/gallery-fiber-patch.jpg";
import g6 from "@/assets/gallery-yellow-trays.jpg";
import g7 from "@/assets/gallery-server-rack.jpg";
import g8 from "@/assets/gallery-red-pipes.jpg";
import g9 from "@/assets/gallery-warehouse-cabling.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Daph Brio Cabling" },
      { name: "description", content: "Installation portfolio: fibre splicing, cable trays, LAN networks, server racks and industrial infrastructure across South Africa." },
      { property: "og:title", content: "Project Gallery — Daph Brio Cabling" },
      { property: "og:description", content: "Enterprise installations including Ford Motor Company, UJ and Capitec Bank." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

type Item = { id: string; title: string; category: string; image_url: string; caption?: string | null };

const seed: Item[] = [
  { id: "s1", title: "Plant cable tray run", category: "Cable Trays", image_url: g1 },
  { id: "s2", title: "OBO tray detail", category: "Cable Trays", image_url: g2 },
  { id: "s3", title: "Core network switch", category: "LAN Networks", image_url: g3 },
  { id: "s4", title: "Scissor-lift cable pull", category: "Cable Trays", image_url: g4 },
  { id: "s5", title: "Fibre patch panel", category: "Fiber Splicing", image_url: g5 },
  { id: "s6", title: "Industrial trays — Ford", category: "Cable Trays", image_url: g6 },
  { id: "s7", title: "Server rack build", category: "LAN Networks", image_url: g7 },
  { id: "s8", title: "Electrical containment", category: "Electrical", image_url: g8 },
  { id: "s9", title: "Warehouse cabling", category: "Cable Trays", image_url: g9 },
];

function GalleryPage() {
  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id, title, category, image_url, caption")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Item[];
    },
  });

  const items = useMemo(() => [...dbItems, ...seed], [dbItems]);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <SiteLayout>
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">Project Gallery</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Installations that keep enterprises running.
          </h1>
          <p className="mt-5 text-slate-200 max-w-2xl">
            From P703 framing-plant installations at Ford Motor Company to fibre upgrades at UJ
            and Capitec — explore a visual record of our work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.14em] border transition",
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <figure key={item.id} className="group relative overflow-hidden rounded-lg shadow-card bg-card">
                <button
                  type="button"
                  onClick={() => setLightbox(item)}
                  className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety)]"
                  aria-label={`View ${item.title} larger`}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white pointer-events-none">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--safety)]">{item.category}</p>
                    <p className="mt-0.5 font-display font-semibold">{item.title}</p>
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Testimonial */}
      <section className="bg-[var(--slate-deep)] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Quote className="h-10 w-10 text-[var(--safety)]" />
          <blockquote className="mt-6 font-display text-2xl sm:text-3xl leading-snug">
            "Daph Brio has been very helpful to our department. I have worked with the team from
            2021 to date on various projects including P703 installations at Framing, Stamping, the
            new Bodyshop, TCF upgrades, PHEV factory, launch office renovations, TCF MP&amp;L and
            manufacturing office — the latest being Plant 4. They have been very key for us to
            achieve high quality installations on time."
          </blockquote>
          <footer className="mt-8 text-sm text-slate-300">
            <p className="font-semibold text-white">Misheck Koloko</p>
            <p>IT Network Infrastructure Manager — Ford Motor Company of Southern Africa</p>
          </footer>
        </div>
      </section>
    </SiteLayout>
  );
}
