import { validateRepoContext, validateAsset } from '../src/schema/index.js';
import mockAssets from './mock-assets.json';

const ctx = { owner: 'octocat', repo: 'Hello-World', type: 'repo', ref: 'main' };
console.log('RepoContext valid:', validateRepoContext(ctx));

mockAssets.forEach(a => {
  console.log(`Asset ${a.name} valid:`, validateAsset(a));
});
