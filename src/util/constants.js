export const APP_NAME = 'GitHub Cloud Export';

export const GITHUB = {
  defaultBranches: ['main','master'],
  zipUrl: (o,r,ref) => `https://github.com/${o}/${r}/archive/refs/heads/${encodeURIComponent(ref)}.zip`,
  rawUrl: (o,r,ref,path) =>
    `https://raw.githubusercontent.com/${o}/${r}/${encodeURIComponent(ref)}/${path}`
};

export const GOOGLE = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  uploadUrl: 'https://www.googleapis.com/upload/drive/v3/files',
  clientId: '<GOOGLE_OAUTH_CLIENT_ID>',
  scope: 'https://www.googleapis.com/auth/drive.file',
  redirectUri: chrome.identity.getRedirectURL('oauth2')
};

export const MICROSOFT = {
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  graphUrl: 'https://graph.microsoft.com/v1.0',
  clientId: '<AZURE_APP_ID>',
  scope: 'offline_access Files.ReadWrite openid profile',
  redirectUri: chrome.identity.getRedirectURL('oauth2')
};

export const DROPBOX = {
  authUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
  contentUrl: 'https://content.dropboxapi.com/2/files/upload',
  clientId: '<DROPBOX_APP_KEY>',
  scope: 'files.content.write',
  redirectUri: chrome.identity.getRedirectURL('oauth2')
};
