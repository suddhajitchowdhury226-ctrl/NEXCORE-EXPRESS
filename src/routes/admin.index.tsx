import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AdminCard, AdminHeader, formatMoney } from "@/components/admin/admin-ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [quotes, enquiries, customers, bookings, shipments, invoices, payments] =
        await Promise.all([
          supabase.from("quotes").select("id", { count: "exact", head: true }),
          supabase.from("enquiries").select("id", { count: "exact", head: true }),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("bookings").select("id", { count: "exact", head: true }),
          supabase.from("shipments").select("id", { count: "exact", head: true }),
          supabase.from("invoices").select("total, amount_paid"),
          supabase.from("payments").select("amount, status"),
        ]);

      const invoiceRows = invoices.data ?? [];
      const paymentRows = payments.data ?? [];

      return {
        quotes: quotes.count ?? 0,
        enquiries: enquiries.count ?? 0,
        customers: customers.count ?? 0,
        bookings: bookings.count ?? 0,
        shipments: shipments.count ?? 0,
        invoiced: invoiceRows.reduce((sum, row) => sum + Number(row.total), 0),
        outstanding: invoiceRows.reduce(
          (sum, row) => sum + Number(row.total) - Number(row.amount_paid),
          0,
        ),
        received: paymentRows
          .filter((row) => row.status === "succeeded" || row.status === "paid")
          .reduce((sum, row) => sum + Number(row.amount), 0),
      };
    },
  });

  const { data: recentQuotes } = useQuery({
    queryKey: ["admin-recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, reference, full_name, service_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <AdminHeader
        title="Operations dashboard"
        description="Live counts read directly from the database — no sample data."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Quote requests", value: stats?.quotes },
          { label: "Enquiries", value: stats?.enquiries },
          { label: "Customers", value: stats?.customers },
          { label: "Bookings", value: stats?.bookings },
          { label: "Shipments", value: stats?.shipments },
        ].map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-xs font-black uppercase tracking-wide text-nex-muted">{stat.label}</p>
            <p className="mt-3 text-3xl font-black">{stat.value ?? "—"}</p>
          </AdminCard>
        ))}
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-wide text-nex-muted">Invoiced</p>
          <p className="mt-3 text-3xl font-black">{formatMoney(stats?.invoiced)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-wide text-nex-muted">Outstanding</p>
          <p className="mt-3 text-3xl font-black">{formatMoney(stats?.outstanding)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-wide text-nex-muted">
            Payments received
          </p>
          <p className="mt-3 text-3xl font-black">{formatMoney(stats?.received)}</p>
        </AdminCard>
      </div>

      <h2 className="mt-12 text-xl font-black">Latest quote requests</h2>
      <div className="mt-4 overflow-x-auto border border-nex-line bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-nex-paper">
            <tr>
              {["Reference", "Customer", "Service", "Status", "Received"].map((column) => (
                <th key={column} className="px-4 py-3 text-xs font-black uppercase">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nex-line">
            {(recentQuotes ?? []).map((quote) => (
              <tr key={quote.id}>
                <td className="px-4 py-3 font-bold">{quote.reference}</td>
                <td className="px-4 py-3">{quote.full_name}</td>
                <td className="px-4 py-3">{quote.service_type}</td>
                <td className="px-4 py-3">{quote.status}</td>
                <td className="px-4 py-3 text-nex-muted">
                  {new Date(quote.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {(recentQuotes ?? []).length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-nex-muted" colSpan={5}>
                  No quote requests yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
