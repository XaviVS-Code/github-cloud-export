import { GITHUB } from '../util/constants.js';
export async function fetchReadme(o,r,ref='main'){
  const url=`https://raw.githubusercontent.com/${o}/${r}/${encodeURIComponent(ref)}/README.md`;
  const res=await fetch(url);
  if(!res.ok)throw new Error('README.md missing');
  const blob=await res.blob();
  return new File([blob],'README.md',{type:'text/markdown'});
}
