export const RepoTypes = { REPO:'repo', FILE:'file', RELEASE:'release' };
export const CloudProviders = { GOOGLE:'google', ONEDRIVE:'onedrive', DROPBOX:'dropbox' };

export function isValidRepoType(x) {
  return Object.values(RepoTypes).includes(x);
}
export function isValidProvider(x) {
  return Object.values(CloudProviders).includes(x);
}
