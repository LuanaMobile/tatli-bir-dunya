
-- Allow all authenticated users to read successful APK builds (for download)
CREATE POLICY "authenticated_users_can_view_successful_builds"
ON public.apk_build_configs
FOR SELECT
USING (build_status = 'success' AND apk_url IS NOT NULL);
