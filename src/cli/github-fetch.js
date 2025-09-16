import { fetchZipForRepo, fetchFileBlob, fetchReleaseAssets } from '../util/fetch.js';
import { fetchReadme } from '../features/readme-only.js';

export async function getFiles(ctx){
  if(ctx.type==='repo' && ctx.readme) return [await fetchReadme(ctx.owner,ctx.repo,ctx.ref)];
  if(ctx.type==='repo') return [await fetchZipForRepo(ctx.owner,ctx.repo,ctx.ref)];
  if(ctx.type==='file') return [await fetchFileBlob(ctx.rawUrl,ctx.filePath)];
  if(ctx.type==='release') return await fetchReleaseAssets(ctx.assets);
  throw new Error('Unknown context');
}
