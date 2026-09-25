import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatMoney } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/services")({ component: ServicesScreen });

function ServicesScreen() {
  return (
    <AdminResource
      title="Services"
      description="Service cards, descriptions, images and pricing shown across the website."
      table="services"
      order="sort_order"
      searchKeys={["title", "slug", "category"]}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "URL slug" },
        { key: "category", label: "Category" },
        { key: "base_price", label: "From", render: (row) => (row['base_price'] == null ? "—" : formatMoney(row['base_price'])) },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Live", render: (row) => (row['is_active'] ? "Yes" : "No") },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "URL slug", required: true },
        { name: "short_description", label: "Short description", type: "textarea", required: true },
        { name: "long_description", label: "Full description", type: "textarea" },
        { name: "icon", label: "Icon key" },
        { name: "image_url", label: "Image URL", full: true },
        { name: "category", label: "Category" },
        { name: "base_price", label: "Starting price (CAD)", type: "number", step: "0.01" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Show on website", type: "checkbox" },
      ]}
    />
  );
}
