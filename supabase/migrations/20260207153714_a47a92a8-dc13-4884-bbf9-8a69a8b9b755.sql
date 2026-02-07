
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'guardian', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  guardian_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'monthly',
  user_limit INTEGER NOT NULL DEFAULT 1,
  device_limit INTEGER NOT NULL DEFAULT 1,
  data_retention_days INTEGER NOT NULL DEFAULT 30,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Devices table
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT,
  os_version TEXT,
  serial_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  guardian_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consents table
CREATE TABLE public.consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE RESTRICT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  invoice_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Helper function: has_role (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is_super_admin shortcut
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'super_admin')
$$;

-- Helper: is_guardian shortcut
CREATE OR REPLACE FUNCTION public.is_guardian()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'guardian')
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consents_updated_at BEFORE UPDATE ON public.consents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  -- Default role: user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== RLS POLICIES =====

-- PROFILES
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- USER_ROLES
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "user_roles_insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
CREATE POLICY "user_roles_update" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.is_super_admin());
CREATE POLICY "user_roles_delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- PLANS (everyone can read, only admins manage)
CREATE POLICY "plans_select" ON public.plans FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "plans_insert" ON public.plans FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
CREATE POLICY "plans_update" ON public.plans FOR UPDATE TO authenticated
  USING (public.is_super_admin());
CREATE POLICY "plans_delete" ON public.plans FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- DEVICES
CREATE POLICY "devices_select" ON public.devices FOR SELECT TO authenticated
  USING (public.is_super_admin() OR guardian_id = auth.uid() OR assigned_user_id = auth.uid());
CREATE POLICY "devices_insert" ON public.devices FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin() OR (public.is_guardian() AND guardian_id = auth.uid()));
CREATE POLICY "devices_update" ON public.devices FOR UPDATE TO authenticated
  USING (public.is_super_admin() OR (public.is_guardian() AND guardian_id = auth.uid()));
CREATE POLICY "devices_delete" ON public.devices FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- CONSENTS
CREATE POLICY "consents_select" ON public.consents FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "consents_insert" ON public.consents FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "consents_update" ON public.consents FOR UPDATE TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "consents_delete" ON public.consents FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- AUDIT_LOGS
CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS
CREATE POLICY "subscriptions_select" ON public.subscriptions FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
CREATE POLICY "subscriptions_update" ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.is_super_admin());
CREATE POLICY "subscriptions_delete" ON public.subscriptions FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- INVOICES
CREATE POLICY "invoices_select" ON public.invoices FOR SELECT TO authenticated
  USING (public.is_super_admin() OR auth.uid() = user_id);
CREATE POLICY "invoices_insert" ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
CREATE POLICY "invoices_update" ON public.invoices FOR UPDATE TO authenticated
  USING (public.is_super_admin());
CREATE POLICY "invoices_delete" ON public.invoices FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_devices_guardian_id ON public.devices(guardian_id);
CREATE INDEX idx_devices_assigned_user ON public.devices(assigned_user_id);
CREATE INDEX idx_consents_user_id ON public.consents(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);

-- Insert default plans
INSERT INTO public.plans (name, price, period, user_limit, device_limit, data_retention_days, features) VALUES
  ('Free', 0, 'monthly', 1, 1, 7, '["Temel izleme", "1 cihaz"]'::jsonb),
  ('Trial', 0, 'monthly', 3, 3, 14, '["SMS okuma", "Arama kayıtları", "Konum takibi"]'::jsonb),
  ('Premium', 149, 'monthly', 5, 10, 90, '["SMS okuma", "Arama kayıtları", "Keylogger", "Sosyal medya", "Konum takibi", "Öncelikli destek"]'::jsonb),
  ('Enterprise', 499, 'monthly', 50, 100, 365, '["Tüm özellikler", "API erişimi", "Özel raporlama", "7/24 destek", "SLA garantisi"]'::jsonb);
