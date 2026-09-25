/**
 * Server-only transactional email helper.
 *
 * Delivery runs through Resend. The API key is read from the RESEND_API_KEY
 * environment variable at call time and never reaches the browser. When the key
 * is missing the helper reports `sent: false` with a reason instead of
 * pretending an email went out.
 */
export type EmailResult = { sent: boolean; reason?: string };

export async function sendEmail(options: {
  to?: string | undefined;
  subject: string;
  body: string;
}): Promise<EmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["NOTIFICATION_FROM_EMAIL"] ?? "NexCore Express <onboarding@resend.dev>";
  const recipient = options.to ?? process.env["NOTIFICATION_INTERNAL_EMAIL"];

  if (!apiKey || !recipient) {
    console.info("[email skipped]", options.subject, {
      hasKey: Boolean(apiKey),
      hasRecipient: Boolean(recipient),
    });
    return {
      sent: false,
      reason: !apiKey ? "Email delivery is not configured yet." : "No recipient address configured.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [recipient], subject: options.subject, text: options.body }),
    });
    if (!response.ok) {
      console.error("[email failed]", response.status, await response.text());
      return { sent: false, reason: `Email provider returned ${response.status}.` };
    }
    return { sent: true };
  } catch (error) {
    console.error("[email error]", error);
    return { sent: false, reason: "Email provider unreachable." };
  }
}
