export function getSettings() {
  return new Promise(r => chrome.storage.sync.get({provider:'google',readmeOnly:false},r));
}
export function setSettings(obj) {
  return new Promise(r => chrome.storage.sync.set(obj, r));
}
export function saveToken(k, t) {
  return new Promise(r => chrome.storage.local.set({['tok_'+k]:t}, r));
}
export function getToken(k) {
  return new Promise(r => chrome.storage.local.get('tok_'+k, v=>r(v['tok_'+k])));
}
export function clearToken(k) {
  return new Promise(r => chrome.storage.local.remove('tok_'+k, r));
}
