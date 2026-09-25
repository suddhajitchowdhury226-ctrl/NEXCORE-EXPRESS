import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";
import { formatDate } from "@/components/admin/admin-ui";

const STATUSES = ["new", "in_progress", "answered", "closed"] as const;

export const Route = createFileRoute("/admin/enquiries")({ component: EnquiriesScreen });

function EnquiriesScreen() {
  return (
    <AdminResource
      title="Enquiries"
      description="Contact form submissions from the website."
      table="enquiries"
      canCreate={false}
      searchKeys={["reference", "name", "email", "subject", "status"]}
      columns={[
        { key: "reference", label: "Reference" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "subject", label: "Subject" },
        { key: "enquiry_type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Received", render: (row) => formatDate(row['created_at']) },
      ]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "email", label: "Email", required: true },
        { name: "phone", label: "Phone" },
        { name: "subject", label: "Subject", required: true },
        { name: "enquiry_type", label: "Enquiry type", required: true },
        { name: "location", label: "Location" },
        { name: "message", label: "Message", type: "textarea", required: true },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "admin_notes", label: "Internal notes", type: "textarea" },
      ]}
    />
  );
}
