/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export type Row = Record<string, any>;

export type ListOptions = {
  select?: string;
  order?: string;
  ascending?: boolean;
  limit?: number;
  eq?: { column: string; value: string } | undefined;
};

export function useRows(table: string, options: ListOptions = {}, enabled = true) {
  return useQuery({
    queryKey: ["admin", table, options],
    enabled,
    queryFn: async () => {
      let query: any = (supabase.from(table as never) as any).select(options.select ?? "*");
      if (options.eq) query = query.eq(options.eq.column, options.eq.value);
      if (options.order) query = query.order(options.order, { ascending: options.ascending ?? false });
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

export function useSaveRow(table: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      const { id, ...rest } = values;
      const client: any = supabase.from(table as never);
      const { error } = id
        ? await client.update(rest).eq("id", id)
        : await client.insert(rest);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success("Saved.");
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Could not save the record."),
  });
}

export function useDeleteRow(table: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(table as never) as any).delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success("Deleted.");
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Could not delete the record."),
  });
}
