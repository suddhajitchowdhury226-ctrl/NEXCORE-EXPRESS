import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import hero from "@/assets/nexcore-hero-3.jpg";

export const Route = createFileRoute("/commercial-moving")({
  head: () => ({
    meta: [
      { title: "Commercial & Office Moving | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Office, retail and warehouse relocations planned around your operating hours. Asset tagging, IT handling, phased moves and dedicated project coordination.",
      },
      { property: "og:title", content: "Commercial Moving | NexCore Express" },
      {
        property: "og:description",
        content: "Office, retail and warehouse relocations with minimal downtime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommercialPage,
});

const INCLUDED = [
  "Site survey and phased relocation plan",
  "Out-of-hours and weekend scheduling",
  "Asset tagging and departmental labelling",
  "IT, server and workstation handling",
  "Furniture dismantling, transport and reinstallation",
  "Certificates of insurance and building compliance documents",
];

const SECTORS = [
  { title: "Offices", body: "Desks, meeting rooms, storage and IT relocated in a single window." },
  { title: "Retail", body: "Fixtures, stock and point-of-sale moved overnight to protect trading hours." },
  { title: "Warehouse & industrial", body: "Racking, pallets and equipment relocated with the right vehicles and lifting gear." },
  { title: "Healthcare & labs", body: "Sensitive equipment handled with controlled transport and documented chain of custody." },
];

function CommercialPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Commercial"
        title="Relocate without losing a trading day."
        intro="Offices, retail units, warehouses and specialist facilities — planned around your operating hours and coordinated by a named project lead."
      >
        <Link
          to="/quote"
          search={{ service: "Commercial Moving" }}
          className="mt-9 inline-block bg-nex-orange px-7 py-4 font-extrabold text-white"
        >
          Request a commercial quote
        </Link>
      </PageHero>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Scope of work</p>
            <h2 className="section-title">Planned, documented, signed off.</h2>
            <ul className="mt-8 grid gap-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                  <span className="leading-7 text-nex-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src={hero}
            alt="NexCore Express crew loading commercial equipment into a truck"
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
      </Section>

      <Section tone="paper">
        <p className="eyebrow">Sectors</p>
        <h2 className="section-title">Who we relocate.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((sector) => (
            <div key={sector.title} className="border-t-2 border-nex-lime bg-white p-6">
              <h3 className="text-xl font-black">{sector.title}</h3>
              <p className="mt-3 text-sm leading-7 text-nex-muted">{sector.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
