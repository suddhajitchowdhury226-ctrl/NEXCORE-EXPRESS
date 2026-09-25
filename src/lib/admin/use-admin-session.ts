import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AdminSessionState = {
  loading: boolean;
  session: Session | null;
  isStaff: boolean;
  isAdmin: boolean;
};

/**
 * Reads the current Supabase session and resolves the signed-in user's role
 * through the security-definer has_role/is_staff functions. Route-level
 * rendering uses this for UX only — the database RLS policies are the real
 * access boundary.
 */
export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({
    loading: true,
    session: null,
    isStaff: false,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    async function resolve(session: Session | null) {
      if (!session) {
        if (active) setState({ loading: false, session: null, isStaff: false, isAdmin: false });
        return;
      }
      const [{ data: staff }, { data: admin }] = await Promise.all([
        supabase.rpc("is_staff", { _user_id: session.user.id }),
        supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }),
      ]);
      if (active) {
        setState({
          loading: false,
          session,
          isStaff: Boolean(staff),
          isAdmin: Boolean(admin),
        });
      }
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, loading: true }));
      void resolve(session);
    });

    void supabase.auth.getSession().then(({ data }) => resolve(data.session));

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
