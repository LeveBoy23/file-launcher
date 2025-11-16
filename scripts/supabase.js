const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_ANON_KEY = 'YOUR_KEY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function testConnectionSupabase(){ const {error}=await supabaseClient.from('Files').select('id').limit(1); return !error;}
async function fetchAllGames(){ const {data,error}=await supabaseClient.from('Files').select('*'); if(error)throw error; return data||[];}