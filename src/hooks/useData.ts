import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");
      
      return (profiles ?? []).map(p => ({
        ...p,
        role: roles?.find(r => r.user_id === p.user_id)?.role ?? "user",
      }));
    },
  });
}

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDeviceActivations() {
  return useQuery({
    queryKey: ["device-activations-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_activations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch profiles for user names
      const userIds = [...new Set((data ?? []).map((d) => d.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      return (data ?? []).map((d) => ({
        ...d,
        user_name: profiles?.find((p) => p.user_id === d.user_id)?.full_name ||
          profiles?.find((p) => p.user_id === d.user_id)?.email || "—",
      }));
    },
  });
}

export function useConsents() {
  return useQuery({
    queryKey: ["consents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, plans(name, price)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [profiles, devices, consents, subscriptions] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("devices").select("id", { count: "exact", head: true }),
        supabase.from("consents").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      return {
        totalUsers: profiles.count ?? 0,
        totalDevices: devices.count ?? 0,
        totalConsents: consents.count ?? 0,
        activeSubscriptions: subscriptions.count ?? 0,
      };
    },
  });
}
