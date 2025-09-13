import { track } from './tracker.js';

export async function sendTelemetry(event,data){
  await track('telemetry:'+event,data);
  // future: fetch('https://your.endpoint/telemetry',{method:'POST',body:JSON.stringify({event,data})});
}
