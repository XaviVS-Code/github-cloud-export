// Get ZIP or TAR archive blob for owner/repo
export async function getRepoArchive(owner, repo, format = 'zip') {
  const endpoint = format === 'tar'
    ? `https://api.github.com/repos/${owner}/${repo}/tarball`
    : `https://api.github.com/repos/${owner}/${repo}/zipball`;

  const response = await fetch(endpoint, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
  if (!response.ok) {
    const t = await response.text().catch(() => '');
    throw new Error(`GitHub fetch failed: ${response.status} ${t}`);
  }
  const blob = await response.blob();
  return { owner, repo, blob, format };
}

// Legacy helper (unused directly in popup; background uses getCurrentRepoMeta)
export async function getCurrentRepoData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const match = url.match(/github\.com\/([^\/]+)\/([^\/?#]+)(?:[\/?#]|$)/);
  if (!match) throw new Error('Not a valid GitHub repo page');
  const owner = match[1];
  const repo = match[2];
  return getRepoArchive(owner, repo, 'zip');
}

// Starred repos with pagination
export async function getStarredRepos(username) {
  let page = 1;
  const perPage = 100;
  const all = [];
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Starred fetch failed: ${res.status} ${t}`);
    }
    const data = await res.json();
    all.push(...data.map(repo => ({ owner: repo.owner.login, name: repo.name })));
    if (data.length < perPage || page >= 10) break;
    page++;
  }
  return all;
}

// Simple "trending-like" proxy: most starred repos (public)
export async function getTrendingRepos() {
  const url = 'https://api.github.com/search/repositories?q=stars:%3E50000&sort=stars&order=desc&per_page=10';
  const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map(r => ({ owner: r.owner.login, name: r.name }));
}
