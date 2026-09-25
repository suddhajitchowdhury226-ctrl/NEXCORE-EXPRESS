import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { PageHero, PageShell } from "@/components/site/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { sendNotification } from "@/lib/notifications.functions";

type QuoteSearch = {
  pickup?: string;
  destination?: string;
  property?: string;
  service?: string;
  date?: string;
};

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>): QuoteSearch => {
    const parsed: QuoteSearch = {};
    for (const key of ["pickup", "destination", "property", "service", "date"] as const) {
      const value = search[key];
      if (typeof value === "string" && value.length > 0) parsed[key] = value;
    }
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Get a Moving Quote | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Request a written moving or freight quote from NexCore Express. Tell us your pickup, destination, dates and requirements and a coordinator replies with pricing.",
      },
      { property: "og:title", content: "Get a Moving Quote | NexCore Express" },
      {
        property: "og:description",
        content: "Request written pricing for residential, commercial and cross-border moves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});

const SERVICE_TYPES = [
  "Residential Moving",
  "Commercial Moving",
  "Office Relocation",
  "Packing",
  "Storage",
  "Specialty",
  "Cross-border freight",
];

function QuotePage() {
  const search = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);

    const payload = {
      full_name: String(form.get("full_name")),
      company_name: String(form.get("company_name") || "") || null,
      email: String(form.get("email")),
      phone: String(form.get("phone") || "") || null,
      pickup_address: String(form.get("pickup_address")),
      pickup_city: String(form.get("pickup_city") || "") || null,
      destination_address: String(form.get("destination_address")),
      destination_city: String(form.get("destination_city") || "") || null,
      moving_date: String(form.get("moving_date") || "") || null,
      service_type: String(form.get("service_type")),
      property_type: String(form.get("property_type") || "") || null,
      property_details: String(form.get("property_details") || "") || null,
      shipment_details: String(form.get("shipment_details") || "") || null,
      additional_requirements: String(form.get("additional_requirements") || "") || null,
      message: String(form.get("message") || "") || null,
    };

    const { data, error } = await supabase.rpc("submit_quote", { _payload: payload });
    setSubmitting(false);

    if (error || !data) {
      toast.error("We could not send your request. Please try again or call us.");
      return;
    }

    setReference(data);
    toast.success("Quote request received.");
    void sendNotification({
      data: {
        type: "quote_request",
        subject: `New quote request ${data}`,
        body: `New quote request ${data} from ${payload.full_name} (${payload.email}).\nPickup: ${payload.pickup_address}\nDestination: ${payload.destination_address}\nService: ${payload.service_type}\nDate: ${payload.moving_date ?? "not set"}`,
      },
    }).catch(() => undefined);
  }

  if (reference) {
    return (
      <PageShell>
        <PageHero eyebrow="01 / Instant pricing" title="Your quote request is in." />
        <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl border border-nex-line bg-nex-paper p-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-nex-green" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-black">Reference {reference}</h2>
            <p className="mt-4 leading-7 text-nex-muted">
              A move coordinator has your request and will reply by email with written pricing. Keep
              this reference for your records.
            </p>
            <a href="/" className="mt-8 inline-block bg-nex-orange px-6 py-4 font-extrabold text-white">
              Back to home
            </a>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="01 / Instant pricing"
        title="Get a quote."
        intro="Tell us the essentials and a move coordinator replies with written pricing. Every request is logged against a reference number."
      />

      <section className="bg-nex-paper px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl border border-nex-line bg-white p-6 sm:p-10">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="full_name">
                Customer name *
              </label>
              <input className="field" id="full_name" name="full_name" required />
            </div>
            <div>
              <label className="field-label" htmlFor="company_name">
                Company name
              </label>
              <input className="field" id="company_name" name="company_name" />
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                Email *
              </label>
              <input className="field" id="email" name="email" type="email" required />
            </div>
            <div>
              <label className="field-label" htmlFor="phone">
                Phone
              </label>
              <input className="field" id="phone" name="phone" type="tel" />
            </div>
            <div>
              <label className="field-label" htmlFor="pickup_address">
                Pickup address *
              </label>
              <input
                className="field"
                id="pickup_address"
                name="pickup_address"
                defaultValue={search.pickup ?? ""}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="destination_address">
                Destination address *
              </label>
              <input
                className="field"
                id="destination_address"
                name="destination_address"
                defaultValue={search.destination ?? ""}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pickup_city">
                Pickup city
              </label>
              <input className="field" id="pickup_city" name="pickup_city" />
            </div>
            <div>
              <label className="field-label" htmlFor="destination_city">
                Destination city
              </label>
              <input className="field" id="destination_city" name="destination_city" />
            </div>
            <div>
              <label className="field-label" htmlFor="moving_date">
                Moving date
              </label>
              <input
                className="field"
                id="moving_date"
                name="moving_date"
                type="date"
                defaultValue={search.date ?? ""}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="service_type">
                Service required *
              </label>
              <select
                className="field"
                id="service_type"
                name="service_type"
                defaultValue={search.service ?? ""}
                required
              >
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="property_type">
                Property / business type
              </label>
              <select
                className="field"
                id="property_type"
                name="property_type"
                defaultValue={search.property ?? ""}
              >
                <option value="">Select property type</option>
                <option>Studio</option>
                <option>1-Bed</option>
                <option>2-Bed</option>
                <option>3-Bed</option>
                <option>Detached House</option>
                <option>Office</option>
                <option>Retail</option>
                <option>Warehouse</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="property_details">
                Property / business information
              </label>
              <input
                className="field"
                id="property_details"
                name="property_details"
                placeholder="Floors, lift access, parking"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="shipment_details">
                Shipment details
              </label>
              <textarea
                className="field min-h-28"
                id="shipment_details"
                name="shipment_details"
                placeholder="Rooms, large items, approximate volume or weight"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="additional_requirements">
                Additional requirements
              </label>
              <textarea
                className="field min-h-24"
                id="additional_requirements"
                name="additional_requirements"
                placeholder="Packing, storage, insurance, specialty handling"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="message">
                Your message
              </label>
              <textarea className="field min-h-24" id="message" name="message" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-nex-orange px-5 py-4 font-extrabold text-white disabled:opacity-60 sm:col-span-2"
            >
              {submitting ? "Sending…" : "Submit quote request"}
              <ArrowRight className="ml-2 inline size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
