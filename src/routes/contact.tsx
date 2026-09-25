import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { PageHero, PageShell } from "@/components/site/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { sendNotification } from "@/lib/notifications.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact NexCore Express | Moving & Logistics Enquiries" },
      {
        name: "description",
        content:
          "Contact NexCore Express Ltd. Send a moving, freight, billing or support enquiry and our Toronto team responds the same working day.",
      },
      { property: "og:title", content: "Contact NexCore Express" },
      {
        property: "og:description",
        content: "Moving, freight, billing and support enquiries — answered the same working day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const TYPES = ["General", "Quote", "Booking", "Tracking", "Billing", "Complaint", "Partnership"];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);

    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone") || "") || null,
      subject: String(form.get("subject")),
      enquiry_type: String(form.get("enquiry_type")),
      message: String(form.get("message")),
      location: String(form.get("location") || "") || null,
    };

    const { data, error } = await supabase.rpc("submit_enquiry", { _payload: payload });
    setSubmitting(false);

    if (error || !data) {
      toast.error("We could not send your enquiry. Please try again or call us.");
      return;
    }

    setReference(data);
    toast.success("Enquiry received.");
    void sendNotification({
      data: {
        type: "enquiry",
        subject: `New enquiry ${data}: ${payload.subject}`,
        body: `${payload.name} (${payload.email}, ${payload.phone ?? "no phone"})\nType: ${payload.enquiry_type}\n\n${payload.message}`,
      },
    }).catch(() => undefined);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to a real person."
        intro="Moving, freight, billing or support — send us the details and our Toronto team replies the same working day."
      />

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="grid content-start gap-6">
            <div className="border-t-2 border-nex-lime bg-nex-paper p-6">
              <Phone className="size-5 text-nex-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black">Call us</h2>
              <a className="mt-2 block text-nex-muted" href="tel:18006392673">
                +1 (800) NEX-CORE
              </a>
            </div>
            <div className="border-t-2 border-nex-lime bg-nex-paper p-6">
              <Mail className="size-5 text-nex-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black">Email us</h2>
              <a className="mt-2 block text-nex-muted" href="mailto:hello@nexcoreexpress.com">
                hello@nexcoreexpress.com
              </a>
            </div>
            <div className="border-t-2 border-nex-lime bg-nex-paper p-6">
              <MapPin className="size-5 text-nex-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black">Head office</h2>
              <p className="mt-2 text-nex-muted">Toronto, Ontario, Canada</p>
            </div>
          </div>

          <div className="border border-nex-line bg-white p-6 sm:p-8">
            {reference ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-12 text-nex-green" aria-hidden="true" />
                <h2 className="mt-6 text-3xl font-black">Thank you.</h2>
                <p className="mt-4 leading-7 text-nex-muted">
                  Your enquiry reference is <strong>{reference}</strong>. We will be in touch shortly.
                </p>
              </div>
            ) : (
              <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
                <div>
                  <label className="field-label" htmlFor="name">
                    Name *
                  </label>
                  <input className="field" id="name" name="name" required />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">
                    Email *
                  </label>
                  <input className="field" id="email" name="email" type="email" required />
                </div>
                <div>
                  <label className="field-label" htmlFor="phone">
                    Phone
                  </label>
                  <input className="field" id="phone" name="phone" type="tel" />
                </div>
                <div>
                  <label className="field-label" htmlFor="enquiry_type">
                    Enquiry type *
                  </label>
                  <select className="field" id="enquiry_type" name="enquiry_type" required defaultValue="General">
                    {TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="subject">
                    Subject *
                  </label>
                  <input className="field" id="subject" name="subject" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="location">
                    Your location
                  </label>
                  <input className="field" id="location" name="location" placeholder="City, province" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="message">
                    Message *
                  </label>
                  <textarea className="field min-h-36" id="message" name="message" required />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-nex-orange px-5 py-4 font-extrabold text-white disabled:opacity-60 sm:col-span-2"
                >
                  {submitting ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
