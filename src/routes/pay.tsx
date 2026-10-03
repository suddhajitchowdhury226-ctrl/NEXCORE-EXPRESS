import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Lock,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { PageShell } from "@/components/site/page-shell";

/* ─── Search params schema ───────────────────────────────────────────────── */
const paySearch = z.object({
  service: z.string().default(""),
  price: z.string().default(""),
  amount: z.number().optional(),
});

export const Route = createFileRoute("/pay")({
  validateSearch: paySearch,
  head: () => ({
    meta: [
      { title: "Pay Now | NexCore Express Ltd." },
      { name: "description", content: "Secure payment for NexCore Express appliance delivery and installation services." },
    ],
  }),
  component: PayPage,
});

/* ─── Static data (outside component to avoid re-creation) ──────────────── */
type TrustBadge = { Icon: typeof ShieldCheck; text: string };
const TRUST_BADGES: TrustBadge[] = [
  { Icon: ShieldCheck, text: "Secure SSL checkout" },
  { Icon: BadgeCheck,  text: "Licensed & insured service" },
  { Icon: Lock,        text: "No hidden fees — HST only" },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
function PayPage() {
  const { service, price, amount } = useSearch({ from: "/pay" });
  const [step, setStep] = useState<"details" | "confirm" | "success">("details");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", notes: "",
    card: "", expiry: "", cvv: "", cardName: "",
  });

  const isCallForQuote = price === "Call for Quote" || !amount;

  function handleDetailsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep("confirm");
  }

  function handlePaySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep("success");
  }

  function change(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }

  /* ── success ── */
  if (step === "success") {
    return (
      <PageShell>
        <section className="bg-nex-paper px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-nex-green">
              <BadgeCheck className="size-10 text-white" />
            </div>
            <h1 className="mt-8 text-4xl font-black text-nex-ink">Payment Confirmed!</h1>
            <p className="mt-4 leading-7 text-nex-muted">
              Thank you, <strong>{formData.name}</strong>. Your payment for{" "}
              <strong>{service || "the selected service"}</strong> has been received.
              A confirmation will be sent to <strong>{formData.email}</strong>.
            </p>
            <div className="mt-8 border border-nex-line bg-white p-6 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-nex-muted">Summary</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-nex-muted">Service</span>
                  <span className="font-bold text-nex-ink">{service}</span>
                </div>
                <div className="flex justify-between border-t border-nex-line pt-2">
                  <span className="text-nex-muted">Amount paid</span>
                  <span className="text-lg font-extrabold text-nex-green">{price}</span>
                </div>
                <p className="text-xs text-nex-muted">+ HST where applicable</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/" className="bg-nex-ink px-6 py-3 font-extrabold text-white">
                Back to Home
              </Link>
              <Link to="/pricing" className="border border-nex-line px-6 py-3 font-bold text-nex-ink hover:bg-nex-paper">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header bar */}
      <div className="bg-nex-ink px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            to="/pricing"
            className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Pricing
          </Link>
          <div className="ml-auto flex items-center gap-2 text-sm text-white/60">
            <Lock className="size-4 text-nex-lime" />
            Secure 256-bit SSL
          </div>
        </div>
      </div>

      <section className="bg-nex-paper px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Call for quote redirect */}
          {isCallForQuote ? (
            <div className="mx-auto max-w-xl text-center">
              <div className="border border-nex-line bg-white p-10">
                <Phone className="mx-auto size-12 text-nex-green" />
                <h1 className="mt-6 text-3xl font-black text-nex-ink">Call for Quote</h1>
                <p className="mt-3 leading-7 text-nex-muted">
                  This service requires a custom quote. Call us and we'll give you an exact price
                  before any payment is taken.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <a
                    href="tel:+12896457777"
                    className="inline-flex items-center gap-2 bg-nex-lime px-7 py-4 font-extrabold text-nex-ink text-lg"
                  >
                    <Phone className="size-5" />
                    (289) 645-7777
                  </a>
                  <a
                    href="tel:+14164747928"
                    className="inline-flex items-center gap-2 bg-nex-lime px-7 py-4 font-extrabold text-nex-ink text-lg"
                  >
                    <Phone className="size-5" />
                    (416) 474-7928
                  </a>
                  <Link
                    to="/quote"
                    className="mt-2 border border-nex-ink px-7 py-3 font-bold text-nex-ink hover:bg-nex-ink hover:text-white"
                  >
                    Submit Quote Request Online
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* ── Left: form ── */}
              <div className="space-y-6">
                {/* Step indicator */}
                <div className="flex items-center gap-3">
                  {(["details", "confirm"] as const).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-extrabold ${
                          step === s || (step === "confirm" && i === 0)
                            ? "bg-nex-green text-white"
                            : "border-2 border-nex-line bg-white text-nex-muted"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`text-sm font-bold capitalize ${
                          step === s ? "text-nex-ink" : "text-nex-muted"
                        }`}
                      >
                        {s === "details" ? "Your Details" : "Payment"}
                      </span>
                      {i === 0 && (
                        <span className="mx-2 text-nex-line">—</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Customer details */}
                {step === "details" && (
                  <form
                    onSubmit={handleDetailsSubmit}
                    className="border border-nex-line bg-white p-7"
                  >
                    <h2 className="text-xl font-black text-nex-ink">Your Details</h2>
                    <p className="mt-1 text-sm text-nex-muted">
                      We'll use this to confirm your booking.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor="name">Full name *</label>
                        <input
                          className="field"
                          id="name"
                          required
                          placeholder="Jane Smith"
                          value={formData.name}
                          onChange={change("name")}
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="phone">Phone *</label>
                        <input
                          className="field"
                          id="phone"
                          type="tel"
                          required
                          placeholder="(416) 000-0000"
                          value={formData.phone}
                          onChange={change("phone")}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="email">Email address *</label>
                        <input
                          className="field"
                          id="email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={change("email")}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="address">
                          Service address *
                        </label>
                        <input
                          className="field"
                          id="address"
                          required
                          placeholder="123 Main St, Toronto, ON"
                          value={formData.address}
                          onChange={change("address")}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="notes">
                          Special instructions (optional)
                        </label>
                        <textarea
                          className="field min-h-[80px] resize-none"
                          id="notes"
                          placeholder="e.g. 3rd floor, no elevator"
                          value={formData.notes}
                          onChange={change("notes")}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 w-full bg-nex-orange py-4 font-extrabold text-white hover:bg-nex-orange/90"
                    >
                      Continue to Payment →
                    </button>
                  </form>
                )}

                {/* Step 2: Payment */}
                {step === "confirm" && (
                  <form
                    onSubmit={handlePaySubmit}
                    className="border border-nex-line bg-white p-7"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-nex-ink">Payment Details</h2>
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="text-sm font-bold text-nex-muted underline"
                      >
                        ← Edit details
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-nex-muted">
                      Your card will be charged{" "}
                      <strong className="text-nex-green">{price}</strong> + HST.
                    </p>

                    {/* Payment method pills */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Visa", "Mastercard", "Debit", "Interac"].map((m) => (
                        <span
                          key={m}
                          className="rounded border border-nex-line bg-nex-paper px-3 py-1 text-xs font-extrabold text-nex-ink"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4">
                      <div>
                        <label className="field-label" htmlFor="cardName">
                          Name on card *
                        </label>
                        <input
                          className="field"
                          id="cardName"
                          required
                          placeholder="Jane Smith"
                          value={formData.cardName}
                          onChange={change("cardName")}
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="card">
                          Card number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-nex-muted" />
                          <input
                            className="field pl-9"
                            id="card"
                            required
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                            value={formData.card}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                              const fmt = v.match(/.{1,4}/g)?.join(" ") ?? v;
                              setFormData((p) => ({ ...p, card: fmt }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="field-label" htmlFor="expiry">Expiry *</label>
                          <input
                            className="field"
                            id="expiry"
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                              const fmt = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
                              setFormData((p) => ({ ...p, expiry: fmt }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="cvv">CVV *</label>
                          <input
                            className="field"
                            id="cvv"
                            required
                            maxLength={4}
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 rounded bg-nex-paper p-3">
                      <Lock className="size-4 shrink-0 text-nex-green" />
                      <p className="text-xs text-nex-muted">
                        Payments are encrypted. NexCore never stores your card details.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="mt-6 flex w-full items-center justify-center gap-2 bg-nex-green py-4 font-extrabold text-white hover:bg-nex-green/90"
                    >
                      <Lock className="size-4" />
                      Pay {price} Now
                    </button>
                  </form>
                )}
              </div>

              {/* ── Right: order summary ── */}
              <div className="space-y-4">
                <div className="border border-nex-line bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-nex-muted">
                    Order Summary
                  </p>
                  <div className="mt-4 border-t border-nex-line pt-4">
                    <p className="font-bold text-nex-ink leading-snug">{service}</p>
                    <p className="mt-1 text-xs text-nex-muted">NexCore Express Ltd.</p>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between border-t border-nex-line pt-4">
                    <span className="text-sm text-nex-muted">Service fee</span>
                    <span className="text-xl font-extrabold text-nex-green">{price}</span>
                  </div>
                  <p className="mt-1 text-xs text-nex-muted text-right">+ HST where applicable</p>
                </div>

                {/* Trust badges */}
                <div className="border border-nex-line bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-nex-muted mb-3">
                    Why pay with NexCore
                  </p>
                  {TRUST_BADGES.map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 py-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-nex-lime">
                        <Icon className="size-3.5 text-nex-ink" />
                      </div>
                      <span className="text-sm text-nex-ink">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Help */}
                <div className="border border-nex-line bg-nex-ink p-5 text-center">
                  <p className="text-sm font-bold text-white">Need help?</p>
                  <a
                    href="tel:+12896457777"
                    className="mt-2 block text-nex-lime font-extrabold hover:underline"
                  >
                    (289) 645-7777
                  </a>
                  <a
                    href="tel:+14164747928"
                    className="block text-nex-lime font-extrabold hover:underline"
                  >
                    (416) 474-7928
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
