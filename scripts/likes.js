// likes.js - client side like/unlike and scale application
async function likeGame(gameId){
  try{
    const liked = JSON.parse(localStorage.getItem('liked_games')||'[]');
    if(!liked.includes(gameId)) liked.push(gameId);
    localStorage.setItem('liked_games', JSON.stringify(liked));
    // best practice: use RPC for atomic increment; fallback - attempt simple update
    try{
      await supabaseClient.from('Files').update({ likes: supabaseClient.rpc ? undefined : undefined }).eq('id', gameId);
    }catch(e){ /* ignore */ }
  }catch(e){ console.warn('like failed', e); }
  await recomputeScales();
}

async function unlikeGame(gameId){
  try{
    let liked = JSON.parse(localStorage.getItem('liked_games')||'[]');
    liked = liked.filter(x=>x!==gameId);
    localStorage.setItem('liked_games', JSON.stringify(liked));
    try{
      await supabaseClient.from('Files').update({ likes: supabaseClient.rpc ? undefined : undefined }).eq('id', gameId);
    }catch(e){ /* ignore */ }
  }catch(e){ console.warn('unlike failed', e); }
  await recomputeScales();
}

function computeScaleFromPercentile(p){
  if(p < 0.5) return 1.00;
  if(p < 0.75) return 1.08;
  if(p < 0.9) return 1.18;
  return 1.30;
}

async function recomputeScales(){
  try{
    const games = await getGamesCached();
    const likes = games.map(g=>g.likes||0).sort((a,b)=>a-b);
    document.querySelectorAll('.game-button').forEach(btn=>{
      const id = Number(btn.dataset.id);
      const g = games.find(x=>x.id==id);
      const like = g ? (g.likes||0) : 0;
      const less = likes.filter(x=>x < like).length;
      const p = likes.length ? (less / likes.length) : 0;
      const scale = computeScaleFromPercentile(p);
      btn.style.setProperty('--tile-scale', scale);
    });
  }catch(e){ console.warn(e); }
}