import { fetchReadme } from '../src/features/readme-only.js';

(async () => {
  const file = await fetchReadme('octocat', 'Hello-World', 'main');
  console.log('README fetched:', file.name, file.size);
})();
