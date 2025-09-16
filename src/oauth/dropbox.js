import { DROPBOX } from '../util/constants.js';
import { getToken, saveToken, clearToken } from '../util/storage.js';
import { randomString, pkceChallenge } from '../util/crypto.js';

export async function ensureDropboxToken(interactive=true){
  let tok=await getToken('dropbox');
  if(tok?.access_token && tok.expires_at>Date.now()+60000) return tok;
  if(tok?.refresh_token){ tok=await refresh(tok.refresh_token); if(tok) return tok; }
  if(!interactive) throw new Error('Dropbox auth required');
  return authFlow();
}

async function authFlow(){
  const state=randomString(16),verifier=randomString(64),challenge=await pkceChallenge(verifier);
  const params=new URLSearchParams({
    client_id:DROPBOX.clientId,response_type:'code',redirect_uri:DROPBOX.redirectUri,
    token_access_type:'offline',code_challenge:challenge,code_challenge_method:'S256',state,scope:DROPBOX.scope
  });
  const redirect=await chrome.identity.launchWebAuthFlow({url:`${DROPBOX.authUrl}?${params}`,interactive:true});
  const code=new URL(redirect).searchParams.get('code');
  const b=new URLSearchParams({grant_type:'authorization_code',code,client_id:DROPBOX.clientId,redirect_uri:DROPBOX.redirectUri,code_verifier:verifier});
  const res=await fetch(DROPBOX.tokenUrl,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b});
  const data=await res.json(); if(!res.ok) throw new Error(data.error_description);
  data.expires_at=Date.now()+data.expires_in*1000; await saveToken('dropbox',data);
  return data;
}

async function refresh(r){
  const b=new URLSearchParams({grant_type:'refresh_token',refresh_token:r,client_id:DROPBOX.clientId});
  const res=await fetch(DROPBOX.tokenUrl,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b});
  const d=await res.json(); if(!res.ok){ await clearToken('dropbox'); return null; }
  d.refresh_token=d.refresh_token||r; d.expires_at=Date.now()+d.expires_in*1000;
  await saveToken('dropbox',d); return d;
}
