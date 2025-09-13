export function validateAsset(a){
  return a && typeof a.name==='string' && typeof a.url==='string';
}
