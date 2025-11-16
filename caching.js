const GAMES_CACHE_KEY='games_cache_v1';
const GAMES_CACHE_TIME_KEY='games_cache_time_v1';
const GAMES_CACHE_TTL=900000;
let allGames=[]; let _fetchPromise=null;
function invalidateGamesCache(){localStorage.removeItem(GAMES_CACHE_KEY);localStorage.removeItem(GAMES_CACHE_TIME_KEY);}
async function getGamesCached({force=false}={}){ if(!force&&allGames.length)return allGames;
const raw=localStorage.getItem(GAMES_CACHE_KEY); const t=parseInt(localStorage.getItem(GAMES_CACHE_TIME_KEY)||'0',10);
if(!force&&raw&&t&&(Date.now()-t)<GAMES_CACHE_TTL){ try{allGames=JSON.parse(raw);return allGames;}catch{}}
if(_fetchPromise) return _fetchPromise;
_fetchPromise=(async()=>{ const data=await fetchAllGames(); allGames=data||[]; localStorage.setItem(GAMES_CACHE_KEY,JSON.stringify(allGames)); localStorage.setItem(GAMES_CACHE_TIME_KEY,String(Date.now())); return allGames; })();
return _fetchPromise;}