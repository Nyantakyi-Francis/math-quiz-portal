// Read-only database request. No service-role key or learner credentials needed.
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!baseUrl || !apiKey) {
  console.error('Missing Supabase health-check URL or public API key.');
  process.exit(1);
}

const endpoint = new URL('/rest/v1/modules?select=id&limit=1', baseUrl);
if (endpoint.protocol !== 'https:') {
  console.error('The Supabase health-check URL must use HTTPS.');
  process.exit(1);
}

let healthy = false;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const response = await fetch(endpoint, {
      headers: { apikey: apiKey },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      throw new Error(`Database API returned HTTP ${response.status}.`);
    }
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Unexpected database response.');
    // RLS can return an empty array for anonymous users; that is expected.
    console.log('Database read succeeded. No data was changed.');
    healthy = true;
    break;
  } catch (error) {
    console.error(`Attempt ${attempt} failed: ${error.message}`);
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  }
}
if (!healthy) process.exitCode = 1;
