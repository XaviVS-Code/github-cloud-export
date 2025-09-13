export function validateRepoContext(ctx){
  return ctx &&
    typeof ctx.owner==='string' &&
    typeof ctx.repo==='string' &&
    ['repo','file','release'].includes(ctx.type);
}
