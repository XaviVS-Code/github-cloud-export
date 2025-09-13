export async function uploadToDropbox(blob, format = 'zip', owner = 'owner', repo = 'repo') {
  const token = await getDropboxToken();
  const safeName = `/${owner}-${repo}.${format === 'tar' ? 'tar.gz' : 'zip'}`;

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({
        path: safeName,
        mode: 'add',
        autorename: true,
        mute: false
      }),
      'Content-Type': 'application/octet-stream'
    },
    body: blob
  });

  if (!response.ok) {
    const t = await response.text().catch(() => '');
    throw new Error(`Dropbox upload failed: ${response.status} ${t}`);
  }
}

function getDropboxToken() {
  return new Promise((resolve, reject) => {
    const clientId = '6a83i5gq9smmt4s';
    const redirect = 'https://fabnlamojnahfeddcdckajibelgnnjme.chromiumapp.org/';
    const url = `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}`;

    chrome.identity.launchWebAuthFlow({ url, interactive: true }, redirectUrl => {
      if (chrome.runtime.lastError || !redirectUrl) return reject(new Error('Dropbox auth failed'));
      const token = new URL(redirectUrl).hash.match(/access_token=([^&]+)/)?.[1];
      token ? resolve(token) : reject(new Error('No token found'));
    });
  });
}
