import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Earth,
  Headphones,
  MapPin,
  PackageCheck,
  Quote as QuoteIcon,
  ShieldCheck,
  ThumbsUp,
  Truck,
  Users,
  Weight,
  Zap,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import heroFleet from "@/assets/nexcore-fleet.png";
import hero2 from "@/assets/nexcore-hero-2.jpg";
import hero3 from "@/assets/nexcore-hero-3.jpg";
import svcResidential from "@/assets/svc-residential.jpg";
import svcCommercial from "@/assets/svc-commercial.jpg";
import svcOffice from "@/assets/svc-office.jpg";
import svcPacking from "@/assets/svc-packing.jpg";
import svcStorage from "@/assets/svc-storage.jpg";
import svcSpecialty from "@/assets/svc-specialty.jpg";
import { PageShell } from "@/components/site/page-shell";
import { servicesQuery } from "@/lib/site-queries";

const SERVICE_IMAGES: Record<string, string> = {
  "residential-moving": svcResidential,
  "commercial-moving": svcCommercial,
  "office-relocation": svcOffice,
  "packing-services": svcPacking,
  "storage-solutions": svcStorage,
  "specialty-moving": svcSpecialty,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexCore Express Ltd. | Moving What Matters Across Canada & the USA" },
      {
        name: "description",
        content:
          "Canadian-owned moving, freight and cross-border logistics. Instant quotes, live shipment tracking and professional crews across Toronto, Ottawa, Montréal, Calgary and Vancouver.",
      },
      { property: "og:title", content: "NexCore Express Ltd. | Moving What Matters" },
      {
        property: "og:description",
        content:
          "Reliable moving, freight and cross-border logistics across Canada and the United States.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const HERO_IMAGES = [
  { src: heroFleet, alt: "NexCore Express moving trucks at the company facility" },
  { src: hero2, alt: "The NexCore Express truck fleet lined up at the depot at sunrise" },
  { src: hero3, alt: "A NexCore Express crew loading wrapped furniture into a moving truck" },
];

const ICONS: Record<string, typeof Truck> = {
  truck: Truck,
  "package-check": PackageCheck,
  earth: Earth,
  "shield-check": ShieldCheck,
  clock: Clock3,
  zap: Zap,
};

const REVIEWS = [
  {
    quote:
      "The quote took eleven seconds and it was the price I paid. The tracking meant I never had to call anyone.",
    name: "Amelia Hart",
    detail: "Moved Toronto → Montréal",
  },
  {
    quote:
      "We relocated three floors over a weekend and opened on Monday morning as if nothing had happened.",
    name: "Daniel Okafor",
    detail: "Office relocation, Ottawa",
  },
  {
    quote:
      "Cross-border paperwork was handled end to end. The crew wrapped every single item without being asked.",
    name: "Priya Raman",
    detail: "Calgary → Seattle",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { data: services } = useQuery(servicesQuery);
  const [slide, setSlide] = useState(0);
  const [review, setReview] = useState(0);
  const [trackRef, setTrackRef] = useState("");

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void navigate({
      to: "/quote",
      search: {
        pickup: String(form.get("pickup") ?? ""),
        destination: String(form.get("destination") ?? ""),
        property: String(form.get("property") ?? ""),
        service: String(form.get("service") ?? ""),
        date: String(form.get("date") ?? ""),
      },
    });
  }

  function handleTrackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trackRef.trim()) return;
    void navigate({ to: "/track", search: { ref: trackRef.trim() } });
  }

  const activeReview = REVIEWS[review]!;

  return (
    <PageShell>
      <section className="relative min-h-[620px] overflow-hidden bg-nex-ink text-white" id="top">
        <div className="absolute inset-0">
          {HERO_IMAGES.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={1920}
              height={1200}
              className={`motion-hero-image absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                index === slide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-nex-ink via-nex-ink/90 to-nex-ink/25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:min-h-[620px] lg:grid-cols-[1.02fr_.98fr] lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 flex items-center gap-2 text-nex-lime">
              <span className="h-px w-10 bg-nex-lime" />
              Moving across Canada &amp; the USA
            </p>
            <h1 className="text-balance text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Moving made <span className="text-nex-orange">simple.</span>
              <br />
              Technology made smarter.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-white/75">
              Reliable moving, freight and cross-border logistics across Canada and the United
              States.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/quote" className="bg-nex-orange px-6 py-4 font-extrabold text-white">
                Get a quote
                <ArrowRight className="ml-2 inline size-4" aria-hidden="true" />
              </Link>
              <Link to="/track" className="border border-white/35 px-6 py-4 font-bold text-white">
                Track shipment
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-white/20 pt-7 text-sm">
              <span>
                <strong className="block text-2xl text-white">20,271+</strong>
                <span className="text-white/60">Moves</span>
              </span>
              <span>
                <strong className="block text-2xl text-white">4.0/5</strong>
                <span className="text-white/60">Rated</span>
              </span>
              <span>
                <strong className="block text-2xl text-white">79%</strong>
                <span className="text-white/60">On-time</span>
              </span>
              <span>
                <strong className="block text-2xl text-white">10 yrs</strong>
                <span className="text-white/60">Experience</span>
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 left-5 right-5 z-10 flex items-center justify-between sm:left-8 sm:right-8">
          <div className="flex gap-2" role="tablist" aria-label="Hero images">
            {HERO_IMAGES.map((image, index) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={index === slide}
                aria-label={`Show hero image ${index + 1}`}
                onClick={() => setSlide(index)}
                className={`h-1.5 transition-all ${
                  index === slide ? "w-12 bg-nex-lime" : "w-6 bg-white/45 hover:bg-white"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-white/70">
            {String(slide + 1).padStart(2, "0")} / 03
          </span>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <img
            src={heroFleet}
            alt="NexCore Express moving trucks at the company facility"
            className="aspect-[4/3] w-full object-cover"
            width={1200}
            height={900}
            loading="lazy"
          />
          <div>
            <p className="eyebrow">The NexCore fleet</p>
            <h2 className="section-title">Big moves. One unmistakable mark.</h2>
            <p className="mt-5 leading-7 text-nex-muted">
              Every truck carries the NexCore promise: careful crews, smart routing and transparent
              service from pickup to delivery.
            </p>
            <Link
              to="/quote"
              className="mt-8 inline-flex items-center gap-2 bg-nex-ink px-5 py-3 text-sm font-extrabold text-white"
            >
              Book a branded crew
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-nex-paper px-5 py-20 sm:px-8 lg:py-28" id="quote">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">01 / Instant pricing</p>
            <h2 className="section-title">Get an Instant Quote.</h2>
            <p className="mt-5 max-w-sm leading-7 text-nex-muted">
              Tell us the essentials. We will do the heavy lifting on the numbers.
            </p>
          </div>
          <div className="border border-nex-line bg-white p-6 sm:p-8">
            <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleQuoteSubmit}>
              <div>
                <label className="field-label" htmlFor="pickup">
                  Pickup address
                </label>
                <input className="field" id="pickup" name="pickup" placeholder="Toronto, ON" required />
              </div>
              <div>
                <label className="field-label" htmlFor="destination">
                  Destination address
                </label>
                <input
                  className="field"
                  id="destination"
                  name="destination"
                  placeholder="Montréal, QC"
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="property">
                  Property type
                </label>
                <select className="field" id="property" name="property" defaultValue="">
                  <option value="">Select property type</option>
                  <option>Studio</option>
                  <option>1-Bed</option>
                  <option>2-Bed</option>
                  <option>3-Bed</option>
                  <option>Detached House</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="service">
                  Service type
                </label>
                <select className="field" id="service" name="service" defaultValue="">
                  <option value="">Select service type</option>
                  <option>Residential Moving</option>
                  <option>Commercial Moving</option>
                  <option>Office Relocation</option>
                  <option>Packing</option>
                  <option>Storage</option>
                  <option>Specialty</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="date">
                  Moving date
                </label>
                <input className="field" id="date" name="date" type="date" required />
              </div>
              <button
                type="submit"
                className="bg-nex-orange px-5 py-4 font-extrabold text-white sm:col-span-2"
              >
                Calculate quote
                <ArrowRight className="ml-2 inline size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28" id="services">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">02 / Our divisions</p>
          <h2 className="section-title">Every kind of move, one platform.</h2>
          <p className="mt-5 max-w-md leading-7 text-nex-muted">
            Six specialist divisions, one operating system, the same standard of care.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map((service, index) => {
              const Icon = ICONS[service.icon] ?? Truck;
              return (
                <article
                  key={service.id}
                  className="motion-reveal group overflow-hidden border border-nex-line bg-nex-paper transition duration-300 hover:-translate-y-2 hover:border-nex-green hover:shadow-xl"
                >
                  {SERVICE_IMAGES[service.slug] ? (
                    <img
                      src={SERVICE_IMAGES[service.slug]}
                      alt={service.title}
                      width={960}
                      height={720}
                      loading="lazy"
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="p-7">
                  <span className="font-mono text-xs font-bold text-nex-green">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="my-6 grid size-12 place-items-center bg-nex-lime">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-black">{service.title}</h3>
                  <p className="mt-3 leading-7 text-nex-muted">{service.short_description}</p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold"
                  >
                    Explore
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-nex-ink px-5 py-20 text-white sm:px-8 lg:py-28" id="tracking">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-nex-lime">03 / Live tracking</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Watch it move, live.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-white/65">
            Real-time status, crew details and a timeline that updates as your move progresses.
          </p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_.9fr]">
            <div className="border border-white/15 bg-white/5 p-7">
              <div className="flex justify-between text-xs font-bold text-white/60">
                <span>PICKUP</span>
                <span>DESTINATION</span>
              </div>
              <div className="relative my-12 h-1 overflow-visible bg-white/15">
                <div className="h-full bg-nex-lime transition-all duration-1000" style={{ width: "0%" }} />
                <span className="tracking-truck absolute top-1/2 -translate-y-1/2" style={{ left: "0%" }}>
                  <Truck
                    className="size-6 fill-nex-orange text-nex-orange drop-shadow-lg"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <p className="text-sm font-bold">
                Enter your move reference to load live progress for your shipment.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
                <span>
                  <strong className="block text-xl">—</strong>
                  <span className="text-white/50">status</span>
                </span>
                <span>
                  <strong className="block text-xl">—</strong>
                  <span className="text-white/50">truck</span>
                </span>
                <span>
                  <strong className="block text-xl">—</strong>
                  <span className="text-white/50">movers</span>
                </span>
              </div>
            </div>
            <div className="border border-white/15 bg-white/5 p-7">
              <div className="grid gap-5 text-sm">
                <p className="text-white/70">
                  <span className="mr-4 inline-block size-3 rounded-full bg-nex-lime" />
                  Crew dispatched
                </p>
                <p className="text-white/70">
                  <span className="mr-4 inline-block size-3 rounded-full bg-nex-lime" />
                  Loading complete
                </p>
                <p className="text-white/70">
                  <span className="mr-4 inline-block size-3 rounded-full bg-nex-orange" />
                  In transit
                </p>
                <p className="text-white/45">
                  <span className="mr-4 inline-block size-3 rounded-full border border-white/35" />
                  Arrival &amp; unload
                </p>
              </div>
              <form className="mt-8 flex gap-2" onSubmit={handleTrackSubmit}>
                <label className="sr-only" htmlFor="tracking-number">
                  Enter move reference
                </label>
                <input
                  className="field field-dark"
                  id="tracking-number"
                  placeholder="Enter move reference"
                  value={trackRef}
                  onChange={(event) => setTrackRef(event.target.value)}
                />
                <button type="submit" className="bg-nex-orange px-5 font-extrabold text-white">
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-nex-paper px-5 py-20 sm:px-8 lg:py-28" id="standard">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">04 / The NexCore standard</p>
          <h2 className="section-title">Why teams and families choose NexCore.</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Instant Quotes", "Pricing based on real moves, delivered in seconds."],
              ["Live GPS Tracking", "Watch your crew approach, minute by minute."],
              ["Transparent Pricing", "One number. No surprise fees."],
              ["Professional Movers", "Background-checked, in-house, uniformed teams."],
              ["Secure Payments", "Encrypted checkout with pay-after-delivery options."],
              ["24/7 Support", "Humans on the line whenever you need them."],
            ].map(([title, copy]) => (
              <article key={title} className="border-t-2 border-nex-lime bg-white p-6">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-nex-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-20 sm:px-8" id="capabilities">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 border border-nex-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-5 lg:items-center">
            <h2 className="text-2xl font-black leading-tight">
              WHY CHOOSE
              <br />
              <span className="text-nex-ink">NEX</span>
              <span className="text-nex-green">CORE</span>{" "}
              <span className="text-nex-orange">EXPRESS?</span>
            </h2>
            {[
              { Icon: Users, top: "Experienced", bottom: "Professionals" },
              { Icon: ShieldCheck, top: "Safe & Secure", bottom: "Freight Handling" },
              { Icon: Headphones, top: "Excellent", bottom: "Customer Service" },
              { Icon: ThumbsUp, top: "Flexible & Scalable", bottom: "Solutions" },
            ].map(({ Icon, top, bottom }) => (
              <article key={top} className="text-center">
                <Icon className="mx-auto size-9 text-nex-green" aria-hidden="true" />
                <p className="mt-3 text-sm font-black uppercase tracking-wide">{top}</p>
                <p className="text-sm font-black uppercase tracking-wide">{bottom}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 bg-nex-ink px-6 py-10 text-white">
            <h3 className="text-center text-xl font-black uppercase tracking-wide text-nex-lime">
              Our equipment &amp; capabilities
            </h3>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
              <img
                src={hero2}
                alt="NexCore Express 26-foot straight box truck"
                width={960}
                height={720}
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { Icon: Truck, top: "26-Foot", bottom: "Straight Box Truck" },
                  { Icon: Weight, top: "Up to", bottom: "12,000 lbs capacity" },
                  { Icon: BadgeCheck, top: "Fully Insured", bottom: "& Bonded" },
                  { Icon: MapPin, top: "Local, Regional", bottom: "& Cross-Border Service" },
                ].map(({ Icon, top, bottom }) => (
                  <article key={bottom} className="text-center">
                    <Icon className="mx-auto size-8 text-nex-lime" aria-hidden="true" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wide">{top}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                      {bottom}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [svcResidential, "Careful crews handling home moves"],
              [svcCommercial, "Freight loaded at a commercial dock"],
              [svcSpecialty, "Specialty items wrapped and strapped"],
            ].map(([src, alt]) => (
              <img
                key={alt}
                src={src}
                alt={alt}
                width={960}
                height={720}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>



      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">07 / Social proof</p>
          <h2 className="section-title">Rated 4.9/5 across 6,200 moves.</h2>
          <QuoteIcon className="mx-auto mt-10 size-10 text-nex-orange" aria-hidden="true" />
          <blockquote className="mt-6 text-3xl font-black leading-tight sm:text-4xl">
            “{activeReview.quote}”
          </blockquote>
          <p className="mt-6 text-sm font-bold">
            {activeReview.name}
            <span className="mx-2 text-nex-line">/</span>
            <span className="font-normal text-nex-muted">{activeReview.detail}</span>
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              aria-label="Previous review"
              onClick={() => setReview((r) => (r - 1 + REVIEWS.length) % REVIEWS.length)}
              className="grid size-10 place-items-center border border-nex-line bg-nex-paper"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Next review"
              onClick={() => setReview((r) => (r + 1) % REVIEWS.length)}
              className="grid size-10 place-items-center border border-nex-line bg-nex-paper"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
