/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AdminCard, AdminHeader, DataTable } from "@/components/admin/admin-ui";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/lib/admin/use-admin-session";

export const Route = createFileRoute("/admin/settings")({ component: SettingsScreen });

const ROLES = ["admin", "staff", "customer"] as const;

function SettingsScreen() {
  const { session, isAdmin } = useAdminSession();
  const queryClient = useQueryClient();

  const people = useQuery({
    queryKey: ["admin", "user_roles", "people"],
    enabled: isAdmin,
    queryFn: async () => {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, created_at"),
        supabase.from("user_roles").select("id, user_id, role"),
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      return (profiles.data ?? []).map((profile) => ({
        ...profile,
        roles: (roles.data ?? []).filter((role) => role.user_id === profile.id),
      }));
    },
  });

  const grant = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: (typeof ROLES)[number] }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role granted.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "user_roles", "people"] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Could not grant the role."),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role removed.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "user_roles", "people"] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Could not remove the role."),
  });

  return (
    <div>
      <AdminHeader
        title="Settings"
        description="Your account and, for administrators, who can access this panel."
      />

      <AdminCard className="mb-8">
        <p className="text-xs font-black uppercase tracking-wide text-nex-muted">Signed in as</p>
        <p className="mt-2 text-lg font-black">{session?.user.email}</p>
        <p className="mt-1 text-sm text-nex-muted">
          Access level: {isAdmin ? "Administrator" : "Staff"}
        </p>
      </AdminCard>

      <h2 className="mb-4 text-xl font-black">Team access</h2>
      {!isAdmin ? (
        <div className="border border-nex-line bg-white p-6 text-sm text-nex-muted">
          Only administrators can change who has access to this panel.
        </div>
      ) : (
        <DataTable
          columns={["Name", "Email", "Roles", "Grant role"]}
          isEmpty={(people.data ?? []).length === 0}
          empty={people.isLoading ? "Loading…" : "No registered accounts yet."}
        >
          {(people.data ?? []).map((person) => (
            <tr key={person.id}>
              <td className="px-4 py-3">{person.full_name ?? "—"}</td>
              <td className="px-4 py-3">{person.email ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {person.roles.length === 0 ? <span className="text-nex-muted">None</span> : null}
                  {person.roles.map((role) => (
                    <button
                      key={role.id}
                      className="border border-nex-line px-2 py-1 text-xs font-bold"
                      onClick={() => revoke.mutate(role.id)}
                      title="Remove role"
                    >
                      {role.role} ✕
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <select
                  className="border border-nex-line bg-white px-2 py-1.5 text-xs font-bold"
                  value=""
                  onChange={(event) => {
                    const role = event.target.value as (typeof ROLES)[number];
                    if (role) grant.mutate({ userId: person.id, role });
                    event.target.value = "";
                  }}
                >
                  <option value="">Grant…</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
