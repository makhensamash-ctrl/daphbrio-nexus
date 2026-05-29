import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cable, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/use-admin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin — Daphbrio CMS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading, mustChangePassword } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (loading || !session) return;
    if (mustChangePassword) navigate({ to: "/admin/change-password" });
    else if (isAdmin) navigate({ to: "/admin" });
  }, [loading, session, isAdmin, mustChangePassword, navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || password.length < 8) {
      toast.error("Enter a valid email and a password of 8+ characters.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative gradient-hero text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--safety)] text-[var(--safety-foreground)]">
            <Cable className="h-5 w-5" />
          </span>
          <span className="font-display font-bold">DAPH BRIO</span>
        </Link>
        <div className="relative">
          <ShieldCheck className="h-10 w-10 text-[var(--safety)]" />
          <h1 className="mt-4 font-display text-3xl font-bold">Secure CMS gateway.</h1>
          <p className="mt-3 text-slate-200 max-w-md">
            Manage news, contract wins and the project gallery for Daphbrio Cabling.
            Access is restricted to authorised administrators.
          </p>
        </div>
        <p className="relative text-xs text-slate-400">Reg 2019/309218/07 • OHS Act compliant</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="font-display text-2xl font-bold">Admin sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access the CMS. Accounts are created by an
            existing admin — public sign-up is disabled.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Please wait…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-10 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to public site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
