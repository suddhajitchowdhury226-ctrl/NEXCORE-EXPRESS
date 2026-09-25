import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate, formatMoney } from "@/components/admin/admin-ui";

const STATUSES = ["pending", "confirmed", "scheduled", "in_progress", "completed", "cancelled"] as const;

export const Route = createFileRoute("/admin/bookings")({ component: BookingsScreen });

function BookingsScreen() {
  return (
    <AdminResource
      title="Bookings"
      description="Confirmed jobs linked to a customer, a service and — where created — a shipment and invoice."
      table="bookings"
      searchKeys={["booking_number", "status", "pickup_address", "destination_address"]}
      columns={[
        { key: "booking_number", label: "Booking" },
        { key: "pickup_address", label: "Pickup" },
        { key: "destination_address", label: "Destination" },
        { key: "scheduled_date", label: "Scheduled", render: (row) => formatDate(row['scheduled_date']) },
        { key: "crew_size", label: "Crew" },
        { key: "status", label: "Status" },
        { key: "total_amount", label: "Total", render: (row) => (row['total_amount'] == null ? "—" : formatMoney(row['total_amount'])) },
      ]}
      fields={[
        { name: "customer_id", label: "Customer", optionsFrom: { table: "customers", label: "full_name" }, required: true },
        { name: "service_id", label: "Service", optionsFrom: { table: "services", label: "title" } },
        { name: "pickup_address", label: "Pickup address", required: true, full: true },
        { name: "destination_address", label: "Destination address", required: true, full: true },
        { name: "scheduled_date", label: "Scheduled date", type: "date" },
        { name: "scheduled_time", label: "Scheduled time" },
        { name: "crew_size", label: "Crew size", type: "number" },
        { name: "requirements", label: "Requirements", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "total_amount", label: "Total amount (CAD)", type: "number", step: "0.01" },
      ]}
    />
  );
}
