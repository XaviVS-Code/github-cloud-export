import { getRepoArchive, getStarredRepos, getTrendingRepos } from '../utils/github.js';
import { packageRepo } from '../utils/zip.js';
import { uploadToDrive } from '../utils/drive.js';
import { uploadToDropbox } from '../utils/dropbox.js';
import { uploadToOneDrive } from '../utils/onedrive.js';

function sendPhase(phase, detail) {
  chrome.storage.sync.get({ debug: false }, ({ debug }) => {
    if (debug) chrome.runtime.sendMessage({ type: 'PHASE', phase, detail });
  });
}

async function retry(fn, attempts = 3, label = 'op') {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 1000 * (i + 1))); }
  }
  throw new Error(`${label} failed after ${attempts} attempts: ${lastErr?.message || lastErr}`);
}

async function exportFromOwnerRepo({ target, owner, repo, format = 'zip', testMode = false }) {
  console.time('FetchRepo');
  sendPhase('Fetching repo', `${owner}/${repo} (${format})`);
  const repoData = await retry(() => getRepoArchive(owner, repo, format), 3, 'fetch archive');
  console.timeEnd('FetchRepo');

  console.time('PackageRepo');
  sendPhase('Packaging archive');
  const archiveBlob = await packageRepo(repoData); // passthrough
  console.timeEnd('PackageRepo');

  if (testMode) {
    sendPhase('Simulated upload', `${owner}/${repo} → ${target}`);
    await addHistory({ owner, repo, target, format });
    chrome.runtime.sendMessage({ type: 'EXPORT_SUCCESS', target });
    return;
  }

  console.time('Upload');
  sendPhase('Uploading', target);
  switch (target) {
    case 'drive': await retry(() => uploadToDrive(archiveBlob, format, owner, repo), 2, 'drive upload'); break;
    case 'dropbox': await retry(() => uploadToDropbox(archiveBlob, format, owner, repo), 2, 'dropbox upload'); break;
    case 'onedrive': await retry(() => uploadToOneDrive(archiveBlob, format, owner, repo), 2, 'onedrive upload'); break;
    default: throw new Error(`Unknown target: ${target}`);
  }
  console.timeEnd('Upload');

  await addHistory({ owner, repo, target, format });
  chrome.runtime.sendMessage({ type: 'EXPORT_SUCCESS', target });
}

async function addHistory({ owner, repo, target, format }) {
  const { history = [] } = await chrome.storage.local.get({ history: [] });
  const { historyMax = 200 } = await chrome.storage.sync.get({ historyMax: 200 });
  history.push({ owner, repo, target, format, timestamp: Date.now() });
  const trimmed = history.slice(-Math.max(10, historyMax));
  await chrome.storage.local.set({ history: trimmed });
}

async function batchExport({ target, items, format = 'zip', testMode = false }) {
  const total = items.length;
  const successes = [];
  const failures = [];

  for (let i = 0; i < items.length; i++) {
    const { owner, repo } = items[i];
    try {
      chrome.runtime.sendMessage({ type: 'BATCH_PROGRESS', completed: i, total, current: `${owner}/${repo}` });
      await exportFromOwnerRepo({ target, owner, repo, format, testMode });
      successes.push({ owner, repo });
    } catch (e) {
      failures.push({ owner, repo, error: e.message });
    }
    chrome.runtime.sendMessage({ type: 'BATCH_PROGRESS', completed: i + 1, total, current: `${owner}/${repo}` });
  }
  chrome.runtime.sendMessage({ type: 'BATCH_DONE', successes, failures, total });
}

chrome.runtime.onMessage.addListener((msg) => {
  (async () => {
    try {
      if (msg.type === 'EXPORT_CURRENT') {
        const meta = await getCurrentRepoMeta();
        if (!meta) {
          // Smart suggestions when not on a repo page
          const suggestions = await smartSuggestions();
          const err = 'Not on a GitHub repo page. Suggestions: ' + suggestions.map(s => `${s.owner}/${s.name}`).join(', ');
          throw new Error(err);
        }
        await exportFromOwnerRepo({ target: msg.target, owner: meta.owner, repo: meta.repo, format: msg.format, testMode: msg.testMode });
      }

      if (msg.type === 'EXPORT_REPO') {
        await exportFromOwnerRepo({ target: msg.target, owner: msg.owner, repo: msg.repo, format: msg.format, testMode: msg.testMode });
      }

      if (msg.type === 'LOAD_STARRED') {
        const repos = await getStarredRepos(msg.username);
        chrome.runtime.sendMessage({ type: 'STARRED_LIST', repos });
      }

      if (msg.type === 'EXPORT_STARRED_BATCH') {
        await batchExport({ target: msg.target, items: msg.items, format: msg.format, testMode: msg.testMode });
      }
    } catch (e) {
      if (msg.type === 'LOAD_STARRED') {
        chrome.runtime.sendMessage({ type: 'STARRED_FAIL', error: e.message });
      } else if (msg.type === 'EXPORT_STARRED_BATCH') {
        chrome.runtime.sendMessage({ type: 'BATCH_DONE', successes: [], failures: (msg.items || []).map(it => ({ ...it, error: e.message })), total: msg.items?.length || 0 });
      } else {
        chrome.runtime.sendMessage({ type: 'EXPORT_FAIL', error: e.message });
      }
    }
  })();
});

// Helpers
async function getCurrentRepoMeta() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const match = url.match(/github\.com\/([^\/]+)\/([^\/?#]+)(?:[\/?#]|$)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

async function smartSuggestions() {
  // Try to use last loaded starred list cached in memory (not persisted), otherwise fallback to trending
  try {
    const trending = await getTrendingRepos();
    return trending.slice(0, 5);
  } catch {
    return [];
  }
}
