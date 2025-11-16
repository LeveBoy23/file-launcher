// auth.js - basic Supabase Auth helpers and merge skeleton
async function signUpEmail(email, password, username){
  const { user, error } = await supabaseClient.auth.signUp({ email, password }, { data:{username} });
  if(error) throw error;
  return user;
}
async function signInEmail(email, password){
  const { user, error } = await supabaseClient.auth.signIn({ email, password });
  if(error) throw error;
  return user;
}
async function signOut(){
  await supabaseClient.auth.signOut();
  currentUserId = null;
  await loadGames({force:false});
}
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if(session && session.user){
    currentUserId = session.user.id;
    console.log('Signed in as', currentUserId);
    try{ await mergeLocalToServer(session.user.id); }catch(e){console.warn(e);}
  } else {
    currentUserId = null;
  }
});

async function mergeLocalToServer(userId){
  console.log('Merging local data to server for user', userId);
  // TODO: implement full merging logic after DB migration
}