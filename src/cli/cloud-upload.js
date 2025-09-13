import { uploadToGoogleDrive } from '../providers/google-drive.js';
import { uploadToOneDrive } from '../providers/onedrive.js';
import { uploadToDropbox } from '../providers/dropbox.js';

export async function uploadCLI(files,provider){
  if(provider==='google') return uploadToGoogleDrive(files);
  if(provider==='onedrive') return uploadToOneDrive(files);
  if(provider==='dropbox') return uploadToDropbox(files);
  throw new Error('Invalid provider');
}
