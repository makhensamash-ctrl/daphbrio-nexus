import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Daph Brio Cabling Trading & Projects" },
      { name: "description", content: "Request a quote, submit a tender inquiry or visit us at 3210 Block B, New Eersterus, Hammanskraal 0400." },
      { property: "og:title", content: "Contact Daph Brio Cabling" },
      { property: "og:description", content: "Get in touch for IT cabling, fibre optic and infrastructure projects." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().min(1, "Select a service"),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

const services = [
  "IT Networking Cables (CAT6A / UTP)",
  "Fibre Optic — SM / MM",
  "Cable Trays, Trunking & OBO",
  "CCTV & Security Systems",
  "Electrical (LV / MV / HV)",
  "Tender inquiry",
  "Other",
];

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      service,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    // Mock successful submission per spec
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Thanks — we'll respond within one business day.");
    (e.target as HTMLFormElement).reset();
    setService("");
  }

  return (
    <SiteLayout>
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--safety)] font-semibold">Contact</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Let's scope your next infrastructure project.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card accent-bar pl-6">
            <h3 className="font-display font-bold">Head office</h3>
            <p className="mt-2 text-sm text-muted-foreground flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              3210 Block B, New Eersterus,<br />Hammanskraal, 0400
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card accent-bar pl-6">
            <h3 className="font-display font-bold">Phone</h3>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> 067 060 4608
            </p>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> 060 469 3694
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card accent-bar pl-6">
            <h3 className="font-display font-bold">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> daphney@daphbrio.co.za
            </p>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> aubrey@daphbrio.co.za
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card accent-bar pl-6">
            <h3 className="font-display font-bold">Hours</h3>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Mon – Fri, 07:00 – 17:00 SAST
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-border shadow-card aspect-[4/3] bg-muted">
            <iframe
              title="Daph Brio office location"
              src="https://www.google.com/maps?q=New+Eersterus,+Hammanskraal,+0400&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold">Request a quote</h2>
            <p className="text-sm text-muted-foreground mt-1">We respond within one business day.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" name="name" placeholder="Jane Mokoena" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" placeholder="Company name" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="you@company.co.za" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+27 ..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Service required *</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Project details *</Label>
            <Textarea id="message" name="message" rows={5} placeholder="Site, scope, timeline ..." required />
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full bg-[var(--safety)] text-[var(--safety-foreground)] hover:bg-[var(--safety)]/90">
            {loading ? "Sending..." : "Send inquiry"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
