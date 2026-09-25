import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import { serviceAreasQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/service-areas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(serviceAreasQuery),
  head: () => ({
    meta: [
      { title: "Service Areas | NexCore Express Moving Across Canada & USA" },
      {
        name: "description",
        content:
          "Check whether NexCore Express covers your city. We move households and businesses across Ontario, Quebec, Alberta, British Columbia and into the USA.",
      },
      { property: "og:title", content: "Service Areas | NexCore Express" },
      {
        property: "og:description",
        content: "Search your city and confirm coverage for local, long-haul and cross-border moves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServiceAreasPage,
});

function ServiceAreasPage() {
  const { data: areas } = useSuspenseQuery(serviceAreasQuery);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return areas;
    return areas.filter((area) =>
      [area.name, area.province, area.country, area.postal_prefixes?.join(" ")]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [areas, query]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Coverage"
        title="Where we move."
        intro="Search your city to confirm coverage. If your route is not listed, we can still quote it — long-haul and cross-border lanes are arranged on request."
      >
        <div className="mt-9 flex max-w-xl items-center gap-2 bg-white px-4">
          <Search className="size-4 text-nex-muted" aria-hidden="true" />
          <label className="sr-only" htmlFor="area-search">
            Search service areas
          </label>
          <input
            id="area-search"
            className="w-full bg-transparent py-4 text-nex-ink outline-none"
            placeholder="Search city or province"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </PageHero>

      <Section tone="paper">
        {filtered.length === 0 ? (
          <div className="border border-nex-line bg-white p-8">
            <h2 className="text-2xl font-black">No listed coverage for “{query}”.</h2>
            <p className="mt-3 leading-7 text-nex-muted">
              We regularly quote routes outside our published areas. Send us the pickup and
              destination and we will confirm.
            </p>
            <Link
              to="/quote"
              className="mt-6 inline-block bg-nex-orange px-6 py-4 font-extrabold text-white"
            >
              Request a quote
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((area) => (
              <div key={area.id} className="border-t-2 border-nex-lime bg-white p-6">
                <MapPin className="size-5 text-nex-green" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black">{area.name}</h2>
                <p className="mt-1 text-sm text-nex-muted">
                  {area.province ? `${area.province}, ` : ""}
                  {area.country}
                </p>
                {area.notes ? (
                  <p className="mt-4 text-sm leading-7 text-nex-muted">{area.notes}</p>
                ) : null}
                <Link
                  to="/quote"
                  search={{ pickup: [area.name, area.province].filter(Boolean).join(", ") }}
                  className="mt-6 inline-block text-sm font-extrabold text-nex-ink underline underline-offset-4"
                >
                  Quote from {area.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
