self.onmessage=async e=>{
  const {a,b}=e.data;
  // naive diff: list filenames in A not in B
  const diffs=a.filter(f=>!b.find(g=>g.name===f.name)).map(f=>f.name);
  postMessage({diffs});
};
