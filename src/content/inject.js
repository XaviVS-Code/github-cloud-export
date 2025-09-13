import { detectContext } from '../features/extract-target.js';
function inject(){
  if(document.getElementById('gh-send-to-cloud'))return;
  const t=getToolbar(); if(!t)return;
  const btn=document.createElement('button');
  btn.id='gh-send-to-cloud'; btn.textContent='Send to Cloud ☁️';
  btn.className='btn btn-sm btn-primary'; btn.style.marginLeft='8px';
  btn.onclick=()=>{
    const ctx=detectContext(window.location.href);
    chrome.runtime.sendMessage({type:'REQUEST_UPLOAD',context:ctx});
  };
  t.appendChild(btn);
}
new MutationObserver(inject).observe(document, {childList:true,subtree:true});
inject();
