CREATE TABLE public.appliance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  price numeric NOT NULL DEFAULT 0,
  pricing_rule text NOT NULL DEFAULT 'flat',
  unit_label text,
  requires_quote boolean NOT NULL DEFAULT false,
  allow_quantity boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.appliance_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appliance_services TO authenticated;
GRANT ALL ON public.appliance_services TO service_role;
ALTER TABLE public.appliance_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appliance services public read" ON public.appliance_services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "staff manage appliance services" ON public.appliance_services FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER appliance_services_updated BEFORE UPDATE ON public.appliance_services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.service_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text NOT NULL UNIQUE DEFAULT ('NX-' || upper(substr(md5(gen_random_uuid()::text), 1, 8))),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  street_address text,
  city text,
  province text,
  postal_code text,
  service_date date,
  service_time text,
  delivery_instructions text,
  notes text,
  pickup_location text,
  delivery_address text,
  appliance_count integer,
  appliance_type text,
  appliance_brand text,
  appliance_model text,
  remove_existing boolean NOT NULL DEFAULT false,
  subtotal numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 13,
  tax_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CAD',
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_reference text,
  payment_intent text,
  paid_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_bookings TO authenticated;
GRANT ALL ON public.service_bookings TO service_role;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage service bookings" ON public.service_bookings FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER service_bookings_updated BEFORE UPDATE ON public.service_bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.service_booking_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.appliance_services(id) ON DELETE SET NULL,
  name text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  quantity numeric NOT NULL DEFAULT 1,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_booking_items TO authenticated;
GRANT ALL ON public.service_booking_items TO service_role;
ALTER TABLE public.service_booking_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage service booking items" ON public.service_booking_items FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

ALTER TABLE public.payments ADD COLUMN service_booking_id uuid REFERENCES public.service_bookings(id) ON DELETE SET NULL;

INSERT INTO public.site_content (key, label, value, group_name)
VALUES ('hst_rate', 'HST / tax rate (%)', '13', 'pricing')
ON CONFLICT DO NOTHING;

INSERT INTO public.appliance_services (slug, name, description, category, price, pricing_rule, unit_label, requires_quote, allow_quantity, sort_order) VALUES
('local-delivery-1','Local Appliance Delivery (1 appliance)','Local delivery of one appliance including basic placement.','Delivery Services',109,'flat',NULL,false,false,10),
('local-delivery-2','Local Appliance Delivery (2 appliances)','Local delivery of two appliances including basic placement.','Delivery Services',159,'flat',NULL,false,false,20),
('additional-appliance','Additional Appliance','Each additional appliance added to your delivery.','Delivery Services',49,'per_unit','appliance',false,true,30),
('out-of-town-delivery','Out-of-Town Delivery','Delivery outside our local zone. Call for quote.','Delivery Services',0,'quote',NULL,true,false,40),
('same-day-delivery','Same-Day Delivery','Priority same-day delivery surcharge.','Delivery Services',85,'flat',NULL,false,false,50),
('next-day-delivery','Next-Day Delivery','Next-day delivery surcharge.','Delivery Services',65,'flat',NULL,false,false,60),
('appliance-disposal','Appliance Disposal / Haul Away','We remove and responsibly dispose of your old appliance.','Removal & Disposal',55,'per_unit','appliance',false,true,70),
('disconnect-existing','Disconnect Existing Appliance','Safe disconnection of your existing appliance.','Removal & Disposal',45,'per_unit','appliance',false,true,80),
('relocate-appliance','Relocate Appliance Within Home','Move an appliance from one room to another.','Removal & Disposal',55,'per_unit','appliance',false,true,90),
('dishwasher-installation','Dishwasher Installation','Full dishwasher installation by a trained technician.','Kitchen Appliances',279,'per_unit','unit',false,true,100),
('fridge-water-line','Refrigerator Water Line Connection','Connection of the refrigerator water line.','Kitchen Appliances',95,'per_unit','unit',false,true,110),
('fridge-door-removal','Fridge Door Removal & Reinstall','Doors removed and refitted for tight access.','Kitchen Appliances',69,'per_unit','unit',false,true,120),
('door-swing-reversal','Door Swing Reversal','Reverse the appliance door swing direction.','Kitchen Appliances',89,'per_unit','unit',false,true,130),
('house-door-removal','House Door Removal & Reinstall','House doors removed and reinstalled for access.','Kitchen Appliances',89,'per_unit','door',false,true,140),
('stove-installation','Stove / Range Installation (Electric)','Electric stove or range installation.','Kitchen Appliances',179,'per_unit','unit',false,true,150),
('otr-microwave-installation','Over-the-Range Microwave Installation','Over-the-range microwave mounting and installation.','Kitchen Appliances',229,'per_unit','unit',false,true,160),
('washer-installation','Washer Installation','Washer hook-up and installation.','Washer & Dryer Services',119,'per_unit','unit',false,true,170),
('dryer-installation','Dryer Installation (Electric)','Electric dryer hook-up and installation.','Washer & Dryer Services',119,'per_unit','unit',false,true,180),
('washer-dryer-pair','Washer & Dryer Pair Installation','Installation of a washer and dryer pair.','Washer & Dryer Services',199,'flat',NULL,false,false,190),
('stackable-installation','Stackable Washer/Dryer Installation','Stacking and installation of a washer/dryer set.','Washer & Dryer Services',279,'flat',NULL,false,false,200),
('lg-washtower-installation','LG WashTower Installation','Specialist LG WashTower installation.','Washer & Dryer Services',279,'flat',NULL,false,false,210),
('pedestal-installation','Pedestal Installation','Laundry pedestal fitting.','Washer & Dryer Services',59,'per_unit','pedestal',false,true,220),
('unstack-washer-dryer','Unstack Washer/Dryer','Separate a stacked washer and dryer.','Washer & Dryer Services',79,'flat',NULL,false,false,230),
('extra-man','Extra Man (Heavy Items Over 350 lbs)','Additional crew member for heavy items over 350 lbs.','Special Services',195,'flat',NULL,false,false,240),
('three-man-team','3-Man Delivery Team','A three-person delivery team.','Special Services',295,'flat',NULL,false,false,250),
('basement-delivery','Basement Delivery','Delivery into a basement.','Special Services',75,'flat',NULL,false,false,260),
('third-floor-above','Third Floor & Above (No Elevator)','Charged per floor above the second where there is no elevator.','Special Services',75,'per_floor','floor',false,true,270),
('stair-carry','Stair Carry (Per Flight)','Charged per flight of stairs carried.','Special Services',35,'per_flight','flight',false,true,280),
('specific-delivery-window','Specific Delivery Window','Guaranteed specific delivery time window.','Special Services',95,'flat',NULL,false,false,290);