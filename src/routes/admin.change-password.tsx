import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cable, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { clearMustChangePassword } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/change-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Daphbrio CMS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ChangePassword,
});

function ChangePassword() {
  const { session, loading } = useAdmin();
  const navigate = useNavigate();
  const clearFlag = useServerFn(clearMustChangePassword);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters.");
    if (pwd !== confirm) return toast.error("Passwords do not match.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      await clearFlag();
      // Force session refresh so user_metadata.must_change_password is up to date.
      await supabase.auth.refreshSession();
      toast.success("Password updated. Welcome aboard.");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--safety)] text-[var(--safety-foreground)]">
            <Cable className="h-5 w-5" />
          </span>
          <span className="font-display font-bold">DAPH BRIO CMS</span>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
          <ShieldAlert className="h-4 w-4 mt-0.5 text-amber-500" />
          <p>For your security, set a new password before continuing.</p>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="font-medium">{session?.user?.email}</span>
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pwd">New password</Label>
            <Input
              id="pwd"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
