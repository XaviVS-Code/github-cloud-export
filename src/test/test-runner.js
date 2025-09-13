import { fetchZipForRepo } from '../src/util/fetch.js';
import { uploadToGoogleDrive } from '../src/providers/google-drive.js';

(async () => {
  const file = await fetchZipForRepo('octocat', 'Hello-World', 'main');
  console.log('Fetched:', file.name);
  await uploadToGoogleDrive([file]);
  console.log('Upload simulated.');
})();
