import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import { servicesQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/services/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: () => ({
    meta: [
      { title: "Moving & Logistics Services | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Residential moving, commercial relocation, packing, storage, specialty handling and cross-border freight across Canada and the USA.",
      },
      { property: "og:title", content: "Our Services | NexCore Express" },
      {
        property: "og:description",
        content: "Six service divisions covering every kind of move across Canada and the USA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <PageShell>
      <PageHero
        eyebrow="02 / Our services"
        title="Every kind of move, one operator."
        intro="Six divisions, one dispatch team and one reference number from first quote to final delivery."
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group border border-nex-line bg-white p-7 transition-colors hover:border-nex-green"
            >
              <p className="text-sm font-black text-nex-green">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 text-2xl font-black">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-nex-muted">{service.short_description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-nex-ink">
                View service
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="section-title text-white">Not sure which service you need?</h2>
            <p className="mt-3 text-white/70">
              Send us the details and a coordinator will tell you exactly what the job requires.
            </p>
          </div>
          <Link to="/quote" className="bg-nex-lime px-7 py-4 font-extrabold text-nex-ink">
            Get a quote
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
