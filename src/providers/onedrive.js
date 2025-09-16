import { ensureOneDriveToken } from '../oauth/onedrive.js';
import { MICROSOFT } from '../util/constants.js';

export async function uploadToOneDrive(files){
  const tok=await ensureOneDriveToken();
  for(const f of files){
    await fetch(`${MICROSOFT.graphUrl}/me/drive/root:/${encodeURIComponent(f.name)}:/content`,{
      method:'PUT',headers:{Authorization:`Bearer ${tok.access_token}`},body:f
    });
  }
}
