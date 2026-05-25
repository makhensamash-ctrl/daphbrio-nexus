import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import teamImg from "@/assets/about-core-switch.jpeg";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Daph Brio Cabling Trading & Projects" },
      { name: "description", content: "Established 2019, 100% black-owned. Discover our mission, values and organisational structure delivering enterprise IT infrastructure across South Africa." },
      { property: "og:title", content: "About Daph Brio Cabling" },
      { property: "og:description", content: "100% black-owned IT cabling and industrial infrastructure firm based in Hammanskraal." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  "Honesty, integrity, and trust in every engagement",
  "Strict OHS Act compliance on every site",
  "Personalised, cost-effective service for each client",
  "Highly trained crews and competent supervisors",
  "Just-in-time delivery with daily site charts",
];

const structure = [
  { role: "Director / Head of Operations", reports: "—" },
  { role: "Installations Supervisor", reports: "Director / Head of Operations" },
  { role: "Technicians × 6", reports: "Installations Supervisor" },
  { role: "Head of Human Resources & Finance", reports: "Director / Head of Operations" },
  { role: "Admin & Safety Officer", reports: "Head of HR & Finance" },
  { role: "Finance Clerk", reports: "Head of HR & Finance" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">About</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Six years of building Africa's enterprise backbone.
          </h1>
          <p className="mt-5 text-lg text-slate-200 max-w-2xl">
            Daph Brio Trading and Projects (PTY) LTD was registered as a private company in 2019
            and began trading the same year. Today we serve major public and private sector clients
            across South Africa.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <img src={teamImg} alt="Crew on site" className="rounded-xl shadow-card w-full object-cover aspect-[4/3]" loading="lazy" />
          </div>
          <div className="space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Vision</p>
              <h2 className="mt-3 font-display text-2xl font-bold">To be the best IT cabling services provider in Africa.</h2>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Mission</p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Transform our capabilities into superior products and services for African markets —
                through partnering, provision of quality service, employing highly trained staff and
                proactive solutions for every client.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Values</p>
              <ul className="mt-3 space-y-2.5">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Organisational Structure</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Lean leadership. Skilled crews.</h2>
          <div className="mt-10 overflow-x-auto rounded-lg border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Reports To</th>
                </tr>
              </thead>
              <tbody>
                {structure.map((r) => (
                  <tr key={r.role} className="border-t border-border">
                    <td className="px-5 py-4 font-medium">{r.role}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.reports}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
