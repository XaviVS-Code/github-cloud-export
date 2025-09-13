import { uploadToDropbox } from '../src/providers/dropbox.js';

const mockFile = new File(['Hello world'], 'README.md', { type: 'text/markdown' });
uploadToDropbox([mockFile]).then(() => console.log('Simulated Dropbox upload'));
