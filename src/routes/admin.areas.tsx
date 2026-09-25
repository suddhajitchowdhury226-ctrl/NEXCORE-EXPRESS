import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";

export const Route = createFileRoute("/admin/areas")({ component: AreasScreen });

function AreasScreen() {
  return (
    <AdminResource
      title="Service areas"
      description="Coverage regions used by the service-area page and address checks."
      table="service_areas"
      order="sort_order"
      searchKeys={["name", "province"]}
      columns={[
        { key: "name", label: "Area" },
        { key: "province", label: "Province" },
        { key: "country", label: "Country" },
        { key: "radius_km", label: "Radius (km)" },
        {
          key: "postal_prefixes",
          label: "Postal prefixes",
          render: (row) => (Array.isArray(row['postal_prefixes']) ? row['postal_prefixes'].join(", ") : "—"),
        },
        { key: "is_active", label: "Live", render: (row) => (row['is_active'] ? "Yes" : "No") },
      ]}
      fields={[
        { name: "name", label: "Area name", required: true },
        { name: "province", label: "Province" },
        { name: "country", label: "Country" },
        { name: "latitude", label: "Latitude", type: "number", step: "any" },
        { name: "longitude", label: "Longitude", type: "number", step: "any" },
        { name: "radius_km", label: "Coverage radius (km)", type: "number" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Show on website", type: "checkbox" },
      ]}
    />
  );
}
