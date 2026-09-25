import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate, formatMoney } from "@/components/admin/admin-ui";

const STATUSES = ["pending", "succeeded", "failed", "refunded", "cancelled"] as const;
const METHODS = ["card", "bank_transfer", "cash", "cheque", "e_transfer"] as const;

export const Route = createFileRoute("/admin/payments")({ component: PaymentsScreen });

function PaymentsScreen() {
  return (
    <AdminResource
      title="Payments"
      description="Transactions linked to customers, invoices and bookings. Online card payments will write here once a payment provider is connected."
      table="payments"
      searchKeys={["status", "method", "provider", "provider_reference"]}
      columns={[
        { key: "created_at", label: "Recorded", render: (row) => formatDate(row['created_at']) },
        { key: "amount", label: "Amount", render: (row) => formatMoney(row['amount'], String(row['currency'] ?? "CAD")) },
        { key: "method", label: "Method" },
        { key: "provider", label: "Provider" },
        { key: "provider_reference", label: "Provider ref." },
        { key: "status", label: "Status" },
        { key: "paid_at", label: "Paid", render: (row) => formatDate(row['paid_at']) },
      ]}
      fields={[
        { name: "customer_id", label: "Customer", optionsFrom: { table: "customers", label: "full_name" } },
        { name: "invoice_id", label: "Invoice", optionsFrom: { table: "invoices", label: "invoice_number" } },
        { name: "booking_id", label: "Booking", optionsFrom: { table: "bookings", label: "booking_number" } },
        { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
        { name: "currency", label: "Currency" },
        { name: "method", label: "Method", type: "select", options: METHODS, required: true },
        { name: "provider", label: "Provider" },
        { name: "provider_reference", label: "Provider reference" },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "paid_at", label: "Paid at", type: "datetime" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
