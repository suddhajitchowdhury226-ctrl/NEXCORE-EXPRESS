import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate } from "@/components/admin/admin-ui";

const STATUSES = [
  "booked",
  "scheduled",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "on_hold",
  "cancelled",
] as const;

export const Route = createFileRoute("/admin/shipments")({ component: ShipmentsScreen });

function ShipmentsScreen() {
  return (
    <AdminResource
      title="Shipments & tracking"
      description="Create tracking references, update status and progress, and add the tracking events customers see."
      table="shipments"
      searchKeys={["tracking_number", "order_number", "reference", "status", "destination_city"]}
      columns={[
        { key: "tracking_number", label: "Tracking" },
        { key: "order_number", label: "Order no." },
        { key: "reference", label: "Reference" },
        { key: "origin_city", label: "From" },
        { key: "destination_city", label: "To" },
        { key: "status", label: "Status" },
        { key: "progress_percent", label: "Progress", render: (row) => `${row['progress_percent'] ?? 0}%` },
        { key: "estimated_delivery", label: "ETA", render: (row) => formatDate(row['estimated_delivery']) },
      ]}
      fields={[
        { name: "tracking_number", label: "Tracking number", required: true },
        { name: "order_number", label: "Order number" },
        { name: "reference", label: "Shipment reference" },
        { name: "customer_id", label: "Customer", optionsFrom: { table: "customers", label: "full_name" } },
        { name: "booking_id", label: "Booking", optionsFrom: { table: "bookings", label: "booking_number" } },
        { name: "origin_address", label: "Pickup address", required: true, full: true },
        { name: "origin_city", label: "Pickup city" },
        { name: "origin_latitude", label: "Pickup latitude", type: "number", step: "any" },
        { name: "origin_longitude", label: "Pickup longitude", type: "number", step: "any" },
        { name: "destination_address", label: "Destination address", required: true, full: true },
        { name: "destination_city", label: "Destination city" },
        { name: "destination_latitude", label: "Destination latitude", type: "number", step: "any" },
        { name: "destination_longitude", label: "Destination longitude", type: "number", step: "any" },
        { name: "current_location", label: "Current location" },
        { name: "current_latitude", label: "Current latitude", type: "number", step: "any" },
        { name: "current_longitude", label: "Current longitude", type: "number", step: "any" },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "progress_percent", label: "Progress (%)", type: "number" },
        { name: "vehicle", label: "Vehicle" },
        { name: "crew_size", label: "Crew size", type: "number" },
        { name: "pickup_date", label: "Pickup date", type: "date" },
        { name: "estimated_delivery", label: "Estimated delivery", type: "datetime" },
        { name: "delivered_at", label: "Delivered at", type: "datetime" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      subResource={{
        title: "Tracking events",
        table: "tracking_events",
        foreignKey: "shipment_id",
        order: "event_time",
        columns: [
          { key: "event_time", label: "Time", render: (row) => new Date(String(row['event_time'])).toLocaleString() },
          { key: "status", label: "Status" },
          { key: "location", label: "Location" },
          { key: "description", label: "Description" },
        ],
        fields: [
          { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
          { name: "description", label: "Description", full: true },
          { name: "location", label: "Location" },
          { name: "event_time", label: "Event time", type: "datetime" },
          { name: "latitude", label: "Latitude", type: "number", step: "any" },
          { name: "longitude", label: "Longitude", type: "number", step: "any" },
        ],
      }}
    />
  );
}
