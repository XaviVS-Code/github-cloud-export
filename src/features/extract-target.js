import { GITHUB } from '../util/constants.js';
export function detectContext(loc){
  const u=new URL(loc);
  const [o,r,t,...rest]=u.pathname.split('/').filter(Boolean);
  const ctx={owner:o,repo:r,type:'repo',ref:GITHUB.defaultBranches[0],assets:[],filePath:null,rawUrl:null};
  if(t==='releases'){ ctx.type='release'; ctx.assets=[...document.querySelectorAll('a[href*="/download/"]')]
    .map(a=>({name:a.textContent.trim(),url:a.href})); }
  else if(t==='blob'){ ctx.type='file'; ctx.ref=rest[0];
    ctx.filePath=rest.slice(1).join('/'); ctx.rawUrl=GITHUB.rawUrl(o,r,ctx.ref,ctx.filePath); }
  else {
    const b=document.querySelector('span.css-truncate-target[data-menu-button]');
    if(b)ctx.ref=b.textContent.trim();
  }
  return ctx;
}
