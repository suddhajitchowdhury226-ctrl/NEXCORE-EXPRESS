import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/lib/admin/use-admin-session";
import logo from "@/assets/nexcore-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | NexCore Express Ltd." },
      {
        name: "description",
        content: "Secure sign-in for NexCore Express staff and administrators.",
      },
      { property: "og:title", content: "Staff Sign In | NexCore Express" },
      { property: "og:description", content: "Secure sign-in for NexCore Express staff." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, isStaff, loading } = useAdminSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isStaff) {
      void navigate({ to: "/admin" });
    }
  }, [loading, session, isStaff, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setBusy(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Signed in.");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { full_name: String(form.get("full_name") || "") },
        },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. An administrator must grant staff access.");
      setMode("signin");
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-nex-ink px-5 py-16">
      <div className="w-full max-w-md bg-white p-8">
        <img src={logo} alt="NexCore Express" className="h-10 w-auto" />
        <h1 className="mt-8 text-3xl font-black text-nex-ink">
          {mode === "signin" ? "Staff sign in" : "Create staff account"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-nex-muted">
          Access to the admin panel is limited to accounts with a staff or administrator role.
        </p>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div>
              <label className="field-label" htmlFor="full_name">
                Full name
              </label>
              <input className="field" id="full_name" name="full_name" />
            </div>
          ) : null}
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input className="field" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              className="field"
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="bg-nex-orange px-5 py-4 font-extrabold text-white disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>


        <button
          type="button"
          className="mt-6 text-sm font-bold text-nex-green underline underline-offset-4"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>

        {session && !isStaff && !loading ? (
          <p className="mt-6 border-t border-nex-line pt-6 text-sm text-nex-muted">
            You are signed in, but this account does not have staff access yet. Ask an administrator
            to grant it.
          </p>
        ) : null}
      </div>
    </div>
  );
}
