import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  slug: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(40),
});

const bookingSchema = z.object({
  items: z.array(itemSchema).min(1).max(30),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  street_address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(120).optional(),
  province: z.string().trim().max(120).optional(),
  postal_code: z.string().trim().max(20).optional(),
  service_date: z.string().trim().max(20).optional(),
  service_time: z.string().trim().max(60).optional(),
  delivery_instructions: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(2000).optional(),
  pickup_location: z.string().trim().max(300).optional(),
  delivery_address: z.string().trim().max(300).optional(),
  appliance_count: z.number().int().min(0).max(50).optional(),
  appliance_type: z.string().trim().max(120).optional(),
  appliance_brand: z.string().trim().max(120).optional(),
  appliance_model: z.string().trim().max(120).optional(),
  remove_existing: z.boolean().optional(),
});

export type BookingLine = { name: string; unit_price: number; quantity: number; line_total: number };

export type BookingSummary = {
  booking_number: string;
  full_name: string;
  email: string;
  service_date: string | null;
  service_time: string | null;
  street_address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  payment_status: string;
  status: string;
  items: BookingLine[];
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Creates a real booking. Prices are never trusted from the browser: the
 * handler re-reads every selected service from the database, recalculates the
 * line totals, reads the configurable tax rate and stores the result.
 */
export const createServiceBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }): Promise<BookingSummary> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const slugs = [...new Set(data.items.map((item) => item.slug))];
    const { data: services, error: servicesError } = await supabaseAdmin
      .from("appliance_services")
      .select("id, slug, name, price, requires_quote, is_active")
      .in("slug", slugs);
    if (servicesError) throw new Error("Could not load the service pricing.");

    const priced = data.items
      .map((item) => {
        const service = services?.find((row) => row.slug === item.slug);
        if (!service || !service.is_active || service.requires_quote) return null;
        const unit = Number(service.price);
        return {
          service_id: service.id,
          name: service.name,
          unit_price: unit,
          quantity: item.quantity,
          line_total: round2(unit * item.quantity),
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    if (priced.length === 0) throw new Error("No payable services were selected.");

    const { data: taxRow } = await supabaseAdmin
      .from("site_content")
      .select("value")
      .eq("key", "hst_rate")
      .maybeSingle();
    const taxRate = Number(taxRow?.value ?? 13) || 0;

    const subtotal = round2(priced.reduce((sum, line) => sum + line.line_total, 0));
    const taxAmount = round2((subtotal * taxRate) / 100);
    const total = round2(subtotal + taxAmount);

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("service_bookings")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        street_address: data.street_address ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        postal_code: data.postal_code ?? null,
        service_date: data.service_date || null,
        service_time: data.service_time ?? null,
        delivery_instructions: data.delivery_instructions ?? null,
        notes: data.notes ?? null,
        pickup_location: data.pickup_location ?? null,
        delivery_address: data.delivery_address ?? null,
        appliance_count: data.appliance_count ?? null,
        appliance_type: data.appliance_type ?? null,
        appliance_brand: data.appliance_brand ?? null,
        appliance_model: data.appliance_model ?? null,
        remove_existing: data.remove_existing ?? false,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        payment_status: "unpaid",
        status: "pending",
      })
      .select("*")
      .single();
    if (bookingError || !booking) throw new Error("Could not create the booking.");

    const { error: itemsError } = await supabaseAdmin.from("service_booking_items").insert(
      priced.map((line) => ({
        booking_id: booking.id,
        service_id: line.service_id,
        name: line.name,
        unit_price: line.unit_price,
        quantity: line.quantity,
        line_total: line.line_total,
      })),
    );
    if (itemsError) throw new Error("Could not save the selected services.");

    const lines = priced
      .map((line) => `- ${line.name} x${line.quantity}: $${line.line_total.toFixed(2)}`)
      .join("\n");
    const summaryText = [
      `Booking number: ${booking.booking_number}`,
      `Customer: ${data.full_name} (${data.email}${data.phone ? `, ${data.phone}` : ""})`,
      `Service address: ${[data.street_address, data.city, data.province, data.postal_code].filter(Boolean).join(", ") || "not provided"}`,
      `Service date: ${data.service_date || "not set"}`,
      `Preferred time: ${data.service_time || "not set"}`,
      "",
      "Services:",
      lines,
      "",
      `Subtotal: $${subtotal.toFixed(2)}`,
      `HST (${taxRate}%): $${taxAmount.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      `Payment status: ${booking.payment_status}`,
    ].join("\n");

    const { sendEmail } = await import("@/lib/email.server");
    await sendEmail({
      to: data.email,
      subject: `NexCore Express Ltd. — Booking Confirmation #${booking.booking_number}`,
      body: `Thank you ${data.full_name},\n\nYour service has been booked with NexCore Express Ltd.\n\n${summaryText}\n\nWe will contact you if any additional information is required.`,
    });
    await sendEmail({
      subject: `New service booking ${booking.booking_number}`,
      body: summaryText,
    });

    return {
      booking_number: booking.booking_number,
      full_name: booking.full_name,
      email: booking.email,
      service_date: booking.service_date,
      service_time: booking.service_time,
      street_address: booking.street_address,
      city: booking.city,
      province: booking.province,
      postal_code: booking.postal_code,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      payment_status: booking.payment_status,
      status: booking.status,
      items: priced.map(({ name, unit_price, quantity, line_total }) => ({
        name,
        unit_price,
        quantity,
        line_total,
      })),
    };
  });

/** Looks up a booking by its reference so the customer can review it later. */
export const getServiceBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ reference: z.string().trim().min(4).max(40) }).parse(input),
  )
  .handler(async ({ data }): Promise<BookingSummary | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("service_bookings")
      .select("*")
      .ilike("booking_number", data.reference)
      .maybeSingle();
    if (!booking) return null;

    const { data: items } = await supabaseAdmin
      .from("service_booking_items")
      .select("name, unit_price, quantity, line_total")
      .eq("booking_id", booking.id);

    return {
      booking_number: booking.booking_number,
      full_name: booking.full_name,
      email: booking.email,
      service_date: booking.service_date,
      service_time: booking.service_time,
      street_address: booking.street_address,
      city: booking.city,
      province: booking.province,
      postal_code: booking.postal_code,
      subtotal: Number(booking.subtotal),
      tax_rate: Number(booking.tax_rate),
      tax_amount: Number(booking.tax_amount),
      total: Number(booking.total),
      payment_status: booking.payment_status,
      status: booking.status,
      items: (items ?? []).map((item) => ({
        name: item.name,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        line_total: Number(item.line_total),
      })),
    };
  });
