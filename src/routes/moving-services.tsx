import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Home, Building2, Warehouse, PackageCheck, Truck } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";

export const Route = createFileRoute("/moving-services")({
  head: () => ({
    meta: [
      { title: "Moving Services | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Local, long-distance and cross-border moving services for homes and businesses — packing, loading, transport, storage and unpacking handled by one crew.",
      },
      { property: "og:title", content: "Moving Services | NexCore Express" },
      {
        property: "og:description",
        content: "Local, long-distance and cross-border moves for homes and businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MovingServicesPage,
});

const STEPS = [
  { title: "1. Survey & quote", body: "We assess volume, access and timing, then send written pricing with no hidden extras." },
  { title: "2. Plan & book", body: "Your date is locked in, crew size and vehicle are assigned, and a reference number is issued." },
  { title: "3. Pack & protect", body: "Materials, padding and inventory checks before anything leaves the property." },
  { title: "4. Transport & track", body: "Follow progress live from pickup to delivery using your reference number." },
  { title: "5. Deliver & place", body: "Items placed where you want them, boxes unpacked on request, debris removed." },
];

const TYPES = [
  { icon: Home, title: "Residential moving", body: "Apartments, condos and family homes across town or across provinces.", to: "/residential-moving" as const },
  { icon: Building2, title: "Commercial moving", body: "Offices, retail units and warehouses relocated out-of-hours.", to: "/commercial-moving" as const },
  { icon: Truck, title: "Long-distance", body: "Province-to-province and cross-border relocations on scheduled lanes.", to: "/services" as const },
  { icon: Boxes, title: "Packing & materials", body: "Full or partial packing with proper cartons, wrap and labelling.", to: "/services" as const },
  { icon: Warehouse, title: "Storage", body: "Short and long-term secure storage between move dates.", to: "/services" as const },
  { icon: PackageCheck, title: "Specialty handling", body: "Pianos, safes, artwork, lab and IT equipment.", to: "/services" as const },
];

function MovingServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Moving services"
        title="One crew, start to finish."
        intro="From a single-room apartment to a multi-floor warehouse relocation — planned, packed, transported and tracked by the same team."
      >
        <Link
          to="/quote"
          className="mt-9 inline-block bg-nex-orange px-7 py-4 font-extrabold text-white"
        >
          Get a moving quote
        </Link>
      </PageHero>

      <Section>
        <p className="eyebrow">Move types</p>
        <h2 className="section-title">Pick the move that fits.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((type) => (
            <Link
              key={type.title}
              to={type.to}
              className="border border-nex-line bg-white p-7 transition-colors hover:border-nex-green"
            >
              <type.icon className="size-6 text-nex-green" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-black">{type.title}</h3>
              <p className="mt-3 text-sm leading-7 text-nex-muted">{type.body}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <p className="eyebrow">How it works</p>
        <h2 className="section-title">Five steps, no surprises.</h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.title} className="border-t-2 border-nex-lime bg-white p-6">
              <h3 className="text-lg font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-nex-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </PageShell>
  );
}
