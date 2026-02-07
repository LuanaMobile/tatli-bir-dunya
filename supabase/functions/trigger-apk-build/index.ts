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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is super_admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { config_id } = body;

    if (!config_id) {
      return new Response(JSON.stringify({ error: "config_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch build config
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: config, error: configError } = await serviceClient
      .from("apk_build_configs")
      .select("*")
      .eq("id", config_id)
      .single();

    if (configError || !config) {
      return new Response(JSON.stringify({ error: "Config not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read GitHub settings from system_settings table
    const { data: settingsRows, error: settingsErr } = await serviceClient
      .from("system_settings")
      .select("key, value")
      .in("key", ["GITHUB_TOKEN", "GITHUB_REPO", "GITHUB_WORKFLOW_FILE"]);

    if (settingsErr) throw settingsErr;

    const settingsMap: Record<string, string> = {};
    for (const row of settingsRows || []) {
      settingsMap[row.key] = row.value;
    }

    const githubToken = settingsMap["GITHUB_TOKEN"];
    const githubRepo = settingsMap["GITHUB_REPO"];
    const workflowFile = settingsMap["GITHUB_WORKFLOW_FILE"] || "build-apk.yml";

    if (!githubToken || !githubRepo) {
      return new Response(
        JSON.stringify({ error: "GitHub ayarları yapılandırılmamış. Ayarlar > GitHub / APK sekmesinden girin." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ghResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/actions/workflows/${workflowFile}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: "main",
          inputs: {
            config_id: config.id,
            version: config.version,
            app_name: config.app_name,
            server_url: config.server_url,
            icon_url: config.icon_url || "",
            tracking_id: config.tracking_id || "",
            permissions: JSON.stringify(config.permissions),
            callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/apk-build-callback`,
          },
        }),
      }
    );

    if (!ghResponse.ok) {
      const errText = await ghResponse.text();
      await serviceClient
        .from("apk_build_configs")
        .update({ build_status: "failed", build_log: `GitHub API error: ${errText}` })
        .eq("id", config_id);

      return new Response(
        JSON.stringify({ error: "GitHub Actions trigger failed", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to building
    await serviceClient
      .from("apk_build_configs")
      .update({ build_status: "building" })
      .eq("id", config_id);

    return new Response(
      JSON.stringify({ success: true, message: "Build triggered successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
