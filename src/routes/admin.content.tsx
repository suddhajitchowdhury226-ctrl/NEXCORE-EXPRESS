import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";

export const Route = createFileRoute("/admin/content")({ component: ContentScreen });

function ContentScreen() {
  return (
    <AdminResource
      title="Website content"
      description="Editable text used across the website — contact details, addresses and section copy."
      table="site_content"
      order="group_name"
      ascending
      searchKeys={["key", "label", "group_name"]}
      columns={[
        { key: "label", label: "Label" },
        { key: "key", label: "Key" },
        { key: "group_name", label: "Group" },
        { key: "value", label: "Value" },
      ]}
      fields={[
        { name: "key", label: "Key", required: true },
        { name: "label", label: "Label", required: true },
        { name: "group_name", label: "Group" },
        { name: "value", label: "Value", type: "textarea", required: true },
      ]}
    />
  );
}
