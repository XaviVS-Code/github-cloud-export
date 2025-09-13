import { ensureDropboxToken } from '../oauth/dropbox.js';
import { DROPBOX } from '../util/constants.js';

export async function uploadToDropbox(files){
  const tok=await ensureDropboxToken();
  for(const f of files){
    await fetch(DROPBOX.contentUrl,{
      method:'POST',
      headers:{
        Authorization:`Bearer ${tok.access_token}`,
        'Dropbox-API-Arg': JSON.stringify({path:`/${f.name}`,mode:'add',autorename:true}),
        'Content-Type':'application/octet-stream'
      },
      body:f
    });
  }
}
