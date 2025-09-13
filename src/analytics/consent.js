import { getSettings,setSettings } from '../util/storage.js';

export async function checkConsent(){
  const cfg=await getSettings();
  if(cfg.analyticsConsent===undefined) return false;
  return cfg.analyticsConsent;
}

export async function setConsent(val){
  await setSettings({analyticsConsent:val});
}
