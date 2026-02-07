
-- APK Build Configurations table
CREATE TABLE public.apk_build_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  app_name TEXT NOT NULL DEFAULT 'ClearHuma',
  server_url TEXT NOT NULL,
  icon_url TEXT,
  splash_url TEXT,
  tracking_id TEXT,
  permissions JSONB NOT NULL DEFAULT '["INTERNET","ACCESS_NETWORK_STATE"]'::jsonb,
  extra_config JSONB DEFAULT '{}'::jsonb,
  build_status TEXT NOT NULL DEFAULT 'pending',
  build_log TEXT,
  apk_url TEXT,
  github_run_id TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.apk_build_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apk_build_configs_select" ON public.apk_build_configs
  FOR SELECT USING (is_super_admin());

CREATE POLICY "apk_build_configs_insert" ON public.apk_build_configs
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "apk_build_configs_update" ON public.apk_build_configs
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "apk_build_configs_delete" ON public.apk_build_configs
  FOR DELETE USING (is_super_admin());

CREATE TRIGGER update_apk_build_configs_updated_at
  BEFORE UPDATE ON public.apk_build_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
