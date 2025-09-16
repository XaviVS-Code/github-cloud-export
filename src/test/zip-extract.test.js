import { createWorker } from '../src/worker/worker-loader.js';

const zipBlob = await fetch('test/sample.zip').then(r => r.blob());
const worker = createWorker('src/worker/zip-extract.js');
worker.postMessage({ file: zipBlob });
worker.onmessage = e => {
  console.log('Extracted files:', e.data.files.map(f => f.name));
};
