import { Truck, Wrench, RecycleIcon, WashingMachine, ShieldCheck } from "lucide-react";

export type ServiceItem = {
  id: string;
  service: string;
  price: string;
  /** numeric value for payment; null means "call for quote" */
  amount: number | null;
  category: string;
  categoryColor: "blue" | "green" | "orange";
  isAddon: boolean; // price prefixed with +
};

function item(
  service: string,
  price: string,
  amount: number | null,
  category: string,
  categoryColor: "blue" | "green" | "orange",
): ServiceItem {
  return {
    id: service.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    service,
    price,
    amount,
    category,
    categoryColor,
    isAddon: price.startsWith("+"),
  };
}

export const ALL_SERVICES: ServiceItem[] = [
  // Delivery
  item("Local Appliance Delivery (1 appliance)", "$109", 109, "Delivery Services", "blue"),
  item("Local Appliance Delivery (2 appliances)", "$159", 159, "Delivery Services", "blue"),
  item("Additional Appliance", "$49", 49, "Delivery Services", "blue"),
  item("Out-of-Town Delivery", "Call for Quote", null, "Delivery Services", "blue"),
  item("Same-Day Delivery", "+$85", 85, "Delivery Services", "blue"),
  item("Next-Day Delivery", "+$65", 65, "Delivery Services", "blue"),

  // Kitchen
  item("Dishwasher Installation", "$279", 279, "Kitchen Appliances", "blue"),
  item("Refrigerator Water Line Connection", "$95", 95, "Kitchen Appliances", "blue"),
  item("Fridge Door Removal & Reinstall", "$69", 69, "Kitchen Appliances", "blue"),
  item("Door Swing Reversal", "$89", 89, "Kitchen Appliances", "blue"),
  item("House Door Removal & Reinstall", "$89", 89, "Kitchen Appliances", "blue"),
  item("Stove / Range Installation (Electric)", "$179", 179, "Kitchen Appliances", "blue"),
  item("Over-the-Range Microwave Installation", "$229", 229, "Kitchen Appliances", "blue"),

  // Special
  item("Extra Man (Heavy Items Over 350 lbs)", "$195", 195, "Special Services", "blue"),
  item("3-Man Delivery Team", "$295", 295, "Special Services", "blue"),
  item("Basement Delivery", "+$75", 75, "Special Services", "blue"),
  item("Third Floor & Above (No Elevator)", "+$75 per floor", 75, "Special Services", "blue"),
  item("Stair Carry (Per Flight)", "+$35", 35, "Special Services", "blue"),
  item("Specific Delivery Window", "+$95", 95, "Special Services", "blue"),

  // Removal
  item("Appliance Disposal / Haul Away", "$55", 55, "Removal & Disposal", "green"),
  item("Disconnect Existing Appliance", "$45", 45, "Removal & Disposal", "green"),
  item("Relocate Appliance Within Home", "$55", 55, "Removal & Disposal", "green"),

  // Washer/Dryer
  item("Washer Installation", "$119", 119, "Washer & Dryer Services", "orange"),
  item("Dryer Installation (Electric)", "$119", 119, "Washer & Dryer Services", "orange"),
  item("Washer & Dryer Pair Installation", "$199", 199, "Washer & Dryer Services", "orange"),
  item("Stackable Washer/Dryer Installation", "$279", 279, "Washer & Dryer Services", "orange"),
  item("LG WashTower Installation", "$279", 279, "Washer & Dryer Services", "orange"),
  item("Pedestal Installation", "$59", 59, "Washer & Dryer Services", "orange"),
  item("Unstack Washer/Dryer", "$79", 79, "Washer & Dryer Services", "orange"),
];

export const CATEGORIES = [
  { label: "All Services",         value: "all" },
  { label: "Delivery Services",    value: "Delivery Services" },
  { label: "Kitchen Appliances",   value: "Kitchen Appliances" },
  { label: "Special Services",     value: "Special Services" },
  { label: "Removal & Disposal",   value: "Removal & Disposal" },
  { label: "Washer & Dryer",       value: "Washer & Dryer Services" },
];

export const CATEGORY_ICONS: Record<string, typeof Truck> = {
  "Delivery Services":    Truck,
  "Kitchen Appliances":   Wrench,
  "Special Services":     ShieldCheck,
  "Removal & Disposal":   RecycleIcon,
  "Washer & Dryer Services": WashingMachine,
};

export const CATEGORY_COLOR: Record<string, string> = {
  "Delivery Services":       "bg-[#1e4d7b]",
  "Kitchen Appliances":      "bg-[#1e4d7b]",
  "Special Services":        "bg-[#1e4d7b]",
  "Removal & Disposal":      "bg-nex-green",
  "Washer & Dryer Services": "bg-nex-orange",
};

export const NOTES = [
  "All deliveries include basic placement of the appliance.",
  "Installation materials are extra unless otherwise specified.",
  "Customer must ensure access paths are clear before delivery.",
  "Elevator bookings are the customer's responsibility.",
  "Appliances over 350 lbs may require additional manpower.",
  "HST is extra on all services.",
  "E-Transfer, Visa, Mastercard and Debit accepted.",
];
