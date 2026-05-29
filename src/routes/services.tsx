import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Network, Cable, Cpu, Camera, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — IT Cabling, Fibre Optic, Cable Trays, CCTV, Electrical" },
      { name: "description", content: "Supply and installation of CAT6A LAN, SM/MM fibre optic, OBO cable trays and trunking, CCTV security systems and LV/MV/HV electrical cables." },
      { property: "og:title", content: "Services — Daphbrio Cabling" },
      { property: "og:description", content: "Five enterprise service pillars: IT networking, fibre optic, infrastructure, security, electrical." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Network,
    title: "IT Networking Cables",
    short: "LAN, CAT6A, UTP, OTDR Test Results",
    body: "End-to-end supply and installation of structured cabling — CAT6A, UTP and LAN backbones for offices, factories and campuses. Certified terminations, labelling and on-site testing including OTDR results.",
    bullets: ["CAT6A / CAT6 / UTP", "Patch panel termination", "Cable certification & labelling", "Network room buildouts", "AP's interior & exterior", "Patch panels & enclosures"],
  },
  {
    icon: Cable,
    title: "Fibre Optic Cables",
    short: "Single-mode / Multi-mode splicing & termination",
    body: "Fusion splicing, termination and pre-commissioning for single-mode and multi-mode runs. Backbone fibre for plant floors, multi-building campuses and data centres.",
    bullets: ["SM & MM fusion splicing", "OTDR testing", "Backbone & FTTH"],
  },
  {
    icon: Cpu,
    title: "Infrastructure",
    short: "Cable trays, trunking, OBO",
    body: "Supply and installation of all types of cable trays, trunking and OBO cable trays. Specified, mounted and signed off for industrial-scale runs.",
    bullets: ["OBO cable trays", "Galvanised & ladder trays", "PVC & metal trunking", "Brackets, supports & dropper sets"],
  },
  {
    icon: Camera,
    title: "Security Systems",
    short: "CCTV cameras & surveillance",
    body: "Full design, supply and installation of CCTV camera systems — from single-site coverage to multi-camera enterprise estates with NVR/DVR integration.",
    bullets: ["IP & analogue CCTV", "NVR / DVR integration", "Cabling & PoE switches", "Remote viewing setup"],
  },
  {
    icon: Zap,
    title: "Electrical Cabling",
    short: "Low / medium / high voltage",
    body: "Supply and installation of low to medium to high voltage electrical cables for industrial sites, plant upgrades and commercial buildings.",
    bullets: ["LV / MV / HV cabling", "Containment & glanding", "Plant & factory upgrades", "Commissioning support"],
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">Services</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Five capabilities. One enterprise supplier.
          </h1>
          <p className="mt-5 text-lg text-slate-200 max-w-2xl">
            Every service is delivered with strict OHS compliance, daily site charts and competent
            supervisors — from CAT6A to HV electrical.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-6">
        {services.map(({ icon: Icon, title, short, body, bullets }, idx) => (
          <article
            key={title}
            className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start rounded-xl border border-border bg-card p-6 sm:p-8 shadow-card"
          >
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
              <span className="grid h-14 w-14 place-items-center rounded-lg gradient-hero text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-display text-sm text-muted-foreground tabular-nums">0{idx + 1} / 0{services.length}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold">{short}</p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold">{title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--safety)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pt-2">
              <Button asChild variant="outline">
                <Link to="/contact">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
