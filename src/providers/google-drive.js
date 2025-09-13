import { GOOGLE } from '../util/constants.js';
import { ensureGoogleToken } from '../oauth/google.js';

export async function uploadToGoogleDrive(files){
  const tok=await ensureGoogleToken();
  for(const f of files){
    const boundary='b_'+crypto.randomUUID();
    const meta=JSON.stringify({name:f.name});
    const head=`--${boundary}\r\nContent-Type:application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type:${f.type||'application/octet-stream'}\r\n\r\n`;
    const tail=`\r\n--${boundary}--`;
    const chunks=[new TextEncoder().encode(head)];
    const r=f.stream().getReader();
    while(true){
      const {value,done}=await r.read(); if(done)break; chunks.push(value);
    }
    chunks.push(new TextEncoder().encode(tail));
    const payload=new Blob(chunks,{type:`multipart/related; boundary=${boundary}`});
    const res=await fetch(`${GOOGLE.uploadUrl}?uploadType=multipart&fields=id,webViewLink`,{
      method:'POST',headers:{Authorization:`Bearer ${tok.access_token}`},body:payload
    });
    if(!res.ok) throw new Error(`Drive ${res.status}`);
  }
}
