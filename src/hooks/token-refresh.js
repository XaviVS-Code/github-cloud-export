import { clearToken, getToken, saveToken } from '../util/storage.js';
export async function withTokenRefresh(key, refreshFn, useFn){
  let tok=await getToken(key);
  if(tok && tok.expires_at>Date.now()+60000) return useFn(tok);
  tok = await refreshFn(tok?.refresh_token);
  if(!tok) throw new Error(`${key} auth failed`);
  await saveToken(key,tok);
  return useFn(tok);
}
