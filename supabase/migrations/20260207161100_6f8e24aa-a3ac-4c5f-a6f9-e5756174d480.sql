
-- APK versions table (admin manages)
CREATE TABLE public.apk_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  file_url text,
  file_size text,
  min_android text DEFAULT 'Android 8.0',
  release_notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.apk_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apk_versions_select" ON public.apk_versions FOR SELECT USING (true);
CREATE POLICY "apk_versions_insert" ON public.apk_versions FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "apk_versions_update" ON public.apk_versions FOR UPDATE USING (is_super_admin());
CREATE POLICY "apk_versions_delete" ON public.apk_versions FOR DELETE USING (is_super_admin());

-- APK download tracking per user
CREATE TABLE public.apk_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  apk_version_id uuid REFERENCES public.apk_versions(id) ON DELETE CASCADE,
  download_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  downloaded_at timestamptz,
  installed_at timestamptz,
  device_info jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.apk_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apk_downloads_select" ON public.apk_downloads FOR SELECT 
  USING (is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "apk_downloads_insert" ON public.apk_downloads FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apk_downloads_update" ON public.apk_downloads FOR UPDATE 
  USING (is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "apk_downloads_delete" ON public.apk_downloads FOR DELETE 
  USING (is_super_admin());

-- Storage bucket for APK files
INSERT INTO storage.buckets (id, name, public) VALUES ('apk-files', 'apk-files', true);

CREATE POLICY "apk_files_select" ON storage.objects FOR SELECT USING (bucket_id = 'apk-files');
CREATE POLICY "apk_files_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'apk-files' AND public.is_super_admin());
CREATE POLICY "apk_files_delete" ON storage.objects FOR DELETE USING (bucket_id = 'apk-files' AND public.is_super_admin());

-- Trigger for updated_at
CREATE TRIGGER update_apk_versions_updated_at
  BEFORE UPDATE ON public.apk_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
