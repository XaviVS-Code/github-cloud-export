import { fetchZipForRepo, fetchFileBlob, fetchReleaseAssets } from '../util/fetch.js';
import { fetchReadme } from '../features/readme-only.js';
import { uploadWithSelectedProvider } from '../features/uploader.js';

export async function handleMessage(msg){
  if(msg.type!=='REQUEST_UPLOAD')return;
  const ctx=msg.context; let files=[];
  if(ctx.type==='repo') files=[await fetchZipForRepo(ctx.owner,ctx.repo,ctx.ref)];
  if(ctx.type==='file') files=[await fetchFileBlob(ctx.rawUrl,ctx.filePath)];
  if(ctx.type==='release') files=await fetchReleaseAssets(ctx.assets);
  if(msg.context.onlyReadme) files=[await fetchReadme(ctx.owner,ctx.repo,ctx.ref)];
  return uploadWithSelectedProvider(files);
}
