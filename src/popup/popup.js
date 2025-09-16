const qs = (sel) => document.querySelector(sel);

document.addEventListener('DOMContentLoaded', async () => {
  // Core controls
  const exportButton = qs('#export');
  const targetSelect = qs('#target');
  const formatToggle = qs('#formatToggle');
  const status = qs('#status');
  const spinner = qs('#spinner');
  const spinnerText = qs('#spinnerText');

  // Panels
  const showHistoryBtn = qs('#showHistory');
  const showStarredBtn = qs('#showStarred');
  const showSettingsBtn = qs('#showSettings');
  const historyPanel = qs('#historyPanel');
  const starredPanel = qs('#starredPanel');
  const settingsPanel = qs('#settingsPanel');

  // History
  const historyList = qs('#historyList');
  const clearHistory = qs('#clearHistory');
  const historyProvider = qs('#historyProvider');
  const historySearch = qs('#historySearch');
  const applyFilters = qs('#applyFilters');
  const clearFilters = qs('#clearFilters');
  const saveSummary = qs('#saveSummary');

  // Starred
  const ghUsername = qs('#ghUsername');
  const loadStarred = qs('#loadStarred');
  const starredList = qs('#starredList');
  const selectAllStarred = qs('#selectAllStarred');
  const exportSelectedStarred = qs('#exportSelectedStarred');

  // Toggles
  const debugToggle = qs('#debugToggle');
  const testModeToggle = qs('#testModeToggle');

  // Settings
  const defaultTarget = qs('#defaultTarget');
  const themeSelect = qs('#themeSelect');
  const defaultFormat = qs('#defaultFormat');
  const historyMax = qs('#historyMax');
  const defaultDebug = qs('#defaultDebug');
  const defaultTestMode = qs('#defaultTestMode');
  const saveSettings = qs('#saveSettings');

  // Load settings
  chrome.storage.sync.get(
    { defaultTarget: 'drive', defaultFormat: 'zip', theme: 'auto', debug: false, testMode: false, historyMax: 200 },
    ({ defaultTarget: dT, defaultFormat: dF, theme, debug, testMode, historyMax: hMax }) => {
      targetSelect.value = dT;
      formatToggle.value = dF;
      defaultTarget.value = dT;
      defaultFormat.value = dF;
      themeSelect.value = theme;
      debugToggle.checked = debug;
      testModeToggle.checked = testMode;
      defaultDebug.checked = debug;
      defaultTestMode.checked = testMode;
      historyMax.value = hMax;
      applyTheme(theme);
    }
  );

  // Export current repo
  exportButton.addEventListener('click', () => {
    const target = targetSelect.value;
    const format = formatToggle.value;
    const testMode = testModeToggle.checked;

    spinner.style.display = 'flex';
    spinnerText.textContent = 'Fetching repo...';
    status.textContent = '';

    chrome.runtime.sendMessage({ type: 'EXPORT_CURRENT', target, format, testMode });
  });

  // Panels toggle
  showHistoryBtn.addEventListener('click', async () => {
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
    if (historyPanel.style.display === 'block') {
      renderHistory(historyList, { provider: historyProvider.value, search: historySearch.value.trim() });
    }
  });

  showStarredBtn.addEventListener('click', () => {
    starredPanel.style.display = starredPanel.style.display === 'none' ? 'block' : 'none';
  });

  showSettingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
  });

  // History actions
  clearHistory.addEventListener('click', async () => {
    await chrome.storage.local.set({ history: [] });
    renderHistory(historyList, { provider: historyProvider.value, search: historySearch.value.trim() });
  });

  applyFilters.addEventListener('click', () => {
    renderHistory(historyList, { provider: historyProvider.value, search: historySearch.value.trim() });
  });

  clearFilters.addEventListener('click', () => {
    historyProvider.value = '';
    historySearch.value = '';
    renderHistory(historyList, {});
  });

  saveSummary.addEventListener('click', async () => {
    const panel = qs('#historyPanel');
    try {
      const canvas = await html2canvas(panel);
      const link = document.createElement('a');
      link.download = 'export-summary.png';
      link.href = canvas.toDataURL();
      link.click();
      status.textContent = 'Summary saved.';
    } catch (e) {
      status.textContent = `Screenshot failed: ${e.message}`;
    }
  });

  // Starred actions
  loadStarred.addEventListener('click', () => {
    const username = ghUsername.value.trim();
    if (!username) {
      status.textContent = 'Enter a GitHub username to load starred repos.';
      return;
    }
    spinner.style.display = 'flex';
    spinnerText.textContent = 'Loading starred repos...';
    chrome.runtime.sendMessage({ type: 'LOAD_STARRED', username });
  });

  selectAllStarred.addEventListener('click', () => {
    starredList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
  });

  exportSelectedStarred.addEventListener('click', () => {
    const selected = [...starredList.querySelectorAll('input[type="checkbox"]:checked')].map(cb => ({
      owner: cb.getAttribute('data-owner'),
      repo: cb.getAttribute('data-repo')
    }));
    if (selected.length === 0) {
      status.textContent = 'Select at least one repo to export.';
      return;
    }
    const target = targetSelect.value;
    const format = formatToggle.value;
    const testMode = testModeToggle.checked;

    spinner.style.display = 'flex';
    spinnerText.textContent = `Batch exporting ${selected.length} repos...`;
    status.textContent = '';

    chrome.runtime.sendMessage({ type: 'EXPORT_STARRED_BATCH', target, items: selected, format, testMode });
  });

  // Debug + test mode persistence
  debugToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ debug: debugToggle.checked });
    status.textContent = debugToggle.checked ? 'Debug enabled' : 'Debug disabled';
  });
  testModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ testMode: testModeToggle.checked });
  });

  // Settings save
  saveSettings.addEventListener('click', () => {
    const cfg = {
      defaultTarget: defaultTarget.value,
      defaultFormat: defaultFormat.value,
      theme: themeSelect.value,
      debug: defaultDebug.checked,
      testMode: defaultTestMode.checked,
      historyMax: Number(historyMax.value) || 200
    };
    chrome.storage.sync.set(cfg, () => {
      targetSelect.value = cfg.defaultTarget;
      formatToggle.value = cfg.defaultFormat;
      applyTheme(cfg.theme);
      debugToggle.checked = cfg.debug;
      testModeToggle.checked = cfg.testMode;
      status.textContent = 'Settings saved.';
    });
  });
});

// Messages from background
chrome.runtime.onMessage.addListener((msg) => {
  const status = document.getElementById('status');
  const spinner = document.getElementById('spinner');
  const spinnerText = document.getElementById('spinnerText');
  const historyList = document.getElementById('historyList');

  if (msg.type === 'PHASE') {
    chrome.storage.sync.get({ debug: false }, ({ debug }) => {
      if (debug) {
        spinnerText.textContent = `${msg.phase}...`;
        status.textContent = `${msg.phase}: ${msg.detail || ''}`;
      }
    });
  }

  if (msg.type === 'EXPORT_SUCCESS') {
    spinner.style.display = 'none';
    status.textContent = `Export to ${msg.target} complete!`;
    renderHistory(historyList, {}); // refresh
  }

  if (msg.type === 'EXPORT_FAIL') {
    spinner.style.display = 'none';
    status.textContent = `Export failed: ${msg.error}`;
  }

  if (msg.type === 'STARRED_LIST') {
    const list = document.getElementById('starredList');
    list.innerHTML = '';
    msg.repos.forEach(({ owner, name }) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" data-owner="${owner}" data-repo="${name}">
        <span class="repo">${owner}/${name}</span>
        <button data-owner="${owner}" data-repo="${name}">Export</button>
      `;
      list.appendChild(li);
    });
    spinner.style.display = 'none';
    status.textContent = `Loaded ${msg.repos.length} starred repos.`;
  }

  if (msg.type === 'STARRED_FAIL') {
    spinner.style.display = 'none';
    status.textContent = `Failed to load starred repos: ${msg.error}`;
  }

  if (msg.type === 'BATCH_PROGRESS') {
    document.getElementById('spinner').style.display = 'flex';
    spinnerText.textContent = `Batch ${msg.completed}/${msg.total}: ${msg.current || ''}`;
  }

  if (msg.type === 'BATCH_DONE') {
    spinner.style.display = 'none';
    const ok = msg.successes?.length || 0;
    const fail = msg.failures?.length || 0;
    status.innerHTML = `Batch complete: ${ok} succeeded, ${fail} failed.`;

    if (fail > 0) {
      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Retry failed';
      retryBtn.addEventListener('click', () => {
        const target = document.getElementById('target').value;
        const format = document.getElementById('formatToggle').value;
        const testMode = document.getElementById('testModeToggle').checked;
        spinner.style.display = 'flex';
        spinnerText.textContent = 'Retrying failed exports...';
        chrome.runtime.sendMessage({
          type: 'EXPORT_STARRED_BATCH',
          target,
          items: msg.failures.map(f => ({ owner: f.owner, repo: f.repo })),
          format,
          testMode
        });
      });
      status.appendChild(retryBtn);
    }
    renderHistory(historyList, {});
  }
});

async function renderHistory(ul, { provider = '', search = '' } = {}) {
  const { history = [] } = await chrome.storage.local.get({ history: [] });
  const query = search.toLowerCase();
  const filtered = history.filter(h => {
    const providerOk = provider ? h.target === provider : true;
    const text = `${h.owner}/${h.repo}`.toLowerCase();
    const searchOk = query ? text.includes(query) : true;
    return providerOk && searchOk;
  });

  ul.innerHTML = '';
  filtered.slice().reverse().forEach((h) => {
    const li = document.createElement('li');
    const when = new Date(h.timestamp).toLocaleString();
    li.innerHTML = `
      <span>${h.owner}/${h.repo} → ${h.target} (${h.format || 'zip'})</span>
      <span style="margin-left:auto;color:#666;">${when}</span>
    `;
    ul.appendChild(li);
  });
}

function applyTheme(mode) {
  document.body.setAttribute('data-theme', mode);
}
