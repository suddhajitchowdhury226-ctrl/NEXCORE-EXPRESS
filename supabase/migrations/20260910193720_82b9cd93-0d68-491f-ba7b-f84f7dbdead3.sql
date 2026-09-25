-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','staff','customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'));
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self or staff" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CUSTOMERS
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text,
  address_line text,
  city text,
  province text,
  postal_code text,
  country text NOT NULL DEFAULT 'Canada',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage customers" ON public.customers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "customer reads own record" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  short_description text NOT NULL,
  long_description text,
  icon text NOT NULL DEFAULT 'truck',
  image_url text,
  category text NOT NULL DEFAULT 'moving',
  base_price numeric(10,2),
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICE AREAS
CREATE TABLE public.service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  province text,
  country text NOT NULL DEFAULT 'Canada',
  postal_prefixes text[] NOT NULL DEFAULT '{}',
  latitude numeric(9,6),
  longitude numeric(9,6),
  radius_km int NOT NULL DEFAULT 80,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_areas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_areas TO authenticated;
GRANT ALL ON public.service_areas TO service_role;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "areas public read" ON public.service_areas FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage areas" ON public.service_areas FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER areas_updated BEFORE UPDATE ON public.service_areas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SITE CONTENT
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  value text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff manage content" ON public.site_content FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- QUOTES
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('QT-' || upper(substr(md5(gen_random_uuid()::text),1,8))),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text,
  pickup_address text NOT NULL,
  pickup_city text,
  pickup_latitude numeric(9,6),
  pickup_longitude numeric(9,6),
  destination_address text NOT NULL,
  destination_city text,
  destination_latitude numeric(9,6),
  destination_longitude numeric(9,6),
  moving_date date,
  service_type text NOT NULL,
  property_type text,
  property_details text,
  shipment_details text,
  additional_requirements text,
  message text,
  status text NOT NULL DEFAULT 'new',
  quoted_amount numeric(10,2),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quotes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits quote" ON public.quotes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "staff manage quotes" ON public.quotes FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER quotes_updated BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('EN-' || upper(substr(md5(gen_random_uuid()::text),1,8))),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  enquiry_type text NOT NULL DEFAULT 'General',
  message text NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "staff manage enquiries" ON public.enquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER enquiries_updated BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text NOT NULL UNIQUE DEFAULT ('BK-' || upper(substr(md5(gen_random_uuid()::text),1,8))),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  pickup_address text NOT NULL,
  destination_address text NOT NULL,
  scheduled_date date,
  scheduled_time text,
  crew_size int,
  requirements text,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SHIPMENTS
CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text NOT NULL UNIQUE,
  order_number text UNIQUE,
  reference text,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  origin_address text NOT NULL,
  origin_city text,
  origin_latitude numeric(9,6),
  origin_longitude numeric(9,6),
  destination_address text NOT NULL,
  destination_city text,
  destination_latitude numeric(9,6),
  destination_longitude numeric(9,6),
  current_location text,
  current_latitude numeric(9,6),
  current_longitude numeric(9,6),
  status text NOT NULL DEFAULT 'booked',
  progress_percent int NOT NULL DEFAULT 0,
  vehicle text,
  crew_size int,
  pickup_date date,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage shipments" ON public.shipments FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER shipments_updated BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX shipments_lookup_idx ON public.shipments (tracking_number, order_number, reference);

-- TRACKING EVENTS
CREATE TABLE public.tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status text NOT NULL,
  description text,
  location text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  event_time timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_events TO authenticated;
GRANT ALL ON public.tracking_events TO service_role;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage tracking events" ON public.tracking_events FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- INVOICES
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT current_date,
  due_date date,
  currency text NOT NULL DEFAULT 'CAD',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 13,
  tax_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  amount_paid numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- PAYMENTS
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CAD',
  method text NOT NULL DEFAULT 'card',
  provider text NOT NULL DEFAULT 'manual',
  provider_reference text,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PUBLIC TRACKING LOOKUP (no PII exposed)
CREATE OR REPLACE FUNCTION public.track_shipment(_ref text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.shipments%ROWTYPE; b public.bookings%ROWTYPE; result jsonb;
BEGIN
  IF _ref IS NULL OR length(trim(_ref)) < 4 THEN RETURN NULL; END IF;
  SELECT * INTO s FROM public.shipments
   WHERE upper(tracking_number) = upper(trim(_ref))
      OR upper(coalesce(order_number,'')) = upper(trim(_ref))
      OR upper(coalesce(reference,'')) = upper(trim(_ref))
   LIMIT 1;
  IF NOT FOUND THEN
    SELECT * INTO b FROM public.bookings WHERE upper(booking_number) = upper(trim(_ref)) LIMIT 1;
    IF FOUND THEN SELECT * INTO s FROM public.shipments WHERE booking_id = b.id LIMIT 1; END IF;
  END IF;
  IF s.id IS NULL THEN RETURN NULL; END IF;
  SELECT jsonb_build_object(
    'tracking_number', s.tracking_number,
    'order_number', s.order_number,
    'reference', s.reference,
    'status', s.status,
    'progress_percent', s.progress_percent,
    'origin', s.origin_address,
    'origin_city', s.origin_city,
    'destination', s.destination_address,
    'destination_city', s.destination_city,
    'current_location', s.current_location,
    'current_latitude', s.current_latitude,
    'current_longitude', s.current_longitude,
    'vehicle', s.vehicle,
    'crew_size', s.crew_size,
    'pickup_date', s.pickup_date,
    'estimated_delivery', s.estimated_delivery,
    'delivered_at', s.delivered_at,
    'events', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'status', e.status, 'description', e.description,
        'location', e.location, 'event_time', e.event_time
      ) ORDER BY e.event_time DESC)
      FROM public.tracking_events e WHERE e.shipment_id = s.id
    ), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END; $$;
GRANT EXECUTE ON FUNCTION public.track_shipment(text) TO anon, authenticated;

-- SEED CONTENT
INSERT INTO public.services (slug, title, short_description, long_description, icon, category, sort_order) VALUES
('residential-moving','Residential Moving','Door-to-door home moves with professional crews.','From studio apartments to detached family homes, our in-house crews handle packing, loading, transport and placement. Every residential move includes protective wrapping, floor protection and a dedicated move coordinator.','truck','moving',1),
('commercial-moving','Commercial Moving','Zero-downtime logistics for growing businesses.','Warehouse, retail and industrial relocations planned around your operating hours. We sequence the move so your business keeps trading, with asset inventories and after-hours crews.','package-check','moving',2),
('office-relocation','Office Relocation','Floor plans, IT assets and desks, mapped end to end.','Desk-by-desk labelling, IT disconnect and reconnect coordination, secure document transfer and full floor-plan mapping so your team sits down and starts working.','earth','moving',3),
('packing-services','Packing Services','Professional-grade materials and trained packers.','Full or partial packing with double-wall cartons, custom crating for fragile items and a complete unpacking service at destination.','shield-check','support',4),
('storage-solutions','Storage Solutions','Climate-controlled, inventory tracked to the item.','Short and long-term storage in monitored, climate-controlled facilities. Every item is barcoded and inventoried so you know exactly what is in store.','clock','support',5),
('specialty-moving','Specialty Moving','Pianos, art and fragile heirlooms handled with care.','Pianos, safes, fine art, antiques and laboratory equipment moved by specialist crews with custom crating, rigging and climate-controlled transport.','zap','moving',6);

INSERT INTO public.service_areas (name, province, country, latitude, longitude, sort_order, notes) VALUES
('Toronto','ON','Canada',43.653226,-79.383184,1,'Greater Toronto Area including Mississauga, Brampton and Markham.'),
('Ottawa','ON','Canada',45.421530,-75.697193,2,'Ottawa–Gatineau region.'),
('Montréal','QC','Canada',45.501689,-73.567256,3,'Greater Montréal and the South Shore.'),
('Calgary','AB','Canada',51.044733,-114.071883,4,'Calgary and southern Alberta corridor.'),
('Vancouver','BC','Canada',49.282730,-123.120735,5,'Metro Vancouver and the Fraser Valley.'),
('Cross-border USA','','United States',43.000000,-79.000000,6,'Canada–USA cross-border moving and freight.');

INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How do I get a quote?','Complete the Get a Quote form with your pickup and destination addresses, moving date and service type. A move coordinator reviews it and replies with written pricing.','Quotes',1),
('How is my move priced?','Pricing is based on distance, volume, crew size, access at both addresses and any specialty items. Your written quote is the price you pay unless the scope changes.','Quotes',2),
('Can I track my move?','Yes. Every booked move receives a tracking number. Enter it on the Track Shipment page to see current status, route and the full status history.','Tracking',3),
('Which areas do you serve?','We operate across Toronto, Ottawa, Montréal, Calgary and Vancouver, with cross-border service between Canada and the United States.','Service areas',4),
('Do you supply packing materials?','Yes. Cartons, wrapping, custom crates and full packing labour can be added to any move.','Services',5),
('Is my move insured?','All moves carry standard transit liability coverage. Extended valuation cover can be added before your move date.','Services',6),
('How do I pay?','Invoices are issued electronically. Payment status, history and receipts are tracked against your account.','Payments',7),
('How far in advance should I book?','Two to four weeks is ideal for residential moves. Commercial and cross-border moves are best booked four to six weeks ahead.','Bookings',8);

INSERT INTO public.site_content (key, label, value, group_name) VALUES
('company_phone','Phone number','+1 (800) NEX-CORE','contact'),
('company_phone_link','Phone dial link','18006392673','contact'),
('company_email','Email address','hello@nexcoreexpress.com','contact'),
('company_address','Head office','Toronto, ON, Canada','contact'),
('announcement','Top announcement bar','Moving across Canada & the USA','general'),
('hero_title','Hero heading','Moving made simple.','home'),
('hero_subtitle','Hero subheading','Reliable moving, freight and cross-border logistics across Canada and the United States.','home'),
('stat_moves','Moves completed','20,271+','home'),
('stat_rating','Customer rating','4.0/5','home'),
('stat_ontime','On-time rate','79%','home'),
('stat_experience','Years experience','10 yrs','home');