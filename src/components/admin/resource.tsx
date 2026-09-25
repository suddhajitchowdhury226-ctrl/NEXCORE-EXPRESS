/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { AdminHeader, DataTable } from "@/components/admin/admin-ui";
import { useDeleteRow, useRows, useSaveRow, type Row } from "@/lib/admin/crud";

export type FieldType = "text" | "textarea" | "number" | "date" | "datetime" | "select" | "checkbox";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: readonly string[];
  optionsFrom?: { table: string; label: string; order?: string };
  required?: boolean;
  step?: string;
  full?: boolean;
  readOnly?: boolean;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

export type SubResource = {
  title: string;
  table: string;
  foreignKey: string;
  columns: Column[];
  fields: Field[];
  order?: string;
};

function fieldValue(field: Field, raw: FormDataEntryValue | null) {
  const value = raw === null ? "" : String(raw);
  if (field.type === "checkbox") return raw === "on";
  if (field.type === "number") return value === "" ? null : Number(value);
  if (value === "") return null;
  return value;
}

function FieldInput({
  field,
  defaultValue,
  relations,
}: {
  field: Field;
  defaultValue: any;
  relations: Record<string, Row[]>;
}) {
  const base = "field w-full border border-nex-line bg-white px-3 py-2.5 text-sm";
  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        rows={4}
        required={field.required ?? false}
        defaultValue={defaultValue ?? ""}
        className={base}
      />
    );
  }
  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        name={field.name}
        defaultChecked={Boolean(defaultValue)}
        className="size-5 accent-nex-green"
      />
    );
  }
  if (field.type === "select" || field.optionsFrom) {
    const items = field.optionsFrom
      ? (relations[field.optionsFrom.table] ?? []).map((row) => ({
          value: String(row['id']),
          label: String(row[field.optionsFrom!.label] ?? row['id']),
        }))
      : (field.options ?? []).map((option) => ({ value: option, label: option.replace(/_/g, " ") }));
    return (
      <select
        name={field.name}
        required={field.required ?? false}
        defaultValue={defaultValue ?? ""}
        className={base}
      >
        <option value="">—</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }
  const type =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : "text";
  let value = defaultValue ?? "";
  if (field.type === "datetime" && value) value = String(value).slice(0, 16);
  if (field.type === "date" && value) value = String(value).slice(0, 10);
  return (
    <input
      type={type}
      name={field.name}
      step={field.step ?? undefined}
      required={field.required ?? false}
      defaultValue={value}
      className={base}
    />
  );
}

function RecordForm({
  fields,
  record,
  relations,
  onCancel,
  onSubmit,
  busy,
}: {
  fields: Field[];
  record: Row | null;
  relations: Record<string, Row[]>;
  onCancel: () => void;
  onSubmit: (values: Row) => void;
  busy: boolean;
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values: Row = {};
        const isEdit = Boolean(record?.['id']);
        for (const field of fields) {
          if (field.readOnly) continue;
          const value = fieldValue(field, data.get(field.name));
          // On create, leave empty fields out so database defaults apply.
          if (value === null && !isEdit) continue;
          if (value === null && record?.[field.name] == null) continue;
          values[field.name] = value;
        }
        if (isEdit) values['id'] = record!['id'];
        onSubmit(values);
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className={field.full || field.type === "textarea" ? "sm:col-span-2" : ""}>
          <span className="field-label mb-1.5 block text-xs font-black uppercase tracking-wide">
            {field.label}
          </span>
          <FieldInput field={field} defaultValue={record?.[field.name]} relations={relations} />
        </label>
      ))}
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-nex-orange px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-nex-line px-5 py-3 text-sm font-extrabold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SubResourcePanel({ config, parent, onClose }: { config: SubResource; parent: Row; onClose: () => void }) {
  const rows = useRows(config.table, {
    eq: { column: config.foreignKey, value: String(parent['id']) },
    order: config.order ?? "created_at",
  });
  const save = useSaveRow(config.table);
  const remove = useDeleteRow(config.table);
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-4 border border-nex-line bg-nex-paper p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wide">{config.title}</h3>
        <div className="flex gap-2">
          <button
            className="bg-nex-ink px-3 py-2 text-xs font-extrabold text-white"
            onClick={() => setAdding((value) => !value)}
          >
            {adding ? "Close form" : "Add"}
          </button>
          <button className="border border-nex-line bg-white px-3 py-2 text-xs font-extrabold" onClick={onClose}>
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {adding ? (
        <div className="mb-5 bg-white p-5">
          <RecordForm
            fields={config.fields}
            record={null}
            relations={{}}
            busy={save.isPending}
            onCancel={() => setAdding(false)}
            onSubmit={(values) =>
              save.mutate({ ...values, [config.foreignKey]: parent['id'] }, { onSuccess: () => setAdding(false) })
            }
          />
        </div>
      ) : null}

      <DataTable
        columns={[...config.columns.map((column) => column.label), "Actions"]}
        isEmpty={(rows.data ?? []).length === 0}
        empty="No records yet."
      >
        {(rows.data ?? []).map((row) => (
          <tr key={String(row['id'])}>
            {config.columns.map((column) => (
              <td key={column.key} className="px-4 py-3">
                {column.render ? column.render(row) : (row[column.key] ?? "—")}
              </td>
            ))}
            <td className="px-4 py-3">
              <button
                className="text-xs font-bold text-red-600"
                onClick={() => remove.mutate(String(row['id']))}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

export function AdminResource({
  title,
  description,
  table,
  columns,
  fields,
  select,
  order = "created_at",
  ascending = false,
  searchKeys = [],
  canCreate = true,
  canDelete = true,
  subResource,
}: {
  title: string;
  description?: string;
  table: string;
  columns: Column[];
  fields: Field[];
  select?: string;
  order?: string;
  ascending?: boolean;
  searchKeys?: string[];
  canCreate?: boolean;
  canDelete?: boolean;
  subResource?: SubResource;
}) {
  const list = useRows(table, { ...(select ? { select } : {}), order, ascending });
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [openSub, setOpenSub] = useState<Row | null>(null);

  const relationTables = useMemo(
    () => Array.from(new Set(fields.map((field) => field.optionsFrom?.table).filter(Boolean) as string[])),
    [fields],
  );
  const relationA = useRows(
    relationTables[0] ?? "customers",
    { order: "created_at" },
    Boolean(relationTables[0]),
  );
  const relationB = useRows(
    relationTables[1] ?? "customers",
    { order: "created_at" },
    Boolean(relationTables[1]),
  );
  const relationC = useRows(
    relationTables[2] ?? "customers",
    { order: "created_at" },
    Boolean(relationTables[2]),
  );

  const relations: Record<string, Row[]> = {};
  if (relationTables[0]) relations[relationTables[0]] = relationA.data ?? [];
  if (relationTables[1]) relations[relationTables[1]] = relationB.data ?? [];
  if (relationTables[2]) relations[relationTables[2]] = relationC.data ?? [];

  const rows = (list.data ?? []).filter((row) => {
    if (!search.trim() || searchKeys.length === 0) return true;
    const needle = search.trim().toLowerCase();
    return searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(needle));
  });

  return (
    <div>
      <AdminHeader
        title={title}
        {...(description ? { description } : {})}
        action={
          canCreate ? (
            <button
              className="flex items-center gap-2 bg-nex-orange px-4 py-2.5 text-sm font-extrabold text-white"
              onClick={() => {
                setEditing(null);
                setCreating((value) => !value);
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              {creating ? "Close" : "New record"}
            </button>
          ) : undefined
        }
      />

      {searchKeys.length > 0 ? (
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search…"
          className="mb-5 w-full max-w-sm border border-nex-line bg-white px-3 py-2.5 text-sm"
        />
      ) : null}

      {creating || editing ? (
        <div className="mb-6 border border-nex-line bg-white p-6">
          <h2 className="mb-5 text-lg font-black">{editing ? "Edit record" : "New record"}</h2>
          <RecordForm
            fields={fields}
            record={editing}
            relations={relations}
            busy={save.isPending}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSubmit={(values) =>
              save.mutate(values, {
                onSuccess: () => {
                  setCreating(false);
                  setEditing(null);
                },
              })
            }
          />
        </div>
      ) : null}

      {list.isError ? (
        <div className="border border-nex-line bg-white p-6 text-sm text-red-600">
          Could not load records. Check your access permissions and try again.
        </div>
      ) : (
        <DataTable
          columns={[...columns.map((column) => column.label), "Actions"]}
          isEmpty={rows.length === 0}
          empty={list.isLoading ? "Loading…" : "No records yet."}
        >
          {rows.map((row) => (
            <tr key={String(row['id'])}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top">
                  {column.render ? column.render(row) : (row[column.key] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    className="text-nex-green"
                    aria-label="Edit"
                    onClick={() => {
                      setCreating(false);
                      setEditing(row);
                    }}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  {subResource ? (
                    <button
                      className="text-xs font-bold underline underline-offset-4"
                      onClick={() => setOpenSub(openSub?.['id'] === row['id'] ? null : row)}
                    >
                      {subResource.title}
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      className="text-red-600"
                      aria-label="Delete"
                      onClick={() => {
                        if (confirm("Delete this record permanently?")) remove.mutate(String(row['id']));
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {subResource && openSub ? (
        <SubResourcePanel config={subResource} parent={openSub} onClose={() => setOpenSub(null)} />
      ) : null}
    </div>
  );
}
