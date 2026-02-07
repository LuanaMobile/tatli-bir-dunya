
-- Device activations table: unique activation codes per user
CREATE TABLE public.device_activations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activation_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(gen_random_uuid()::text), 1, 8),
  device_name TEXT,
  device_info JSONB,
  is_activated BOOLEAN NOT NULL DEFAULT false,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days')
);

-- Enable RLS
ALTER TABLE public.device_activations ENABLE ROW LEVEL SECURITY;

-- Users can view their own activation codes
CREATE POLICY "Users can view own activations"
ON public.device_activations FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own activation codes
CREATE POLICY "Users can create own activations"
ON public.device_activations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own activations
CREATE POLICY "Users can update own activations"
ON public.device_activations FOR UPDATE
USING (auth.uid() = user_id);

-- Super admins can view all activations
CREATE POLICY "Super admins can view all activations"
ON public.device_activations FOR SELECT
USING (public.is_super_admin());

-- Super admins can manage all activations
CREATE POLICY "Super admins can manage all activations"
ON public.device_activations FOR ALL
USING (public.is_super_admin());

-- Index for fast code lookups
CREATE INDEX idx_device_activations_code ON public.device_activations(activation_code);
CREATE INDEX idx_device_activations_user ON public.device_activations(user_id);
