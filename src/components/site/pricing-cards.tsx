"use client";

import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Phone, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  ALL_SERVICES,
  CATEGORIES,
  CATEGORY_COLOR,
  CATEGORY_ICONS,
  NOTES,
  type ServiceItem,
} from "@/lib/pricing-data";

/* ─── Single service card ────────────────────────────────────────────────── */
function ServiceCard({ item }: { item: ServiceItem }) {
  const Icon = CATEGORY_ICONS[item.category]!;
  const headerBg = CATEGORY_COLOR[item.category] ?? "bg-[#1e4d7b]";
  const isCallForQuote = item.price === "Call for Quote";

  return (
    <article className="flex flex-col overflow-hidden border border-nex-line bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Category badge header */}
      <div className={`${headerBg} flex items-center gap-2 px-4 py-2.5`}>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/25">
          <Icon className="size-3.5 text-white" aria-hidden="true" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-white">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="flex-1 font-bold leading-snug text-nex-ink">{item.service}</p>

        <div className="flex items-end justify-between gap-3 border-t border-nex-line pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-nex-muted">Price</p>
            <p
              className={`mt-0.5 text-2xl font-extrabold leading-none ${
                isCallForQuote ? "text-nex-orange text-base" : "text-nex-green"
              }`}
            >
              {item.price}
            </p>
            <p className="mt-0.5 text-[10px] text-nex-muted">+ HST</p>
          </div>

          {isCallForQuote ? (
            <a
              href="tel:+12896457777"
              className="flex items-center gap-1.5 bg-nex-lime px-4 py-2.5 text-xs font-extrabold text-nex-ink hover:bg-nex-lime/80"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              Call Us
            </a>
          ) : (
            <Link
              to="/pay"
              search={{ service: item.service, price: item.price, amount: item.amount ?? undefined }}
              className="flex items-center gap-1.5 bg-nex-orange px-4 py-2.5 text-xs font-extrabold text-white hover:bg-nex-orange/90"
            >
              Pay Now
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── Main exported component ────────────────────────────────────────────── */
export function PricingCards({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo<ServiceItem[]>(() => {
    const q = query.trim().toLowerCase();
    return ALL_SERVICES.filter((s) => {
      const matchCat =
        activeCategory === "all" || s.category === activeCategory;
      const matchQ =
        !q ||
        s.service.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  /* group by category for display */
  const groups = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const s of filtered) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      {/* ── Search + filter bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-nex-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            aria-label="Search services"
            className="w-full border border-nex-line bg-white py-3 pl-10 pr-10 text-sm text-nex-ink placeholder:text-nex-muted/60 focus:border-nex-green focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nex-muted hover:text-nex-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`whitespace-nowrap px-3.5 py-2 text-xs font-extrabold transition-colors ${
                activeCategory === cat.value
                  ? "bg-nex-ink text-white"
                  : "border border-nex-line bg-white text-nex-muted hover:border-nex-ink hover:text-nex-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Result count ── */}
      <p className="mt-3 text-xs font-bold text-nex-muted">
        {filtered.length} service{filtered.length !== 1 ? "s" : ""} found
        {query ? ` for "${query}"` : ""}
      </p>

      {/* ── No results ── */}
      {filtered.length === 0 && (
        <div className="mt-8 border border-nex-line bg-white p-10 text-center">
          <Search className="mx-auto size-10 text-nex-muted/40" />
          <p className="mt-4 font-bold text-nex-ink">No services match your search.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setActiveCategory("all"); }}
            className="mt-3 text-sm font-bold text-nex-orange underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Cards grouped by category ── */}
      {groups.map(([category, items]) => (
        <div key={category} className="mt-8">
          {/* Category heading */}
          <div className={`${CATEGORY_COLOR[category] ?? "bg-[#1e4d7b]"} flex items-center gap-3 px-4 py-3`}>
            {(() => {
              const Icon = CATEGORY_ICONS[category]!;
              return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <Icon className="size-3.5 text-white" aria-hidden="true" />
                </div>
              );
            })()}
            <h3 className="text-sm font-black uppercase tracking-wide text-white">{category}</h3>
            <span className="ml-auto text-xs font-bold text-white/70">
              {items.length} service{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards grid */}
          <div className={`mt-3 grid gap-3 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
            {items.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* ── Important notes (shown only when all/unfiltered) ── */}
      {!compact && activeCategory === "all" && !query && (
        <div className="mt-10 overflow-hidden border border-nex-line bg-white shadow-sm">
          <div className="flex items-center gap-3 bg-[#1e4d7b] px-5 py-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <AlertCircle className="size-4 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wide text-white">
              Important Information
            </h3>
          </div>
          <ul className="divide-y divide-nex-line">
            {NOTES.map((note) => (
              <li key={note} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nex-green" />
                <span className="text-sm text-nex-ink">{note}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2 border-t border-nex-line bg-nex-paper px-5 py-3">
            <span className="text-xs font-bold uppercase tracking-wider text-nex-muted">
              We accept:
            </span>
            {["Interac", "Visa", "Mastercard", "Debit"].map((m) => (
              <span
                key={m}
                className="rounded border border-nex-line bg-white px-2.5 py-1 text-xs font-extrabold text-nex-ink shadow-sm"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
