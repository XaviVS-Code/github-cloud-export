import { GITHUB } from './constants.js';

export async function fetchZipForRepo(o,r,ref='main'){
  const res=await fetch(GITHUB.zipUrl(o,r,ref),{credentials:'include'});
  if(!res.ok)throw new Error(`ZIP ${res.status}`);
  const blob=await res.blob();
  return new File([blob],`${o}-${r}-${ref}.zip`,{type:'application/zip'});
}

export async function fetchFileBlob(url,name='file'){
  const res=await fetch(url);
  if(!res.ok)throw new Error(`File ${res.status}`);
  const blob=await res.blob();
  return new File([blob],name,{type:blob.type||'application/octet-stream'});
}

export async function fetchReleaseAssets(list){
  const out=[];
  for(const a of list){
    const res=await fetch(a.url,{credentials:'include'});
    if(!res.ok)throw new Error(`Asset ${a.name} ${res.status}`);
    out.push(new File([await res.blob()],a.name,{type:'application/octet-stream'}));
  }
  return out;
}
