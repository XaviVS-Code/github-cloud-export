export async function uploadToOneDrive(blob, format = 'zip', owner = 'owner', repo = 'repo') {
  const token = await getOneDriveToken();
  const safeName = `${owner}-${repo}.${format === 'tar' ? 'tar.gz' : 'zip'}`;
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(safeName)}:/content`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': format === 'tar' ? 'application/gzip' : 'application/zip'
    },
    body: blob
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OneDrive upload failed: ${response.status} ${errorText}`);
  }
}

function getOneDriveToken() {
  return new Promise((resolve, reject) => {
    const clientId = 'YOUR_ONEDRIVE_CLIENT_ID';
    const redirect = 'https://YOUR_EXTENSION_ID.chromiumapp.org/';
    const scope = encodeURIComponent('files.readwrite offline_access');
    const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&response_type=token`
      + `&redirect_uri=${encodeURIComponent(redirect)}`
      + `&scope=${scope}`;

    chrome.identity.launchWebAuthFlow({ url, interactive: true }, redirectUrl => {
      if (chrome.runtime.lastError || !redirectUrl) return reject(new Error('OneDrive auth failed'));
      const tokenMatch = redirectUrl.match(/access_token=([^&]+)/);
      tokenMatch ? resolve(tokenMatch[1]) : reject(new Error('No token found'));
    });
  });
}
