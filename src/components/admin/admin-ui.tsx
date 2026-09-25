import type { ReactNode } from "react";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-nex-ink">{title}</h1>
        {description ? <p className="mt-2 text-sm text-nex-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-nex-line bg-white p-6 ${className}`}>{children}</div>;
}

export function DataTable({
  columns,
  children,
  empty,
  isEmpty,
}: {
  columns: string[];
  children: ReactNode;
  empty: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="border border-nex-line bg-white p-10 text-center text-sm text-nex-muted">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-nex-line bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-nex-paper">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-xs font-black uppercase tracking-wide">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-nex-line">{children}</tbody>
      </table>
    </div>
  );
}

export function StatusSelect({
  value,
  options,
  onChange,
  disabled,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      className="border border-nex-line bg-white px-2 py-1.5 text-xs font-bold"
      value={value}
      disabled={disabled ?? false}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

export function formatMoney(value: number | null | undefined, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
