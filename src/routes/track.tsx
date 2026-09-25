import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, Truck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PageHero, PageShell } from "@/components/site/page-shell";
import { supabase } from "@/integrations/supabase/client";

type TrackSearch = { ref?: string };

type TrackingEvent = {
  status: string;
  description: string | null;
  location: string | null;
  event_time: string;
};

type TrackingResult = {
  tracking_number: string;
  order_number: string | null;
  reference: string | null;
  status: string;
  progress_percent: number;
  origin: string;
  origin_city: string | null;
  destination: string;
  destination_city: string | null;
  current_location: string | null;
  current_latitude: number | null;
  current_longitude: number | null;
  vehicle: string | null;
  crew_size: number | null;
  pickup_date: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  events: TrackingEvent[];
};

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): TrackSearch =>
    typeof search["ref"] === "string" && search["ref"].length > 0 ? { ref: search["ref"] } : {},
  head: () => ({
    meta: [
      { title: "Track Your Shipment | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Track a NexCore Express move or freight shipment using your tracking number, booking number, order number or shipment reference.",
      },
      { property: "og:title", content: "Track Your Shipment | NexCore Express" },
      {
        property: "og:description",
        content: "Live status, route and full history for every NexCore Express shipment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(search.ref ?? "");
  const reference = search.ref ?? "";

  const { data, isFetching, isError } = useQuery({
    queryKey: ["track", reference],
    enabled: reference.length >= 4,
    queryFn: async () => {
      const { data: result, error } = await supabase.rpc("track_shipment", { _ref: reference });
      if (error) throw error;
      return (result as unknown as TrackingResult | null) ?? null;
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ to: "/track", search: { ref: input.trim() } });
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="03 / Live tracking"
        title="Track your shipment."
        intro="Enter a tracking number, booking number, order number or shipment reference to see current status, route and full history."
      >
        <form className="mt-9 flex max-w-xl flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="reference">
            Tracking reference
          </label>
          <input
            id="reference"
            className="field field-dark"
            placeholder="e.g. NX-48210 or BK-1A2B3C4D"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="bg-nex-orange px-6 py-4 font-extrabold text-white">
            <Search className="mr-2 inline size-4" aria-hidden="true" />
            Track
          </button>
        </form>
      </PageHero>

      <section className="bg-nex-paper px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {reference.length < 4 ? (
            <p className="text-nex-muted">
              Your reference is on your booking confirmation and on every invoice.
            </p>
          ) : isFetching ? (
            <p className="text-nex-muted">Looking up {reference}…</p>
          ) : isError ? (
            <p className="text-nex-muted">
              We could not reach the tracking service. Please try again shortly.
            </p>
          ) : !data ? (
            <div className="border border-nex-line bg-white p-8">
              <h2 className="text-2xl font-black">No shipment found for “{reference}”.</h2>
              <p className="mt-3 leading-7 text-nex-muted">
                Check the reference and try again, or contact us and we will locate your move.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
              <div className="border border-nex-line bg-white p-7">
                <p className="eyebrow">{data.status.replace(/_/g, " ")}</p>
                <h2 className="section-title text-3xl!">{data.tracking_number}</h2>
                <div className="mt-8 flex justify-between text-xs font-bold text-nex-muted">
                  <span className="uppercase">{data.origin_city ?? data.origin}</span>
                  <span className="uppercase">{data.destination_city ?? data.destination}</span>
                </div>
                <div className="relative my-10 h-1 overflow-visible bg-nex-line">
                  <div
                    className="h-full bg-nex-lime transition-all duration-1000"
                    style={{ width: `${data.progress_percent}%` }}
                  />
                  <span
                    className="tracking-truck absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${data.progress_percent}%` }}
                  >
                    <Truck
                      className="size-6 fill-nex-orange text-nex-orange drop-shadow"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="field-label">Pickup</dt>
                    <dd className="text-nex-muted">{data.origin}</dd>
                  </div>
                  <div>
                    <dt className="field-label">Destination</dt>
                    <dd className="text-nex-muted">{data.destination}</dd>
                  </div>
                  <div>
                    <dt className="field-label">Current location</dt>
                    <dd className="flex items-center gap-2 text-nex-muted">
                      <MapPin className="size-4 text-nex-green" aria-hidden="true" />
                      {data.current_location ?? "Not reported yet"}
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label">Estimated delivery</dt>
                    <dd className="text-nex-muted">
                      {data.delivered_at
                        ? `Delivered ${new Date(data.delivered_at).toLocaleString()}`
                        : data.estimated_delivery
                          ? new Date(data.estimated_delivery).toLocaleString()
                          : "To be confirmed"}
                    </dd>
                  </div>
                  {data.vehicle ? (
                    <div>
                      <dt className="field-label">Vehicle</dt>
                      <dd className="text-nex-muted">{data.vehicle}</dd>
                    </div>
                  ) : null}
                  {data.crew_size ? (
                    <div>
                      <dt className="field-label">Crew</dt>
                      <dd className="text-nex-muted">{data.crew_size} movers</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="border border-nex-line bg-nex-ink p-7 text-white">
                <p className="footer-heading">Shipment history</p>
                {data.events.length === 0 ? (
                  <p className="mt-6 text-sm text-white/60">No tracking updates recorded yet.</p>
                ) : (
                  <ol className="mt-6 grid gap-5 text-sm">
                    {data.events.map((event, index) => (
                      <li key={`${event.event_time}-${index}`}>
                        <p className="font-bold">
                          <span
                            className={`mr-3 inline-block size-3 rounded-full ${
                              index === 0 ? "bg-nex-orange" : "bg-nex-lime"
                            }`}
                          />
                          {event.status}
                          <span className="float-right text-white/50">
                            {new Date(event.event_time).toLocaleString()}
                          </span>
                        </p>
                        {event.description ? (
                          <p className="ml-6 mt-1 text-white/60">{event.description}</p>
                        ) : null}
                        {event.location ? (
                          <p className="ml-6 mt-1 text-white/45">{event.location}</p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
