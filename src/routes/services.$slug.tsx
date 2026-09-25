import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import { servicesQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} | NexCore Express Ltd.` },
        {
          name: "description",
          content: `${title} from NexCore Express — trained crews, protected handling and live tracking across Canada and the USA.`,
        },
        { property: "og:title", content: `${title} | NexCore Express` },
        {
          property: "og:description",
          content: `${title} across Canada and the USA with live shipment tracking.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: services } = useSuspenseQuery(servicesQuery);
  const service = services.find((item) => item.slug === slug);

  if (!service) throw notFound();

  return (
    <PageShell>
      <PageHero
        eyebrow="Service"
        title={service.title}
        intro={service.short_description ?? undefined}
      >
        <Link
          to="/quote"
          search={{ service: service.title }}
          className="mt-9 inline-block bg-nex-orange px-7 py-4 font-extrabold text-white"
        >
          Get a quote for this service
        </Link>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <p className="eyebrow">What's included</p>
            <h2 className="section-title">How we run this service.</h2>
            <p className="mt-6 whitespace-pre-line leading-8 text-nex-muted">
              {service.long_description ?? service.short_description}
            </p>
          </div>
          <aside className="border border-nex-line bg-nex-paper p-7">
            <p className="footer-heading text-nex-ink">Included as standard</p>
            <ul className="mt-6 grid gap-4 text-sm">
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                <span className="text-nex-muted">Trained, background-checked crew</span>
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                <span className="text-nex-muted">Protective wrapping and floor protection</span>
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                <span className="text-nex-muted">Live tracking reference for every job</span>
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-nex-green" aria-hidden="true" />
                <span className="text-nex-muted">Written pricing confirmed before booking</span>
              </li>
            </ul>
            {service.base_price ? (
              <p className="mt-8 border-t border-nex-line pt-6 text-sm text-nex-muted">
                From{" "}
                <strong className="text-2xl text-nex-ink">
                  ${Number(service.base_price).toFixed(0)}
                </strong>
              </p>
            ) : null}
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <p className="eyebrow">Other services</p>
        <h2 className="section-title">Keep exploring.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((item) => item.slug !== slug)
            .slice(0, 3)
            .map((item) => (
              <Link
                key={item.id}
                to="/services/$slug"
                params={{ slug: item.slug }}
                className="border border-nex-line bg-white p-6 transition-colors hover:border-nex-green"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-nex-muted">{item.short_description}</p>
              </Link>
            ))}
        </div>
      </Section>
    </PageShell>
  );
}
