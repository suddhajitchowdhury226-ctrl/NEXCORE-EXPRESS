import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payloadSchema = z.object({
  type: z.enum([
    "quote_request",
    "enquiry",
    "booking_confirmation",
    "shipment_update",
    "payment_confirmation",
    "invoice",
  ]),
  to: z.string().email().optional(),
  subject: z.string().min(3).max(200),
  body: z.string().min(3).max(5000),
});

export type NotificationResult = {
  sent: boolean;
  reason?: string;
};

/**
 * Transactional email delivery.
 *
 * Delivery runs through Resend. The API key is read from the RESEND_API_KEY
 * environment variable inside the handler and is never exposed to the browser.
 * Until that key is configured the function reports `sent: false` with a clear
 * reason instead of pretending an email went out.
 */
export const sendNotification = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => payloadSchema.parse(input))
  .handler(async ({ data }): Promise<NotificationResult> => {
    const apiKey = process.env["RESEND_API_KEY"];
    const from = process.env["NOTIFICATION_FROM_EMAIL"] ?? "NexCore Express <onboarding@resend.dev>";
    const internal = process.env["NOTIFICATION_INTERNAL_EMAIL"];
    const recipient = data.to ?? internal;

    if (!apiKey || !recipient) {
      console.info("[notification skipped]", data.type, data.subject, {
        hasKey: Boolean(apiKey),
        hasRecipient: Boolean(recipient),
      });
      return {
        sent: false,
        reason: !apiKey
          ? "Email delivery is not configured yet (RESEND_API_KEY missing)."
          : "No recipient address configured.",
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [recipient],
          subject: data.subject,
          text: data.body,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("[notification failed]", response.status, detail);
        return { sent: false, reason: `Email provider returned ${response.status}.` };
      }
      return { sent: true };
    } catch (error) {
      console.error("[notification error]", error);
      return { sent: false, reason: "Email provider unreachable." };
    }
  });
