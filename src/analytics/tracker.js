import { checkConsent } from './consent.js';

export async function track(event,data={}){
  if(!await checkConsent())return;
  console.log('[Analytics]',event,data);
}
