import { getSettings } from '../util/storage.js';
import { uploadToGoogleDrive } from '../providers/google-drive.js';
import { uploadToOneDrive } from '../providers/onedrive.js';
import { uploadToDropbox } from '../providers/dropbox.js';

export async function uploadWithSelectedProvider(files){
  const {provider,readmeOnly} = await getSettings();
  if(readmeOnly && files.length>1) files=[files[0]]; // ensure only README if set
  if(provider==='google') return uploadToGoogleDrive(files);
  if(provider==='onedrive') return uploadToOneDrive(files);
  if(provider==='dropbox') return uploadToDropbox(files);
  throw new Error('No provider selected');
}
