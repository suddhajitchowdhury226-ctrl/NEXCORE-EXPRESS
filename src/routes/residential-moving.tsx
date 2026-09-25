import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import hero from "@/assets/nexcore-hero-2.jpg";

export const Route = createFileRoute("/residential-moving")({
  head: () => ({
    meta: [
      { title: "Residential Moving | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Apartment, condo and house moves across Canada and the USA. Trained movers, protected handling, transparent pricing and live tracking on every job.",
      },
      { property: "og:title", content: "Residential Moving | NexCore Express" },
      {
        property: "og:description",
        content: "Home moves handled carefully, priced clearly and tracked live.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResidentialPage,
});

const INCLUDED = [
  "Two to six trained movers depending on property size",
  "Furniture disassembly and reassembly",
  "Blankets, shrink wrap, floor and door protection",
  "Loading, transport and careful placement at destination",
  "Inventory list and condition check",
  "Live tracking from pickup to delivery",
];

const PROPERTIES = [
  { label: "Studio / 1-bed", crew: "2 movers", time: "3–5 hours" },
  { label: "2-bed apartment", crew: "3 movers", time: "5–7 hours" },
  { label: "3-bed house", crew: "4 movers", time: "7–9 hours" },
  { label: "Detached / 4-bed+", crew: "5–6 movers", time: "Full day" },
];

function ResidentialPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Residential"
        title="Home moves without the stress."
        intro="Studios to detached family homes. We pack, protect, load and place — and you can watch the whole thing move on your tracking page."
      >
        <Link
          to="/quote"
          search={{ service: "Residential Moving" }}
          className="mt-9 inline-block bg-nex-orange px-7 py-4 font-extrabold text-white"
        >
          Quote my home move
        </Link>
      </PageHero>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={hero}
            alt="NexCore Express movers carrying protected furniture into a home"
            className="w-full object-cover"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">What's included</p>
            <h2 className="section-title">Everything on your quote, nothing extra on the day.</h2>
            <ul className="mt-8 grid gap-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                  <span className="leading-7 text-nex-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <p className="eyebrow">Typical jobs</p>
        <h2 className="section-title">What your property usually needs.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-nex-muted">
          These are typical crew sizes and durations. Your written quote confirms the exact figures
          after we review access, stairs and volume.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROPERTIES.map((property) => (
            <div key={property.label} className="border-t-2 border-nex-lime bg-white p-6">
              <h3 className="text-lg font-black">{property.label}</h3>
              <p className="mt-4 text-sm text-nex-muted">Crew: {property.crew}</p>
              <p className="mt-1 text-sm text-nex-muted">Typical time: {property.time}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
