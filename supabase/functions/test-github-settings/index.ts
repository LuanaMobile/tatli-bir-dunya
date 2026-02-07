import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    const { test_type, token, repo, workflow_file } = body;

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Helper to get setting value (use provided or fetch from DB)
    const getSetting = async (key: string, provided?: string): Promise<string> => {
      if (provided !== undefined && provided !== "") return provided;
      const { data } = await serviceClient
        .from("system_settings")
        .select("value")
        .eq("key", key)
        .single();
      return data?.value || "";
    };

    if (test_type === "token") {
      const ghToken = await getSetting("GITHUB_TOKEN", token);
      if (!ghToken) {
        return new Response(JSON.stringify({ success: false, message: "Token boş" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${ghToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (res.ok) {
        const userData = await res.json();
        return new Response(JSON.stringify({
          success: true,
          message: `Token geçerli! Kullanıcı: ${userData.login}`,
          details: { login: userData.login, scopes: res.headers.get("x-oauth-scopes") },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify({
          success: false,
          message: `Token geçersiz: ${res.status} ${res.statusText}`,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (test_type === "repo") {
      const ghToken = await getSetting("GITHUB_TOKEN", token);
      const ghRepo = await getSetting("GITHUB_REPO", repo);
      if (!ghRepo) {
        return new Response(JSON.stringify({ success: false, message: "Repo boş" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const res = await fetch(`https://api.github.com/repos/${ghRepo}`, {
        headers: { Authorization: `Bearer ${ghToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (res.ok) {
        const repoData = await res.json();
        return new Response(JSON.stringify({
          success: true,
          message: `Repo bulundu: ${repoData.full_name} (${repoData.private ? "Özel" : "Herkese Açık"})`,
          details: { full_name: repoData.full_name, private: repoData.private, default_branch: repoData.default_branch },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify({
          success: false,
          message: `Repo bulunamadı: ${res.status} - Token'ın bu repoya erişimi var mı?`,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (test_type === "workflow") {
      const ghToken = await getSetting("GITHUB_TOKEN", token);
      const ghRepo = await getSetting("GITHUB_REPO", repo);
      const wfFile = await getSetting("GITHUB_WORKFLOW_FILE", workflow_file);
      if (!wfFile) {
        return new Response(JSON.stringify({ success: false, message: "Workflow dosya adı boş" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const res = await fetch(`https://api.github.com/repos/${ghRepo}/actions/workflows/${wfFile}`, {
        headers: { Authorization: `Bearer ${ghToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (res.ok) {
        const wfData = await res.json();
        return new Response(JSON.stringify({
          success: true,
          message: `Workflow bulundu: "${wfData.name}" (${wfData.state})`,
          details: { name: wfData.name, state: wfData.state, path: wfData.path },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify({
          success: false,
          message: `Workflow bulunamadı: ${wfFile} dosyası repo'da mevcut değil`,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid test_type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
