import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate, formatMoney } from "@/components/admin/admin-ui";

const STATUSES = ["draft", "sent", "partly_paid", "paid", "overdue", "void"] as const;

export const Route = createFileRoute("/admin/invoices")({ component: InvoicesScreen });

function InvoicesScreen() {
  return (
    <AdminResource
      title="Invoices"
      description="Create and edit invoices, add line items, set taxes and dates, and mark invoices paid."
      table="invoices"
      searchKeys={["invoice_number", "status"]}
      columns={[
        { key: "invoice_number", label: "Invoice" },
        { key: "issue_date", label: "Issued", render: (row) => formatDate(row['issue_date']) },
        { key: "due_date", label: "Due", render: (row) => formatDate(row['due_date']) },
        { key: "subtotal", label: "Subtotal", render: (row) => formatMoney(row['subtotal']) },
        { key: "tax_amount", label: "Tax", render: (row) => formatMoney(row['tax_amount']) },
        { key: "total", label: "Total", render: (row) => formatMoney(row['total']) },
        { key: "amount_paid", label: "Paid", render: (row) => formatMoney(row['amount_paid']) },
        {
          key: "outstanding",
          label: "Outstanding",
          render: (row) => formatMoney(Number(row['total'] ?? 0) - Number(row['amount_paid'] ?? 0)),
        },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "invoice_number", label: "Invoice number", required: true },
        { name: "customer_id", label: "Customer", optionsFrom: { table: "customers", label: "full_name" }, required: true },
        { name: "booking_id", label: "Booking", optionsFrom: { table: "bookings", label: "booking_number" } },
        { name: "issue_date", label: "Issue date", type: "date" },
        { name: "due_date", label: "Due date", type: "date" },
        { name: "currency", label: "Currency" },
        { name: "subtotal", label: "Subtotal", type: "number", step: "0.01" },
        { name: "tax_rate", label: "Tax rate (%)", type: "number", step: "0.01" },
        { name: "tax_amount", label: "Tax amount", type: "number", step: "0.01" },
        { name: "total", label: "Total", type: "number", step: "0.01" },
        { name: "amount_paid", label: "Amount paid", type: "number", step: "0.01" },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "sent_at", label: "Sent at", type: "datetime" },
        { name: "paid_at", label: "Paid at", type: "datetime" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      subResource={{
        title: "Line items",
        table: "invoice_items",
        foreignKey: "invoice_id",
        columns: [
          { key: "description", label: "Description" },
          { key: "quantity", label: "Qty" },
          { key: "unit_price", label: "Unit price", render: (row) => formatMoney(row['unit_price']) },
          { key: "amount", label: "Amount", render: (row) => formatMoney(row['amount']) },
        ],
        fields: [
          { name: "description", label: "Description", required: true, full: true },
          { name: "quantity", label: "Quantity", type: "number", step: "0.01" },
          { name: "unit_price", label: "Unit price", type: "number", step: "0.01" },
          { name: "amount", label: "Amount", type: "number", step: "0.01" },
        ],
      }}
    />
  );
}
