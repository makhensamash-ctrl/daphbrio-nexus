import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Award, Clock, Users, Cable, Network, Cpu, Zap, Camera } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { TrustBar } from "@/components/TrustBar";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-cabling.jpg";
import teamImg from "@/assets/team-workers.jpg";
import g1 from "@/assets/gallery-fiber-patch.jpg";
import g2 from "@/assets/gallery-yellow-trays.jpg";
import g3 from "@/assets/gallery-server-rack.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daph Brio Cabling — Enterprise IT Infrastructure & Industrial Cabling, South Africa" },
      { name: "description", content: "Premier IT cabling and industrial infrastructure for enterprises in Gauteng and across South Africa. Fibre optic, CAT6A, cable trays, CCTV and electrical." },
      { property: "og:title", content: "Daph Brio Cabling — Enterprise IT Infrastructure" },
      { property: "og:description", content: "Trusted by Ford, UJ, Capitec. OHS-compliant. 100% black-owned." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const pillars = [
  { icon: Network, label: "IT Networking", desc: "CAT6A, UTP, LAN backbone, OTDR Test Results" },
  { icon: Cable, label: "Fibre Optic", desc: "SM/MM splicing & termination" },
  { icon: Cpu, label: "Infrastructure", desc: "Cable trays, trunking, OBO" },
  { icon: Camera, label: "Security / CCTV", desc: "End-to-end surveillance" },
  { icon: Zap, label: "Electrical", desc: "LV / MV / HV cabling" },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Industrial cable tray installation across factory ceiling"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--safety)]" />
              100% Black-Owned • Reg 2019/309218/07
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Engineering Africa's
              <br />
              <span className="text-[var(--safety)]">enterprise backbone.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              From plant-floor fibre runs at Ford to campus-wide CAT6A at UJ — we deliver
              large-scale IT and industrial cabling projects on time, OHS-compliant, end to end.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[var(--safety)] text-[var(--safety-foreground)] hover:bg-[var(--safety)]/90">
                <Link to="/contact">Request a Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                <Link to="/contact">Submit Tender Inquiry</Link>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                { v: "6+", l: "Years operating" },
                { v: "20+", l: "Enterprise sites" },
                { v: "100%", l: "OHS compliance" },
                { v: "24/7", l: "Project response" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-300 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Why Daph Brio</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Enterprise-grade execution. Field-proven crew.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Daph Brio Trading and Projects (PTY) LTD is a 100% black-owned firm established in 2019.
              Our strength lies in highly competent crews, strict OHS Act adherence, and a track record
              of large-scale infrastructure projects delivered on time and beyond expectation.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { i: ShieldCheck, t: "OHS Act compliant", d: "Site-level safety officers on every project." },
                { i: Award, t: "100% black-owned", d: "Reg 2019/309218/07, Pretoria-based." },
                { i: Clock, t: "On-time delivery", d: "Schedule-driven crews with daily charts." },
                { i: Users, t: "Trained technicians", d: "Internal training on every project scope." },
              ].map(({ i: Icon, t, d }) => (
                <div key={t} className="rounded-lg border border-border p-4 bg-card shadow-card">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 gradient-hero opacity-10 rounded-2xl blur-2xl" />
            <img
              src={teamImg}
              alt="Daph Brio installation crew in safety gear"
              loading="lazy"
              className="relative rounded-xl shadow-elevated w-full object-cover aspect-[4/5] sm:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-[var(--slate-deep)] text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">Service Pillars</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Five capabilities. One supplier.</h2>
            </div>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white w-fit">
              <Link to="/services">All services <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map(({ icon: Icon, label, desc }, idx) => (
              <Link
                to="/services"
                key={label}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 transition hover:border-[var(--safety)]/60 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--safety)]/15 text-[var(--safety)] group-hover:bg-[var(--safety)] group-hover:text-[var(--safety-foreground)] transition">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs text-slate-500">0{idx + 1}</span>
                </div>
                <p className="mt-5 font-display font-semibold">{label}</p>
                <p className="mt-1.5 text-sm text-slate-400">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Recent Work</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Installations across South Africa.</h2>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/gallery">View project gallery <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { src: g1, t: "Fibre Optic Splicing", c: "Ford Motor Company" },
            { src: g2, t: "Industrial Cable Trays", c: "Plant infrastructure" },
            { src: g3, t: "Server Rack Builds", c: "Network rooms" },
          ].map((p) => (
            <figure key={p.t} className="group relative overflow-hidden rounded-lg shadow-card">
              <img src={p.src} alt={p.t} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--safety)]">{p.c}</p>
                <p className="mt-0.5 font-display font-semibold">{p.t}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-10 sm:p-14 shadow-elevated">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Building or upgrading enterprise infrastructure?
              </h2>
              <p className="mt-4 text-slate-200 max-w-2xl">
                Tell us about your site, scope, and timeline. We respond to tender and quote
                requests within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[var(--safety)] text-[var(--safety-foreground)] hover:bg-[var(--safety)]/90">
                <Link to="/contact">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/about">About the company</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
