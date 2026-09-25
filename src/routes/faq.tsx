import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero, PageShell, Section } from "@/components/site/page-shell";
import { faqsQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  head: () => ({
    meta: [
      { title: "Moving FAQs | NexCore Express Ltd." },
      {
        name: "description",
        content:
          "Answers to common questions about NexCore Express moving quotes, booking, tracking, packing, storage, insurance and cross-border shipments.",
      },
      { property: "og:title", content: "Frequently Asked Questions | NexCore Express" },
      {
        property: "og:description",
        content: "Quotes, booking, tracking, packing, storage and cross-border moving questions answered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data: faqs } = useSuspenseQuery(faqsQuery);
  const categories = [...new Set(faqs.map((faq) => faq.category ?? "General"))];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        intro="The things customers ask us most about quotes, booking, tracking and moving day."
      />

      <Section tone="paper">
        <div className="mx-auto max-w-3xl">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="section-title text-2xl!">{category}</h2>
              <Accordion type="single" collapsible className="mt-6">
                {faqs
                  .filter((faq) => (faq.category ?? "General") === category)
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-b border-nex-line bg-white px-5"
                    >
                      <AccordionTrigger className="text-left text-base font-extrabold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="leading-7 text-nex-muted">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}

          <div className="border border-nex-line bg-white p-8 text-center">
            <h2 className="text-2xl font-black">Still need help?</h2>
            <p className="mt-3 text-nex-muted">Our team answers enquiries the same working day.</p>
            <Link
              to="/contact"
              className="mt-6 inline-block bg-nex-orange px-6 py-4 font-extrabold text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
