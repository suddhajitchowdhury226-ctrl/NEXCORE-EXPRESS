import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate, formatMoney } from "@/components/admin/admin-ui";

const STATUSES = ["new", "reviewing", "quoted", "accepted", "declined", "closed"] as const;

export const Route = createFileRoute("/admin/quotes")({ component: QuotesScreen });

function QuotesScreen() {
  return (
    <AdminResource
      title="Quote requests"
      description="Every quote submitted from the website. Update the status and record the quoted amount."
      table="quotes"
      canCreate={false}
      searchKeys={["reference", "full_name", "email", "service_type", "status"]}
      columns={[
        { key: "reference", label: "Reference" },
        { key: "full_name", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "service_type", label: "Service" },
        { key: "pickup_address", label: "Pickup" },
        { key: "destination_address", label: "Destination" },
        { key: "status", label: "Status" },
        { key: "quoted_amount", label: "Quoted", render: (row) => (row['quoted_amount'] == null ? "—" : formatMoney(row['quoted_amount'])) },
        { key: "created_at", label: "Received", render: (row) => formatDate(row['created_at']) },
      ]}
      fields={[
        { name: "full_name", label: "Customer", required: true },
        { name: "company_name", label: "Company" },
        { name: "email", label: "Email", required: true },
        { name: "phone", label: "Phone" },
        { name: "pickup_address", label: "Pickup address", required: true, full: true },
        { name: "destination_address", label: "Destination address", required: true, full: true },
        { name: "moving_date", label: "Moving date", type: "date" },
        { name: "service_type", label: "Service type", required: true },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "quoted_amount", label: "Quoted amount (CAD)", type: "number", step: "0.01" },
        { name: "admin_notes", label: "Internal notes", type: "textarea" },
      ]}
    />
  );
}
