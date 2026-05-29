import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/daphbrio-logo-header.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Projects" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Daphbrio Cabling and Trading Project logo"
            width={280}
            height={80}
            className="h-16 md:h-20 w-auto object-contain"
          />
          <span className="sr-only">Daphbrio Cabling and Trading Project</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/login">Admin</Link>
          </Button>
          <Button asChild size="sm" className="bg-[var(--safety)] text-[var(--safety-foreground)] hover:bg-[var(--safety)]/90">
            <Link to="/contact">Request a Quote</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border flex flex-col gap-2">
              <Link to="/admin/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground">
                Admin login
              </Link>
              <Button asChild className="bg-[var(--safety)] text-[var(--safety-foreground)] hover:bg-[var(--safety)]/90">
                <Link to="/contact" onClick={() => setOpen(false)}>Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
