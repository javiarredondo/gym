// Vercel Cron: una vez por día hace unas lecturas a Supabase para que el proyecto gratis no se pause por inactividad.
const SUPABASE_URL = "https://mvhyzbhveathjsqkvhgl.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aHl6Ymh2ZWF0aGpzcWt2aGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTc5NDYsImV4cCI6MjEwMjg5Mzk0Nn0.iANXf-9VNPHdYaJKR8PO8fCniUY7RCl3w-2O55ctjj4";

export default async function handler(req, res) {
  // Si definís CRON_SECRET en Vercel, solo se acepta la llamada del cron.
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ ok: false });
  }
  const results = [];
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/kv_store?select=key&limit=5`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      });
      results.push(r.status);
    } catch (e) {
      results.push(String(e && e.message ? e.message : e));
    }
  }
  const ok = results.every((x) => x === 200);
  return res.status(ok ? 200 : 502).json({ ok, results, at: new Date().toISOString() });
}
