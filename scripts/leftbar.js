// leftbar.js - populate left category bar and handle expand-on-hover
async function buildLeftBar(){
  const container = document.getElementById('left-bar-inner');
  container.innerHTML='';
  const cats = [];
  (window.allGames||[]).forEach(g=>{ const parts = (g.Category||'').split(',').map(s=>s.trim()).filter(Boolean); parts.forEach(p=>{ if(!cats.includes(p)) cats.push(p); }); });
  if(cats.length===0) cats.push('All');
  cats.sort();
  cats.forEach(c=>{
    const el = document.createElement('div'); el.className='category-item';
    const iconSrc = `assets/icons/${c.toLowerCase()||'arcade'}.svg`;
    el.innerHTML = `<div class='category-icon'><img src='${iconSrc}' style='width:28px;height:28px'/></div><div class='category-label'>${c}</div>`;
    el.addEventListener('click', ()=>{ filterByCategory(c); document.querySelectorAll('.category-item').forEach(x=>x.classList.remove('active')); el.classList.add('active'); });
    container.appendChild(el);
  });
  const leftBar = document.getElementById('left-bar');
  leftBar.addEventListener('mouseenter', ()=>{ leftBar.classList.add('expanded'); document.getElementById('container').classList.add('shifted'); });
  leftBar.addEventListener('mouseleave', ()=>{ leftBar.classList.remove('expanded'); document.getElementById('container').classList.remove('shifted'); });
}

document.addEventListener('DOMContentLoaded', ()=>{ if(window.allGames) buildLeftBar(); });