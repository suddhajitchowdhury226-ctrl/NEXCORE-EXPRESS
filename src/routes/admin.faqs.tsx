import { createFileRoute } from "@tanstack/react-router";

import { AdminResource } from "@/components/admin/resource";

export const Route = createFileRoute("/admin/faqs")({ component: FaqsScreen });

function FaqsScreen() {
  return (
    <AdminResource
      title="FAQs"
      description="Questions and answers published on the FAQ page."
      table="faqs"
      order="sort_order"
      searchKeys={["question", "category"]}
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category" },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Live", render: (row) => (row['is_active'] ? "Yes" : "No") },
      ]}
      fields={[
        { name: "question", label: "Question", required: true, full: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "category", label: "Category" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Show on website", type: "checkbox" },
      ]}
    />
  );
}
