DROP POLICY "services public read" ON public.services;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY "areas public read" ON public.service_areas;
CREATE POLICY "areas public read" ON public.service_areas FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY "faqs public read" ON public.faqs;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true);

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;