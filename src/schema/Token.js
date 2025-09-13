export function isTokenExpired(tok){
  return !tok || typeof tok.expires_at!=='number' || tok.expires_at < Date.now()+60000;
}
