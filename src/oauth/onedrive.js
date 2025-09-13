import { MICROSOFT } from '../util/constants.js';
import { getToken, saveToken, clearToken } from '../util/storage.js';
import { randomString, pkceChallenge } from '../util/crypto.js';

export async function ensureOneDriveToken(interactive=true){
  let tok=await getToken('onedrive');
  if(tok?.access_token && tok.expires_at>Date.now()+60000) return tok;
  if(tok?.refresh_token){ tok=await refresh(tok.refresh_token); if(tok) return tok; }
  if(!interactive) throw new Error('OneDrive auth required');
  return authFlow();
}

async function authFlow(){
  const state=randomString(16),verifier=randomString(64),challenge=await pkceChallenge(verifier);
  const params=new URLSearchParams({
    client_id:MICROSOFT.clientId,response_type:'code',redirect_uri:MICROSOFT.redirectUri,
    scope:MICROSOFT.scope,code_challenge:challenge,code_challenge_method:'S256',state
  });
  const redirect=await chrome.identity.launchWebAuthFlow({url:`${MICROSOFT.authUrl}?${params}`,interactive:true});
  const code=new URL(redirect).searchParams.get('code');
  const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:MICROSOFT.redirectUri,client_id:MICROSOFT.clientId,code_verifier:verifier});
  const res=await fetch(MICROSOFT.tokenUrl,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const data=await res.json(); if(!res.ok) throw new Error(data.error);
  data.expires_at=Date.now()+data.expires_in*1000; await saveToken('onedrive',data);
  return data;
}

async function refresh(r){
  const b=new URLSearchParams({grant_type:'refresh_token',refresh_token:r,client_id:MICROSOFT.clientId,redirect_uri:MICROSOFT.redirectUri});
  const res=await fetch(MICROSOFT.tokenUrl,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b});
  const d=await res.json(); if(!res.ok){ await clearToken('onedrive'); return null; }
  d.refresh_token=d.refresh_token||r; d.expires_at=Date.now()+d.expires_in*1000;
  await saveToken('onedrive',d); return d;
}
