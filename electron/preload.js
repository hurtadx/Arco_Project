import { contextBridge, ipcRenderer } from 'electron';

// Exponer API segura para que la aplicación de React pueda comunicarse con Electron
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    const validChannels = ['toMain', 'setTitle'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  exportToExcel: (type, data) => {
    ipcRenderer.send('export-to-excel', { type, data });
    return new Promise((resolve, reject) => {
      ipcRenderer.once('export-to-excel-result', (event, result) => {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });
    });
  },
  getAppPath: () => ipcRenderer.invoke('get-app-path')
});