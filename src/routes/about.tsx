import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Globe2, ShieldCheck, Users } from "lucide-react";

import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import fleet from "@/assets/nexcore-fleet.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NexCore Express | Canadian Moving & Logistics" },
      {
        name: "description",
        content:
          "NexCore Express Ltd. is a Canadian-owned moving and logistics company serving Canada and the USA with vetted crews, live tracking and transparent pricing.",
      },
      { property: "og:title", content: "About NexCore Express Ltd." },
      {
        property: "og:description",
        content: "Canadian-owned moving and logistics, built on trained crews and real technology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Care for your things",
    body: "Padded protection, floor runners and inventory checks on every job. Full-value coverage available on request.",
  },
  {
    icon: Users,
    title: "Trained, vetted crews",
    body: "Background-checked movers who are trained on handling, loading and customer service — not day labour.",
  },
  {
    icon: Globe2,
    title: "Canada & USA reach",
    body: "Local moves, long-haul relocations and cross-border freight coordinated by one team from one reference.",
  },
  {
    icon: Building2,
    title: "Business-ready",
    body: "Office and warehouse relocations planned out-of-hours to keep your operation running.",
  },
];

const MILESTONES = [
  { year: "2015", body: "NexCore Express founded in Toronto with two trucks and a local crew." },
  { year: "2018", body: "Long-haul division opens, connecting Ontario, Quebec and the Maritimes." },
  { year: "2021", body: "Cross-border freight lanes added between Canada and the northern USA." },
  { year: "2023", body: "In-house tracking platform launched for customers and dispatch." },
  { year: "2025", body: "Over 20,000 completed moves across Canada and the USA." },
];

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About us"
        title="Moving what matters, since 2015."
        intro="NexCore Express Ltd. is a Canadian-owned moving and logistics company. We combine trained crews with our own tracking technology so every customer knows exactly where their move stands."
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={fleet}
            alt="NexCore Express moving trucks lined up at a depot"
            className="w-full object-cover"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="section-title">A logistics company that answers the phone.</h2>
            <p className="mt-5 leading-8 text-nex-muted">
              We started with two trucks and a simple promise: turn up on time, handle everything
              carefully and tell the truth about pricing. Ten years later the fleet is larger and the
              routes are longer, but the promise has not changed.
            </p>
            <p className="mt-4 leading-8 text-nex-muted">
              Today we handle residential moves, commercial relocations, packing, storage, specialty
              handling and cross-border freight — all coordinated in-house, all trackable from a single
              reference number.
            </p>
            <Link
              to="/quote"
              className="mt-8 inline-block bg-nex-orange px-6 py-4 font-extrabold text-white"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <p className="eyebrow">What we stand for</p>
        <h2 className="section-title">Four things we refuse to compromise on.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value.title} className="border-t-2 border-nex-lime bg-white p-6">
              <value.icon className="size-6 text-nex-green" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-black">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-nex-muted">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <p className="eyebrow text-nex-lime">Our story</p>
        <h2 className="section-title text-white">Ten years on the road.</h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {MILESTONES.map((milestone) => (
            <li key={milestone.year} className="border-t-2 border-nex-lime pt-5">
              <p className="text-3xl font-black text-nex-lime">{milestone.year}</p>
              <p className="mt-3 text-sm leading-7 text-white/70">{milestone.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </PageShell>
  );
}
