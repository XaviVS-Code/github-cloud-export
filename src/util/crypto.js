export function randomString(len=64){
  const arr=new Uint8Array(len);crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/[^a-zA-Z0-9]/g,'').slice(0,len);
}

export async function pkceChallenge(verifier){
  const enc=new TextEncoder().encode(verifier);
  const digest=await crypto.subtle.digest('SHA-256',enc);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
