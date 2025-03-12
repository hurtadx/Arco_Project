const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {

    const validChannels = ['toMain', 'setTitle']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      
      ipcRenderer.removeAllListeners(channel)
      
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})