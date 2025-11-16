// mygames.js - simple UI for the My Games slide panel
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id==='mygames-btn'){
    document.getElementById('mygames-panel').classList.add('open');
    document.getElementById('mygames-panel').setAttribute('aria-hidden','false');
    renderMyGamesTab('favorites');
  }
  if(e.target && e.target.id==='close-mygames'){
    document.getElementById('mygames-panel').classList.remove('open');
    document.getElementById('mygames-panel').setAttribute('aria-hidden','true');
  }
  if(e.target && e.target.classList.contains('mg-tab')){
    document.querySelectorAll('.mg-tab').forEach(t=>t.classList.remove('active'));
    e.target.classList.add('active');
    renderMyGamesTab(e.target.dataset.tab);
  }
});

function renderMyGamesTab(tab){
  const container = document.getElementById('mygames-content');
  container.innerHTML = '<div style="color:var(--muted);padding:8px">Loading...</div>';
  if(tab==='favorites'){
    const fav = JSON.parse(localStorage.getItem('game_favorites')||'[]');
    const games = (window.allGames||[]).filter(g=>fav.includes(g.id));
    container.innerHTML=''; games.forEach(g=>{ const el = document.createElement('div'); el.className='mygame-card'; el.innerHTML=`<img src='${g.icon_url||"assets/images/game_1.svg"}' style='width:64px;height:64px;border-radius:8px;margin-right:8px'><div>${g.Name||'Untitled'}</div>`; container.appendChild(el); });
  }else if(tab==='recents'){
    const recent = JSON.parse(localStorage.getItem('recent_games')||'[]');
    container.innerHTML=''; recent.forEach(id=>{ const g=(window.allGames||[]).find(x=>x.id==id); if(g){ const el=document.createElement('div'); el.className='mygame-card'; el.innerHTML=`<img src='${g.icon_url||"assets/images/game_1.svg"}' style='width:64px;height:64px;border-radius:8px;margin-right:8px'><div>${g.Name||'Untitled'}</div>`; container.appendChild(el); } });
  }else if(tab==='liked'){
    const liked = JSON.parse(localStorage.getItem('liked_games')||'[]');
    container.innerHTML=''; liked.forEach(id=>{ const g=(window.allGames||[]).find(x=>x.id==id); if(g){ const el=document.createElement('div'); el.className='mygame-card'; el.innerHTML=`<img src='${g.icon_url||"assets/images/game_1.svg"}' style='width:64px;height:64px;border-radius:8px;margin-right:8px'><div>${g.Name||'Untitled'}</div>`; container.appendChild(el); } });
  }
}