import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/lib/admin/use-admin-session";

const MODULES: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/quotes", label: "Quote requests" },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/shipments", label: "Shipments & tracking" },
  { to: "/admin/invoices", label: "Invoices" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/faqs", label: "FAQs" },
  { to: "/admin/areas", label: "Service areas" },
  { to: "/admin/content", label: "Website content" },
  { to: "/admin/settings", label: "Settings" },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin | NexCore Express Ltd." },
      { name: "description", content: "NexCore Express internal operations panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, session, isStaff } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nex-paper text-nex-muted">
        Loading admin panel…
      </div>
    );
  }

  if (!session) return null;

  if (!isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nex-paper px-5">
        <div className="max-w-md border border-nex-line bg-white p-8 text-center">
          <h1 className="text-2xl font-black">Access denied</h1>
          <p className="mt-3 leading-7 text-nex-muted">
            This account does not have staff permissions. An administrator must grant the staff or
            admin role before the operations panel opens.
          </p>
          <button
            className="mt-6 bg-nex-ink px-5 py-3 font-extrabold text-white"
            onClick={() => void supabase.auth.signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nex-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-8 lg:flex-row lg:px-8">
        <aside className="lg:w-60 lg:shrink-0">
          <div className="mb-6 flex items-center justify-between gap-3">
            <span className="text-lg font-black text-nex-ink">NexCore Admin</span>
          </div>
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            {MODULES.map((module) => (
              <Link
                key={module.to}
                to={module.to}
                activeOptions={{ exact: module.exact ?? false }}
                className="border border-nex-line bg-white px-3 py-2 text-sm font-bold text-nex-ink [&.active]:bg-nex-ink [&.active]:text-white"
              >
                {module.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/" className="border border-nex-line bg-white px-3 py-2 text-sm font-bold">
              View website
            </Link>
            <button
              className="flex items-center gap-2 bg-nex-ink px-3 py-2 text-sm font-bold text-white"
              onClick={() => void supabase.auth.signOut().then(() => navigate({ to: "/auth" }))}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
