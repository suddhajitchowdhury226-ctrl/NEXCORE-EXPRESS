import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const serviceAreasQuery = queryOptions({
  queryKey: ["service_areas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("service_areas")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const siteContentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_content").select("*").order("group_name");
    if (error) throw error;
    return Object.fromEntries(data.map((row) => [row.key, row.value])) as Record<string, string>;
  },
});
