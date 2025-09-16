let last=0;
export async function rateLimit(ms=500){
  const now=Date.now();
  if(now-last<ms) await new Promise(r=>setTimeout(r,ms-(now-last)));
  last=Date.now();
}
