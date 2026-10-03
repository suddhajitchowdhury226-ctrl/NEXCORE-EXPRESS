import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, RecycleIcon, ShieldCheck, Truck, Wrench } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import { PricingCards } from "@/components/site/pricing-cards";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Transparent appliance delivery, installation and haul-away pricing. Search all services and pay securely online.",
      },
      { property: "og:title", content: "Pricing | NexCore Express" },
      { property: "og:description", content: "Clear, upfront pricing from NexCore Express Ltd. Pay online in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <PageShell>
      {/* Hero */}
      <PageHero
        eyebrow="Transparent pricing"
        title="Appliance Delivery, Installation & Haul-Away"
        intro="Search any service, see the exact price, and pay securely online — no phone calls needed. HST extra."
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
            { icon: Truck,       label: "Local & Out-of-Town Delivery" },
            { icon: Wrench,      label: "Professional Installation" },
            { icon: RecycleIcon, label: "Appliance Disposal & Haul-Away" },
            { icon: ShieldCheck, label: "Safe & Secure Service" },
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

      {/* Searchable service cards */}
      <Section>
        <PricingCards />
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
