CREATE OR REPLACE FUNCTION public.submit_quote(_payload jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _ref text;
BEGIN
  IF coalesce(trim(_payload->>'full_name'),'') = ''
     OR coalesce(trim(_payload->>'email'),'') = ''
     OR coalesce(trim(_payload->>'pickup_address'),'') = ''
     OR coalesce(trim(_payload->>'destination_address'),'') = ''
     OR coalesce(trim(_payload->>'service_type'),'') = '' THEN
    RAISE EXCEPTION 'Missing required quote fields';
  END IF;

  INSERT INTO public.quotes (
    full_name, company_name, email, phone,
    pickup_address, pickup_city, destination_address, destination_city,
    moving_date, service_type, property_type, property_details,
    shipment_details, additional_requirements, message
  ) VALUES (
    left(trim(_payload->>'full_name'), 200),
    nullif(trim(coalesce(_payload->>'company_name','')), ''),
    left(trim(_payload->>'email'), 200),
    nullif(trim(coalesce(_payload->>'phone','')), ''),
    left(trim(_payload->>'pickup_address'), 500),
    nullif(trim(coalesce(_payload->>'pickup_city','')), ''),
    left(trim(_payload->>'destination_address'), 500),
    nullif(trim(coalesce(_payload->>'destination_city','')), ''),
    nullif(_payload->>'moving_date','')::date,
    left(trim(_payload->>'service_type'), 120),
    nullif(trim(coalesce(_payload->>'property_type','')), ''),
    nullif(trim(coalesce(_payload->>'property_details','')), ''),
    nullif(trim(coalesce(_payload->>'shipment_details','')), ''),
    nullif(trim(coalesce(_payload->>'additional_requirements','')), ''),
    nullif(trim(coalesce(_payload->>'message','')), '')
  ) RETURNING reference INTO _ref;

  RETURN _ref;
END; $$;

CREATE OR REPLACE FUNCTION public.submit_enquiry(_payload jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _ref text;
BEGIN
  IF coalesce(trim(_payload->>'name'),'') = ''
     OR coalesce(trim(_payload->>'email'),'') = ''
     OR coalesce(trim(_payload->>'subject'),'') = ''
     OR coalesce(trim(_payload->>'message'),'') = '' THEN
    RAISE EXCEPTION 'Missing required enquiry fields';
  END IF;

  INSERT INTO public.enquiries (name, email, phone, subject, enquiry_type, message, location)
  VALUES (
    left(trim(_payload->>'name'), 200),
    left(trim(_payload->>'email'), 200),
    nullif(trim(coalesce(_payload->>'phone','')), ''),
    left(trim(_payload->>'subject'), 200),
    coalesce(nullif(trim(coalesce(_payload->>'enquiry_type','')), ''), 'General'),
    left(trim(_payload->>'message'), 5000),
    nullif(trim(coalesce(_payload->>'location','')), '')
  ) RETURNING reference INTO _ref;

  RETURN _ref;
END; $$;

REVOKE ALL ON FUNCTION public.submit_quote(jsonb) FROM public;
REVOKE ALL ON FUNCTION public.submit_enquiry(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_quote(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(jsonb) TO anon, authenticated;