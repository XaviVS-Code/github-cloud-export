#!/usr/bin/env node
import { parseArgs } from './args-parser.js';
import { getFiles } from './github-fetch.js';
import { uploadCLI } from './cloud-upload.js';

(async()=>{
  const args=parseArgs();
  if(!args.repo) return console.error('Specify --repo owner/repo');
  const [owner,repo]=args.repo.split('/');
  const ctx={owner,repo,type:'repo',ref:'main',readme:!!args.readme};
  console.log('Fetching...');  
  const files=await getFiles(ctx);
  console.log(`Uploading to ${args.provider}...`);
  await uploadCLI(files,args.provider);
  console.log('Done.');
})();
