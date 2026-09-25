import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/customers")({ component: CustomersScreen });

function CustomersScreen() {
  return (
    <AdminResource
      title="Customers"
      description="Add, edit and search the customer records that bookings, invoices and payments link to."
      table="customers"
      searchKeys={["full_name", "email", "company_name", "city", "phone"]}
      columns={[
        { key: "full_name", label: "Name" },
        { key: "company_name", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "city", label: "City" },
        { key: "created_at", label: "Added", render: (row) => formatDate(row['created_at']) },
      ]}
      fields={[
        { name: "full_name", label: "Full name", required: true },
        { name: "company_name", label: "Company name" },
        { name: "email", label: "Email", required: true },
        { name: "phone", label: "Phone" },
        { name: "address_line", label: "Address", full: true },
        { name: "city", label: "City" },
        { name: "province", label: "Province" },
        { name: "postal_code", label: "Postal code" },
        { name: "country", label: "Country" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
