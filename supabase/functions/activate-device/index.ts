import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { action, activation_code, device_name, device_info } = await req.json();

    // Action: validate - check code and return user session
    if (action === "validate") {
      if (!activation_code) {
        return new Response(
          JSON.stringify({ error: "Aktivasyon kodu gerekli" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: activation, error } = await supabase
        .from("device_activations")
        .select("*")
        .eq("activation_code", activation_code.trim().toLowerCase())
        .single();

      if (error || !activation) {
        return new Response(
          JSON.stringify({ error: "Geçersiz aktivasyon kodu" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check expiration
      if (new Date(activation.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "Aktivasyon kodunun süresi dolmuş" }),
          { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark as activated
      await supabase
        .from("device_activations")
        .update({
          is_activated: true,
          activated_at: new Date().toISOString(),
          device_name: device_name || null,
          device_info: device_info || null,
        })
        .eq("id", activation.id);

      // Get user profile info
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", activation.user_id)
        .single();

      // Generate a magic link for the user to sign in on the device
      const { data: userData } = await supabase.auth.admin.getUserById(activation.user_id);
      
      if (!userData?.user?.email) {
        return new Response(
          JSON.stringify({ error: "Kullanıcı bulunamadı" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate magic link for auto-login
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: userData.user.email,
      });

      if (linkError) {
        return new Response(
          JSON.stringify({ error: "Oturum oluşturulamadı" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user_id: activation.user_id,
          profile_name: profile?.full_name || profile?.email || "Kullanıcı",
          // Return the hashed token so the client can verify OTP
          token_hash: linkData.properties?.hashed_token,
          email: userData.user.email,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: generate - create a new activation code (requires auth)
    if (action === "generate") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Yetkilendirme gerekli" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Geçersiz oturum" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate unique 8-char code
      const code = Math.random().toString(36).substring(2, 10).toLowerCase();

      const { data: newActivation, error: insertError } = await supabase
        .from("device_activations")
        .insert({
          user_id: user.id,
          activation_code: code,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        return new Response(
          JSON.stringify({ error: "Kod oluşturulamadı" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, activation: newActivation }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Geçersiz işlem" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Sunucu hatası", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
