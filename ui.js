function createGameCard(game){
const btn=document.createElement('button'); btn.className='game-button'; btn.dataset.id=game.id;
btn.innerHTML=`<div>${(game.Name||'').replace(/</g,'&lt;')}</div>`;
btn.onclick=()=>openGame(game); return btn;}
async function renderGameList(g){ const c=document.getElementById('game-list'); c.innerHTML=''; g.forEach(x=>c.appendChild(createGameCard(x))); }
function openGame(game){ const p=document.getElementById('preview-container'); p.querySelectorAll('iframe').forEach(e=>e.remove());
const f=document.createElement('iframe'); f.sandbox='allow-scripts allow-same-origin'; f.style.width='100%'; f.style.height='100%'; p.appendChild(f);
const d=f.contentDocument; d.open(); d.write(game.Code||''); d.close(); }