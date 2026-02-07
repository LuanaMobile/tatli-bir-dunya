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
    const contentType = req.headers.get("content-type") || "";
    
    // Expect multipart or raw binary
    const url = new URL(req.url);
    const fileName = url.searchParams.get("filename");
    const configId = url.searchParams.get("config_id");
    const buildSecret = url.searchParams.get("secret");

    if (!fileName || !configId) {
      return new Response(JSON.stringify({ error: "filename and config_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify callback secret
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: secretRow } = await serviceClient
      .from("system_settings")
      .select("value")
      .eq("key", "APK_BUILD_CALLBACK_SECRET")
      .single();

    const callbackSecret = secretRow?.value;
    if (callbackSecret && buildSecret !== callbackSecret) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read the APK binary
    const apkData = await req.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await serviceClient
      .storage
      .from("apk-files")
      .upload(fileName, apkData, {
        contentType: "application/vnd.android.package-archive",
        upsert: true,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: urlData } = serviceClient
      .storage
      .from("apk-files")
      .getPublicUrl(fileName);

    const apkUrl = urlData.publicUrl;

    // Update build config
    await serviceClient
      .from("apk_build_configs")
      .update({ build_status: "success", apk_url: apkUrl })
      .eq("id", configId);

    return new Response(
      JSON.stringify({ success: true, apk_url: apkUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
