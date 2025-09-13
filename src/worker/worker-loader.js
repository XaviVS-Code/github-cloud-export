export function createWorker(path){
  return new Worker(chrome.runtime.getURL(path), {type:'module'});
}
