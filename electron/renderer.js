import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  downloadZip: (payload) => ipcRenderer.invoke('download-zip', payload)
});
