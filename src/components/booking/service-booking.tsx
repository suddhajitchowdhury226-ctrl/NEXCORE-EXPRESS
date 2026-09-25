import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { createServiceBooking } from "@/lib/service-booking.functions";
import { siteContentQuery } from "@/lib/site-queries";

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricing_rule: string;
  unit_label: string | null;
  requires_quote: boolean;
  allow_quantity: boolean;
};

const CATEGORY_ORDER = [
  "Delivery Services",
  "Removal & Disposal",
  "Kitchen Appliances",
  "Washer & Dryer Services",
  "Special Services",
];

const CATEGORY_ICONS: Record<string, typeof Truck> = {
  "Delivery Services": Truck,
  "Removal & Disposal": Trash2,
  "Kitchen Appliances": Building2,
  "Washer & Dryer Services": Wrench,
  "Special Services": ShieldCheck,
};

const IMPORTANT_INFO = [
  "All deliveries include basic placement of the appliance.",
  "Installation materials are extra unless otherwise specified.",
  "Customer must ensure access paths are clear before delivery.",
  "Elevator booking is the customer's responsibility.",
  "Appliances over 350 lbs may require additional manpower.",
  "HST is extra on all services.",
];

const applianceServicesQuery = {
  queryKey: ["appliance_services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("appliance_services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as ServiceRow[];
  },
};

function money(value: number) {
  return `$${value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function quantityLabel(service: ServiceRow, quantity: number) {
  if (service.pricing_rule === "per_floor") return `Floor ${quantity + 2}`;
  if (service.pricing_rule === "per_flight") return `${quantity} flight${quantity > 1 ? "s" : ""}`;
  if (quantity > 1) return `x${quantity}`;
  return "";
}

export function ServiceBooking() {
  const navigate = useNavigate();
  const { data: services } = useQuery(applianceServicesQuery);
  const { data: content } = useQuery(siteContentQuery);
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const taxRate = Number(content?.["hst_rate"] ?? 13) || 0;
  const list = services ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, ServiceRow[]>();
    for (const service of list) {
      const bucket = map.get(service.category) ?? [];
      bucket.push(service);
      map.set(service.category, bucket);
    }
    return [...map.entries()].sort(
      (a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]),
    );
  }, [list]);

  const lines = useMemo(
    () =>
      Object.entries(selection)
        .map(([slug, quantity]) => {
          const service = list.find((row) => row.slug === slug);
          if (!service) return null;
          return { service, quantity, total: Number(service.price) * quantity };
        })
        .filter((line): line is { service: ServiceRow; quantity: number; total: number } =>
          Boolean(line),
        ),
    [selection, list],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const taxAmount = Math.round(((subtotal * taxRate) / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  function toggle(service: ServiceRow) {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[service.slug]) delete next[service.slug];
      else next[service.slug] = 1;
      return next;
    });
  }

  function setQuantity(slug: string, quantity: number) {
    setSelection((prev) => ({ ...prev, [slug]: Math.max(1, Math.min(40, quantity)) }));
  }

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const result = await createServiceBooking({
        data: {
          items: lines.map((line) => ({ slug: line.service.slug, quantity: line.quantity })),
          full_name: String(form.get("full_name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? "") || undefined,
          street_address: String(form.get("street_address") ?? "") || undefined,
          city: String(form.get("city") ?? "") || undefined,
          province: String(form.get("province") ?? "") || undefined,
          postal_code: String(form.get("postal_code") ?? "") || undefined,
          service_date: String(form.get("service_date") ?? "") || undefined,
          service_time: String(form.get("service_time") ?? "") || undefined,
          delivery_instructions: String(form.get("delivery_instructions") ?? "") || undefined,
          notes: String(form.get("notes") ?? "") || undefined,
          pickup_location: String(form.get("pickup_location") ?? "") || undefined,
          delivery_address: String(form.get("delivery_address") ?? "") || undefined,
          appliance_count: Number(form.get("appliance_count") ?? 0) || undefined,
          appliance_type: String(form.get("appliance_type") ?? "") || undefined,
          appliance_brand: String(form.get("appliance_brand") ?? "") || undefined,
          appliance_model: String(form.get("appliance_model") ?? "") || undefined,
          remove_existing: form.get("remove_existing") === "on",
        },
      });
      setSelection({});
      setCheckoutOpen(false);
      setCartOpen(false);
      void navigate({ to: "/booking", search: { ref: result.booking_number } });
    } catch (error) {
      console.error(error);
      toast.error("We could not complete your booking. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    const { data, error } = await supabase.rpc("submit_quote", {
      _payload: {
        full_name: String(form.get("full_name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        pickup_address: String(form.get("pickup") ?? ""),
        destination_address: String(form.get("destination") ?? ""),
        moving_date: String(form.get("date") ?? ""),
        service_type: "Out-of-Town Appliance Delivery",
        shipment_details: `${String(form.get("appliance_type") ?? "")} — ${String(form.get("appliance_count") ?? "")} appliance(s)`,
        message: String(form.get("details") ?? ""),
      },
    });
    setSubmitting(false);
    if (error || !data) {
      toast.error("We could not send your quote request. Please try again or call us.");
      return;
    }
    setQuoteOpen(false);
    toast.success(
      `Thank you. Your quote request has been received. NexCore Express Ltd. will contact you with pricing. Reference ${data}.`,
    );
  }

  return (
    <section className="bg-nex-paper px-5 py-20 pb-28 sm:px-8 lg:py-28" id="book">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Book online</p>
        <h2 className="section-title uppercase">
          Appliance delivery, installation &amp; haul-away services
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-nex-muted">
          From your home to ours — we handle it all!
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_.55fr] lg:items-start">
          <div className="space-y-12">
            {grouped.map(([category, items]) => {
              const Icon = CATEGORY_ICONS[category] ?? Truck;
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 border-b border-nex-line pb-3">
                    <span className="grid size-10 place-items-center bg-nex-ink text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight">{category}</h3>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {items.map((service) => {
                      const selected = Boolean(selection[service.slug]);
                      const quantity = selection[service.slug] ?? 1;
                      return (
                        <article
                          key={service.id}
                          className={`flex flex-col border bg-white p-5 transition-shadow ${
                            selected
                              ? "border-nex-green shadow-[0_0_0_2px_var(--color-nex-green)]"
                              : "border-nex-line hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-extrabold leading-6">{service.name}</h4>
                            {selected ? (
                              <Check className="size-5 shrink-0 text-nex-green" aria-hidden="true" />
                            ) : null}
                          </div>
                          <p className="mt-2 flex-1 text-sm leading-6 text-nex-muted">
                            {service.description}
                          </p>
                          <p className="mt-4 text-2xl font-black text-nex-ink">
                            {service.requires_quote ? (
                              <span className="text-lg text-nex-orange">Call for Quote</span>
                            ) : (
                              <>
                                {service.pricing_rule === "per_floor" ||
                                service.pricing_rule === "per_flight"
                                  ? "+"
                                  : ""}
                                {money(Number(service.price))}
                                {service.unit_label ? (
                                  <span className="text-sm font-bold text-nex-muted">
                                    {" "}
                                    / {service.unit_label}
                                  </span>
                                ) : null}
                              </>
                            )}
                          </p>

                          {service.requires_quote ? (
                            <button
                              type="button"
                              onClick={() => setQuoteOpen(true)}
                              className="mt-4 bg-nex-orange px-4 py-3 text-sm font-extrabold uppercase text-white"
                            >
                              Request a quote
                            </button>
                          ) : (
                            <>
                              {selected && service.allow_quantity ? (
                                <div className="mt-4">
                                  <label className="field-label" htmlFor={`qty-${service.slug}`}>
                                    {service.pricing_rule === "per_floor"
                                      ? "Which floor?"
                                      : service.pricing_rule === "per_flight"
                                        ? "How many flights?"
                                        : `How many ${service.unit_label ?? "units"}?`}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      aria-label="Decrease quantity"
                                      onClick={() => setQuantity(service.slug, quantity - 1)}
                                      className="grid size-9 place-items-center border border-nex-line"
                                    >
                                      <Minus className="size-4" aria-hidden="true" />
                                    </button>
                                    <input
                                      id={`qty-${service.slug}`}
                                      type="number"
                                      min={1}
                                      max={40}
                                      value={
                                        service.pricing_rule === "per_floor"
                                          ? quantity + 2
                                          : quantity
                                      }
                                      onChange={(event) =>
                                        setQuantity(
                                          service.slug,
                                          service.pricing_rule === "per_floor"
                                            ? Number(event.target.value) - 2
                                            : Number(event.target.value),
                                        )
                                      }
                                      className="w-20 border border-nex-line px-3 py-2 text-center text-sm font-bold"
                                    />
                                    <button
                                      type="button"
                                      aria-label="Increase quantity"
                                      onClick={() => setQuantity(service.slug, quantity + 1)}
                                      className="grid size-9 place-items-center border border-nex-line"
                                    >
                                      <Plus className="size-4" aria-hidden="true" />
                                    </button>
                                    <span className="text-sm font-bold text-nex-green">
                                      {money(Number(service.price) * quantity)}
                                    </span>
                                  </div>
                                </div>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => toggle(service)}
                                className={`mt-4 px-4 py-3 text-sm font-extrabold uppercase ${
                                  selected
                                    ? "bg-nex-ink text-white"
                                    : "bg-nex-green text-white hover:bg-nex-ink"
                                }`}
                              >
                                {selected ? "Remove service" : "Select service"}
                              </button>
                            </>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="border border-nex-line bg-white p-6">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-nex-orange" aria-hidden="true" />
                <h3 className="text-lg font-black uppercase">Important information</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-nex-muted">
                {IMPORTANT_INFO.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 bg-nex-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <SelectionPanel
              lines={lines}
              subtotal={subtotal}
              taxRate={taxRate}
              taxAmount={taxAmount}
              total={total}
              onRemove={(slug) =>
                setSelection((prev) => {
                  const next = { ...prev };
                  delete next[slug];
                  return next;
                })
              }
              onCheckout={() => setCheckoutOpen(true)}
            />
          </aside>
        </div>
      </div>

      {lines.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-nex-line bg-nex-ink px-4 py-3 text-white lg:hidden">
          <span className="text-sm font-extrabold">
            {lines.length} SERVICE{lines.length > 1 ? "S" : ""} SELECTED | {money(total)}
          </span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-nex-orange px-4 py-3 text-xs font-extrabold uppercase"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            View &amp; checkout
          </button>
        </div>
      ) : null}

      {cartOpen ? (
        <Modal title="Your service selection" onClose={() => setCartOpen(false)}>
          <SelectionPanel
            lines={lines}
            subtotal={subtotal}
            taxRate={taxRate}
            taxAmount={taxAmount}
            total={total}
            onRemove={(slug) =>
              setSelection((prev) => {
                const next = { ...prev };
                delete next[slug];
                return next;
              })
            }
            onCheckout={() => {
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
          />
        </Modal>
      ) : null}

      {checkoutOpen ? (
        <Modal title="Complete your booking" onClose={() => setCheckoutOpen(false)}>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleBooking}>
            <Legend>Customer information</Legend>
            <Field name="full_name" label="Full name" required />
            <Field name="phone" label="Phone number" type="tel" required />
            <Field name="email" label="Email address" type="email" required full />

            <Legend>Service address</Legend>
            <Field name="street_address" label="Street address" required full />
            <Field name="city" label="City" required />
            <Field name="province" label="Province" required />
            <Field name="postal_code" label="Postal code" required />
            <Field name="service_date" label="Preferred service date" type="date" required />

            <Legend>Service details</Legend>
            <Field name="service_time" label="Preferred delivery/service time" placeholder="Morning, afternoon, 9am–12pm" />
            <Field name="appliance_count" label="Number of appliances" type="number" />
            <Field name="pickup_location" label="Pickup / store location" full />
            <Field name="delivery_address" label="Delivery address (if different)" full />
            <Field name="appliance_type" label="Appliance type" placeholder="Fridge, washer, range" />
            <Field name="appliance_brand" label="Brand" />
            <Field name="appliance_model" label="Model (optional)" />
            <div className="flex items-end gap-3 pb-2">
              <input
                id="remove_existing"
                name="remove_existing"
                type="checkbox"
                className="size-5 accent-nex-green"
              />
              <label htmlFor="remove_existing" className="text-sm font-bold">
                Existing appliance to be removed?
              </label>
            </div>
            <Field name="delivery_instructions" label="Delivery instructions" textarea full />
            <Field name="notes" label="Additional notes" textarea full />

            <div className="sm:col-span-2 border border-nex-line bg-nex-paper p-5">
              <h4 className="text-sm font-black uppercase">Order summary</h4>
              <ul className="mt-3 space-y-1 text-sm">
                {lines.map((line) => (
                  <li key={line.service.slug} className="flex justify-between gap-4">
                    <span>
                      {line.service.name} {quantityLabel(line.service, line.quantity)}
                    </span>
                    <span className="font-bold">{money(line.total)}</span>
                  </li>
                ))}
              </ul>
              <Totals subtotal={subtotal} taxRate={taxRate} taxAmount={taxAmount} total={total} />
            </div>

            <button
              type="submit"
              disabled={submitting || lines.length === 0}
              className="bg-nex-orange px-5 py-4 font-extrabold uppercase text-white disabled:opacity-60 sm:col-span-2"
            >
              {submitting ? "Confirming…" : "Confirm booking"}
              <ArrowRight className="ml-2 inline size-4" aria-hidden="true" />
            </button>
          </form>
        </Modal>
      ) : null}

      {quoteOpen ? (
        <Modal title="Request a quote — out-of-town delivery" onClose={() => setQuoteOpen(false)}>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleQuote}>
            <Field name="full_name" label="Name" required />
            <Field name="phone" label="Phone" type="tel" required />
            <Field name="email" label="Email" type="email" required full />
            <Field name="pickup" label="Pickup location" required full />
            <Field name="destination" label="Delivery location" required full />
            <Field name="appliance_type" label="Appliance type" required />
            <Field name="appliance_count" label="Number of appliances" type="number" required />
            <Field name="date" label="Preferred date" type="date" />
            <Field name="details" label="Additional details" textarea full />
            <button
              type="submit"
              disabled={submitting}
              className="bg-nex-green px-5 py-4 font-extrabold uppercase text-white disabled:opacity-60 sm:col-span-2"
            >
              {submitting ? "Sending…" : "Submit quote request"}
            </button>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}

function Totals({
  subtotal,
  taxRate,
  taxAmount,
  total,
}: {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}) {
  return (
    <dl className="mt-4 space-y-1 border-t border-nex-line pt-3 text-sm">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd className="font-bold">{money(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>HST ({taxRate}%)</dt>
        <dd className="font-bold">{money(taxAmount)}</dd>
      </div>
      <div className="flex justify-between border-t border-nex-line pt-2 text-lg font-black">
        <dt>TOTAL</dt>
        <dd>{money(total)}</dd>
      </div>
    </dl>
  );
}

function SelectionPanel({
  lines,
  subtotal,
  taxRate,
  taxAmount,
  total,
  onRemove,
  onCheckout,
}: {
  lines: { service: ServiceRow; quantity: number; total: number }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  onRemove: (slug: string) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="border border-nex-line bg-white p-6">
      <h3 className="text-sm font-black uppercase tracking-widest">Your service selection</h3>
      {lines.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-nex-muted">
          No services selected yet. Choose the services you need and your price appears here
          instantly.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li key={line.service.slug} className="flex items-start justify-between gap-3 text-sm">
                <span>
                  {line.service.name}{" "}
                  <span className="text-nex-muted">{quantityLabel(line.service, line.quantity)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <strong>{money(line.total)}</strong>
                  <button
                    type="button"
                    aria-label={`Remove ${line.service.name}`}
                    onClick={() => onRemove(line.service.slug)}
                    className="text-nex-muted hover:text-nex-orange"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <Totals subtotal={subtotal} taxRate={taxRate} taxAmount={taxAmount} total={total} />
          <button
            type="button"
            onClick={onCheckout}
            className="mt-5 w-full bg-nex-orange px-5 py-4 text-sm font-extrabold uppercase text-white"
          >
            Continue to book
          </button>
        </>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
      <div className="w-full max-w-3xl border border-nex-line bg-white">
        <div className="flex items-center justify-between border-b border-nex-line px-6 py-4">
          <h3 className="text-lg font-black uppercase">{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="sm:col-span-2 border-b border-nex-line pb-2 text-sm font-black uppercase tracking-widest">
      {children}
    </h4>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  full = false,
  textarea = false,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="field-label" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      {textarea ? (
        <textarea
          className="field min-h-24"
          id={name}
          name={name}
          required={required}
          placeholder={placeholder ?? ""}
        />
      ) : (
        <input
          className="field"
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder ?? ""}
        />
      )}
    </div>
  );
}
