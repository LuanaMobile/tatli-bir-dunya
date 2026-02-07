
-- System settings table for admin-configurable values (GitHub tokens, etc.)
CREATE TABLE public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  description text,
  is_secret boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only super_admin can CRUD
CREATE POLICY "system_settings_select" ON public.system_settings FOR SELECT USING (is_super_admin());
CREATE POLICY "system_settings_insert" ON public.system_settings FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "system_settings_update" ON public.system_settings FOR UPDATE USING (is_super_admin());
CREATE POLICY "system_settings_delete" ON public.system_settings FOR DELETE USING (is_super_admin());

-- Auto-update timestamp
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default keys
INSERT INTO public.system_settings (key, value, description, is_secret) VALUES
  ('GITHUB_TOKEN', '', 'GitHub Personal Access Token (repo + workflow scope)', true),
  ('GITHUB_REPO', '', 'GitHub repo (owner/repo formatında)', false),
  ('GITHUB_WORKFLOW_FILE', 'build-apk.yml', 'GitHub Actions workflow dosya adı', false),
  ('APK_BUILD_CALLBACK_SECRET', '', 'Callback endpoint güvenlik anahtarı', true);
