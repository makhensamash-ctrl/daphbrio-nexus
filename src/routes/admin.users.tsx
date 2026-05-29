import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, KeyRound, Trash2, UserPlus, Copy } from "lucide-react";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  resetUserPassword,
  setAdminRole,
  type AdminUserRow,
} from "@/lib/admin-users.functions";
import { useAdmin } from "@/hooks/use-admin";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users — Daphbrio CMS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UsersAdmin,
});

function genPassword() {
  const charset = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  const arr = new Uint32Array(14);
  crypto.getRandomValues(arr);
  for (let i = 0; i < arr.length; i++) out += charset[arr[i] % charset.length];
  return out + "!9";
}

function UsersAdmin() {
  const qc = useQueryClient();
  const { session } = useAdmin();
  const myId = session?.user?.id;

  const listFn = useServerFn(listAdminUsers);
  const createFn = useServerFn(createAdminUser);
  const setRoleFn = useServerFn(setAdminRole);
  const deleteFn = useServerFn(deleteAdminUser);
  const resetFn = useServerFn(resetUserPassword);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => listFn(),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin_users"] });

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(genPassword());
  const [isAdminRole, setIsAdminRole] = useState(true);
  const [lastCreated, setLastCreated] = useState<{ email: string; password: string } | null>(null);

  const createMut = useMutation({
    mutationFn: () => createFn({ data: { email, password, is_admin: isAdminRole } }),
    onSuccess: () => {
      toast.success("User created");
      setLastCreated({ email, password });
      setEmail("");
      setPassword(genPassword());
      setIsAdminRole(true);
      setOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [resetTarget, setResetTarget] = useState<AdminUserRow | null>(null);
  const [resetPwd, setResetPwd] = useState("");
  const resetMut = useMutation({
    mutationFn: () => resetFn({ data: { user_id: resetTarget!.id, password: resetPwd } }),
    onSuccess: () => {
      toast.success(`New temp password set for ${resetTarget!.email}`);
      setLastCreated({ email: resetTarget!.email, password: resetPwd });
      setResetTarget(null);
      setResetPwd("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
  }

  return (
    <AdminShell>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">Users</h1>
          <p className="mt-1 text-muted-foreground">
            Create admin accounts. New users must change their password on first sign-in.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setPassword(genPassword())}>
              <UserPlus className="h-4 w-4 mr-2" /> New user
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create user</DialogTitle>
              <DialogDescription>
                The temp password below will be required on first sign-in, then the user
                will be prompted to set a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">First-time password</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                  />
                  <Button type="button" variant="outline" onClick={() => setPassword(genPassword())}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Grant admin role</p>
                  <p className="text-xs text-muted-foreground">Full access to the CMS.</p>
                </div>
                <Switch checked={isAdminRole} onCheckedChange={setIsAdminRole} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                disabled={createMut.isPending || !email || password.length < 8}
                onClick={() => createMut.mutate()}
              >
                {createMut.isPending ? "Creating…" : "Create user"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {lastCreated && (
        <div className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <p className="text-sm font-semibold">
            Share these credentials with {lastCreated.email}. They won't be shown again.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => copy(lastCreated.email)}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <span className="truncate">{lastCreated.email}</span>
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => copy(lastCreated.password)}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm hover:bg-muted"
            >
              <span className="truncate">{lastCreated.password}</span>
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={() => setLastCreated(null)}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_140px] gap-4 px-4 py-3 border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
          <span>Email</span>
          <span>Admin</span>
          <span>Last sign-in</span>
          <span className="text-right">Actions</span>
        </div>
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && users.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No users yet.</p>
        )}
        {users.map((u) => {
          const isSelf = u.id === myId;
          return (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_120px_120px_140px] gap-4 items-center px-4 py-3 border-b border-border last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{u.email}</p>
                <p className="text-xs text-muted-foreground">
                  {u.must_change_password ? "Must change password" : "Active"}
                  {isSelf && " · You"}
                </p>
              </div>
              <div>
                <Switch
                  checked={u.is_admin}
                  disabled={isSelf}
                  onCheckedChange={async (v) => {
                    try {
                      await setRoleFn({ data: { user_id: u.id, is_admin: v } });
                      toast.success(v ? "Granted admin" : "Removed admin");
                      invalidate();
                    } catch (e) {
                      toast.error((e as Error).message);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never"}
              </p>
              <div className="flex items-center justify-end gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  title="Reset password"
                  onClick={() => {
                    setResetTarget(u);
                    setResetPwd(genPassword());
                  }}
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isSelf}
                  title="Delete user"
                  onClick={async () => {
                    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
                    try {
                      await deleteFn({ data: { user_id: u.id } });
                      toast.success("User deleted");
                      invalidate();
                    } catch (e) {
                      toast.error((e as Error).message);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!resetTarget} onOpenChange={(o) => !o && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Set a new temp password for {resetTarget?.email}. They will be prompted to
              change it on next sign-in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reset-pwd">New temp password</Label>
            <div className="flex gap-2">
              <Input
                id="reset-pwd"
                value={resetPwd}
                onChange={(e) => setResetPwd(e.target.value)}
                minLength={8}
              />
              <Button type="button" variant="outline" onClick={() => setResetPwd(genPassword())}>
                Generate
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetTarget(null)}>Cancel</Button>
            <Button
              disabled={resetMut.isPending || resetPwd.length < 8}
              onClick={() => resetMut.mutate()}
            >
              {resetMut.isPending ? "Saving…" : "Reset password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5" />
        Public self sign-up is disabled. New users can only be created here.
      </p>
    </AdminShell>
  );
}
