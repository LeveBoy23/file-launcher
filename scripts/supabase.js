const SUPABASE_URL = 'https://pdqddhumgcjpzxjmzval.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcWRkaHVtZ2NqcHp4am16dmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk5ODMsImV4cCI6MjA2NTc1NTk4M30.cYVCjH960p_zBqLN7zhWpK8XI0s8PrZJwP5UL0lWEr4';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function testConnectionSupabase(){ const {error}=await supabaseClient.from('Files').select('id').limit(1); return !error;}
async function fetchAllGames(){ const {data,error}=await supabaseClient.from('Files').select('*'); if(error)throw error; return data||[];}
