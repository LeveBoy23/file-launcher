window.allGames = window.allGames || [];
let currentUserId = null;

async function initApp(){
  const ok = await testConnectionSupabase();
  if(!ok){
    document.getElementById('game-list').innerHTML = '<div style="color:#ff3333;padding:20px">DB connection failed</div>';
    return;
  }
  const games = await getGamesCached();
  window.allGames = games;
  await renderGameList(games);
  populateCategoriesFromGames(games);
  if(typeof buildLeftBar === 'function') buildLeftBar();
  if(typeof recomputeScales === 'function') recomputeScales();
  updateRecentUI();
  bindUIControls();
  console.log('Launcher initialized with', games.length, 'games');
}

if(!window._launcherInited){ window._launcherInited = true; window.addEventListener('load', initApp); }