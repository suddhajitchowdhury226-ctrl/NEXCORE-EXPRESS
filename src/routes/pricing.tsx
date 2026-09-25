import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Wrench,
  RecycleIcon,
  WashingMachine,
  AlertCircle,
  CheckCircle2,
  Phone,
} from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Transparent appliance delivery, installation and haul-away pricing. Delivery, kitchen appliances, special services, removal, washer/dryer and more.",
      },
      { property: "og:title", content: "Pricing | NexCore Express" },
      { property: "og:description", content: "Clear, upfront appliance delivery and installation pricing from NexCore Express Ltd." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

/* ─── Data ───────────────────────────────────────────────────────────────── */

const DELIVERY = [
  { service: "Local Appliance Delivery (1 appliance)", price: "$109" },
  { service: "Local Appliance Delivery (2 appliances)", price: "$159" },
  { service: "Additional Appliance", price: "$49" },
  { service: "Out-of-Town Delivery", price: "Call for Quote" },
  { service: "Same-Day Delivery", price: "+$85" },
  { service: "Next-Day Delivery", price: "+$65" },
];

const KITCHEN = [
  { service: "Dishwasher Installation", price: "$279" },
  { service: "Refrigerator Water Line Connection", price: "$95" },
  { service: "Fridge Door Removal & Reinstall", price: "$69" },
  { service: "Door Swing Reversal", price: "$89" },
  { service: "House Door Removal & Reinstall", price: "$89" },
  { service: "Stove / Range Installation (Electric)", price: "$179" },
  { service: "Over-the-Range Microwave Installation", price: "$229" },
];

const SPECIAL = [
  { service: "Extra Man (Heavy Items Over 350 lbs)", price: "$195" },
  { service: "3-Man Delivery Team", price: "$295" },
  { service: "Basement Delivery", price: "+$75" },
  { service: "Third Floor & Above (No Elevator)", price: "+$75 per floor" },
  { service: "Stair Carry (Per Flight)", price: "+$35" },
  { service: "Specific Delivery Window", price: "+$95" },
];

const REMOVAL = [
  { service: "Appliance Disposal / Haul Away", price: "$55" },
  { service: "Disconnect Existing Appliance", price: "$45" },
  { service: "Relocate Appliance Within Home", price: "$55" },
];

const WASHER_DRYER = [
  { service: "Washer Installation", price: "$119" },
  { service: "Dryer Installation (Electric)", price: "$119" },
  { service: "Washer & Dryer Pair Installation", price: "$199" },
  { service: "Stackable Washer/Dryer Installation", price: "$279" },
  { service: "LG WashTower Installation", price: "$279" },
  { service: "Pedestal Installation", price: "$59" },
  { service: "Unstack Washer/Dryer", price: "$79" },
];

const NOTES = [
  "All deliveries include basic placement of the appliance.",
  "Installation materials are extra unless otherwise specified.",
  "Customer must ensure access paths are clear before delivery.",
  "Elevator bookings are the customer's responsibility.",
  "Appliances over 350 lbs may require additional manpower.",
  "HST is extra on all services.",
  "E-Transfer, Visa, Mastercard and Debit accepted.",
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

type TableColor = "blue" | "orange" | "green";

interface PriceTableProps {
  icon: React.ElementType;
  title: string;
  rows: { service: string; price: string }[];
  color?: TableColor;
}

function PriceTable({ icon: Icon, title, rows, color = "blue" }: PriceTableProps) {
  const headerBg =
    color === "orange"
      ? "bg-nex-orange"
      : color === "green"
        ? "bg-nex-green"
        : "bg-[#1e4d7b]";

  return (
    <div className="overflow-hidden border border-nex-line bg-white shadow-sm">
      {/* Header */}
      <div className={`${headerBg} flex items-center gap-3 px-5 py-4`}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Icon className="size-5 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-base font-black uppercase tracking-wide text-white">{title}</h3>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-nex-paper">
            <th className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-nex-muted">
              Service
            </th>
            <th className="px-5 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-nex-muted">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-nex-line">
          {rows.map((row) => (
            <tr key={row.service} className="transition-colors hover:bg-nex-paper/60">
              <td className="px-5 py-3.5 text-nex-ink">{row.service}</td>
              <td className="px-5 py-3.5 text-right font-extrabold text-nex-green">
                {row.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

function PricingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Transparent pricing"
        title="Appliance Delivery, Installation & Haul-Away"
        intro="From your home to ours — we handle it all. Clear prices, no hidden fees, HST extra."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/quote" className="bg-nex-orange px-7 py-4 font-extrabold text-white">
            Get a Quote
          </Link>
          <Link
            to="/booking"
            className="border border-white/40 px-7 py-4 font-extrabold text-white hover:bg-white/10"
          >
            Book a Service
          </Link>
        </div>
      </PageHero>

      {/* Feature badges */}
      <Section tone="paper">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Truck, label: "Local & Out-of-Town Delivery" },
            { icon: Wrench, label: "Professional Installation" },
            { icon: RecycleIcon, label: "Appliance Disposal & Haul-Away" },
            { icon: CheckCircle2, label: "Safe & Secure Service" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 border border-nex-line bg-white p-5 text-center"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-nex-green">
                <Icon className="size-6 text-white" aria-hidden="true" />
              </div>
              <p className="text-xs font-black uppercase leading-snug tracking-wide text-nex-ink">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Price tables — 2-col grid */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <PriceTable
              icon={Truck}
              title="Delivery Services"
              rows={DELIVERY}
              color="blue"
            />
            <PriceTable
              icon={Wrench}
              title="Kitchen Appliances"
              rows={KITCHEN}
              color="blue"
            />
            <PriceTable
              icon={CheckCircle2}
              title="Special Services"
              rows={SPECIAL}
              color="blue"
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8">
            <PriceTable
              icon={RecycleIcon}
              title="Removal & Disposal"
              rows={REMOVAL}
              color="green"
            />
            <PriceTable
              icon={WashingMachine}
              title="Washer & Dryer Services"
              rows={WASHER_DRYER}
              color="orange"
            />

            {/* Important Information card */}
            <div className="overflow-hidden border border-nex-line bg-white shadow-sm">
              <div className="flex items-center gap-3 bg-[#1e4d7b] px-5 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <AlertCircle className="size-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-base font-black uppercase tracking-wide text-white">
                  Important Information
                </h3>
              </div>
              <ul className="divide-y divide-nex-line">
                {NOTES.map((note) => (
                  <li key={note} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="mt-0.5 size-2 shrink-0 rounded-full bg-nex-green" />
                    <span className="text-sm text-nex-ink">{note}</span>
                  </li>
                ))}
              </ul>

              {/* Payment logos */}
              <div className="flex flex-wrap items-center gap-3 border-t border-nex-line bg-nex-paper px-5 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-nex-muted">
                  We accept:
                </span>
                {["Interac", "Visa", "Mastercard", "Debit"].map((method) => (
                  <span
                    key={method}
                    className="rounded border border-nex-line bg-white px-3 py-1.5 text-xs font-extrabold text-nex-ink shadow-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA strip */}
      <Section tone="ink">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-white lg:text-4xl">
              Ready to book your delivery?
            </h2>
            <p className="mt-3 text-white/70">
              Call us or submit a quote request and we'll confirm your slot same day.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+12896457777"
              className="inline-flex items-center gap-2 bg-nex-lime px-7 py-4 font-extrabold text-nex-ink"
            >
              <Phone className="size-4" aria-hidden="true" />
              (289) 645-7777
            </a>
            <Link to="/quote" className="bg-nex-orange px-7 py-4 font-extrabold text-white">
              Get a Quote
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
