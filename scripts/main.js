window.addEventListener('load', async()=>{
if(!(await testConnectionSupabase())) return;
const games=await getGamesCached(); renderGameList(games);
document.getElementById('search-input').oninput=()=>{ const t=search.value.toLowerCase(); renderGameList(allGames.filter(g=>g.Name.toLowerCase().includes(t))); };
});