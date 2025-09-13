import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  await win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('download-zip', async (e, { owner, repo, format = 'zip' }) => {
  if (!owner || !repo) throw new Error('Owner and repo are required');
  const endpoint = format === 'tar'
    ? `https://api.github.com/repos/${owner}/${repo}/tarball`
    : `https://api.github.com/repos/${owner}/${repo}/zipball`;

  const res = await fetch(endpoint, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save GitHub archive',
    defaultPath: `${owner}-${repo}.${format === 'tar' ? 'tar.gz' : 'zip'}`,
    filters: [{ name: format === 'tar' ? 'TAR.GZ' : 'ZIP', extensions: [format === 'tar' ? 'tar.gz' : 'zip'] }]
  });
  if (canceled || !filePath) return { saved: false };

  fs.writeFileSync(filePath, buf);
  return { saved: true, path: filePath };
});
