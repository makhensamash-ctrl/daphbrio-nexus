import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Cable, LayoutDashboard, Newspaper, Image as ImageIcon, Users, LogOut, ExternalLink, Menu } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav: { to: "/admin" | "/admin/news" | "/admin/media" | "/admin/users"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/news", label: "News & Insights", icon: Newspaper },
  { to: "/admin/media", label: "Media Manager", icon: ImageIcon },
  { to: "/admin/users", label: "Users", icon: Users },
];



export function AdminShell({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading, mustChangePassword } = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      navigate({ to: "/admin/login" });
    } else if (!loading && session && isAdmin && mustChangePassword && pathname !== "/admin/change-password") {
      navigate({ to: "/admin/change-password" });
    }
  }, [loading, session, isAdmin, mustChangePassword, pathname, navigate]);


  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (loading || !session || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Verifying credentials…</p>
      </div>
    );
  }

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); };

  const SidebarBody = (
    <>
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-white/10">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--safety)] text-[var(--safety-foreground)]">
          <Cable className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">DAPH BRIO</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">CMS</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition",
                active ? "bg-[var(--safety)] text-[var(--safety-foreground)]" : "text-slate-300 hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5">
          <ExternalLink className="h-3.5 w-3.5" /> View public site
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 hidden lg:flex flex-col bg-[var(--slate-deep)] text-slate-100">
        {SidebarBody}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-14 px-4 flex items-center justify-between border-b border-border bg-background">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-[var(--slate-deep)] text-slate-100 border-r-0 flex flex-col">
              {SidebarBody}
            </SheetContent>
          </Sheet>
          <Link to="/admin" className="font-display font-bold">Daphbrio CMS</Link>
          <Button size="sm" variant="ghost" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

