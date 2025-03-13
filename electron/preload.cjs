const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    const validChannels = ['toMain', 'setTitle', 'log-error', 'export-to-excel'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain', 'export-to-excel-result'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  invoke: (channel, ...args) => {
    const validChannels = [
      'check-lock', 
      'acquire-lock', 
      'release-lock',
      'get-data-path',
      'set-data-path',
      'load-excel-data',
      'save-excel-data',
      'create-backup',
      'export-dialog',
      'import-excel-file',
      'check-connection',
      'get-app-path'
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Canal no válido: ${channel}`));
  }
});