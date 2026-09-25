import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/page-shell";
import { getServiceBooking } from "@/lib/service-booking.functions";

type BookingSearch = { ref?: string; status?: string };

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => {
    const parsed: BookingSearch = {};
    if (typeof search['ref'] === "string" && search['ref']) parsed.ref = search['ref'];
    if (typeof search['status'] === "string" && search['status']) parsed.status = search['status'];
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Booking Confirmation | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "View your NexCore Express appliance delivery and installation booking: services, schedule, totals and payment status.",
      },
      { property: "og:title", content: "Booking Confirmation | NexCore Express Ltd." },
      {
        property: "og:description",
        content: "Your NexCore Express appliance service booking details and reference number.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingPage,
});

function money(value: number) {
  return `$${value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function BookingPage() {
  const search = Route.useSearch();
  const reference = search.ref ?? "";
  const { data, isLoading } = useQuery({
    queryKey: ["service-booking", reference],
    enabled: reference.length > 3,
    queryFn: () => getServiceBooking({ data: { reference } }),
  });

  if (search.status === "cancelled" || search.status === "failed") {
    const cancelled = search.status === "cancelled";
    return (
      <PageShell>
        <PageHero eyebrow="Checkout" title={cancelled ? "Payment cancelled." : "Payment could not be completed."} />
        <section className="bg-white px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl border border-nex-line bg-nex-paper p-8 text-center">
            <XCircle className="mx-auto size-12 text-nex-orange" aria-hidden="true" />
            <p className="mt-6 leading-7 text-nex-muted">
              {cancelled
                ? "Your payment was not completed. Your selected services have been saved temporarily."
                : "Please try again or use another payment method."}
            </p>
            <Link to="/" hash="book" className="mt-8 inline-block bg-nex-orange px-6 py-4 font-extrabold text-white">
              {cancelled ? "Return to checkout" : "Try again"}
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Booking"
        title="Thank you — your service has been booked!"
        intro="Your booking has been confirmed with NexCore Express Ltd. Keep your booking number for your records."
      />
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl border border-nex-line bg-nex-paper p-8">
          {isLoading ? (
            <p className="text-center text-nex-muted">Loading your booking…</p>
          ) : !data ? (
            <p className="text-center text-nex-muted">
              We could not find a booking for reference “{reference}”. Please check the number or
              contact us.
            </p>
          ) : (
            <>
              <CheckCircle2 className="mx-auto size-12 text-nex-green" aria-hidden="true" />
              <h2 className="mt-6 text-center text-3xl font-black">
                Booking {data.booking_number}
              </h2>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <Info label="Customer" value={data.full_name} />
                <Info label="Email" value={data.email} />
                <Info
                  label="Service address"
                  value={
                    [data.street_address, data.city, data.province, data.postal_code]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
                <Info
                  label="Service date & time"
                  value={`${data.service_date ?? "To be confirmed"}${data.service_time ? ` · ${data.service_time}` : ""}`}
                />
                <Info label="Booking status" value={data.status} />
                <Info label="Payment status" value={data.payment_status} />
              </dl>

              <h3 className="mt-8 text-sm font-black uppercase tracking-widest">Services</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {data.items.map((item) => (
                  <li key={item.name} className="flex justify-between gap-4 border-b border-nex-line pb-2">
                    <span>
                      {item.name}
                      {item.quantity > 1 ? ` x${item.quantity}` : ""}
                    </span>
                    <span className="font-bold">{money(item.line_total)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-bold">{money(data.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>HST ({data.tax_rate}%)</dt>
                  <dd className="font-bold">{money(data.tax_amount)}</dd>
                </div>
                <div className="flex justify-between border-t border-nex-line pt-2 text-xl font-black">
                  <dt>Total</dt>
                  <dd>{money(data.total)}</dd>
                </div>
              </dl>

              <p className="mt-6 text-sm leading-6 text-nex-muted">
                We will contact you if any additional information is required.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/" className="bg-nex-ink px-6 py-4 font-extrabold text-white">
                  Back to home
                </Link>
                <Link to="/contact" className="border border-nex-line px-6 py-4 font-extrabold">
                  Contact us about this booking
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-nex-line bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-widest text-nex-muted">{label}</dt>
      <dd className="mt-1 font-bold capitalize">{value}</dd>
    </div>
  );
}
