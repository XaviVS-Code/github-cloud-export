export async function retry(fn, times=3, delay=500){
  let e;
  for(let i=0;i<times;i++){
    try{ return await fn(); }
    catch(err){ e=err; await new Promise(r=>setTimeout(r,delay)); }
  }
  throw e;
}
