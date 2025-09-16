importScripts('https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js');
self.onmessage=async e=>{
  const {file}=e.data;
  const zip=await JSZip.loadAsync(file);
  const files=await Promise.all(Object.keys(zip.files).map(async name=>{
    const blob=await zip.files[name].async('blob');
    return {name,blob};
  }));
  postMessage({files});
};
