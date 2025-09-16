export async function uploadToDrive(blob, format = 'zip', owner = 'owner', repo = 'repo') {
  const token = await getGoogleToken();
  const safeName = `${owner}-${repo}.${format === 'tar' ? 'tar.gz' : 'zip'}`;

  const metadata = {
    name: safeName,
    mimeType: format === 'tar' ? 'application/gzip' : 'application/zip'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  if (!response.ok) {
    const t = await response.text().catch(() => '');
    throw new Error(`Drive upload failed: ${response.status} ${t}`);
  }
}

function getGoogleToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, token => {
      if (chrome.runtime.lastError || !token) reject(new Error('Google auth failed'));
      else resolve(token);
    });
  });
}
