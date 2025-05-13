const { contextBridge, ipcRenderer } = require('electron');
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');


const DEFAULT_DATA_PATH = 'P:\\ArcoData';
let userDataPath = DEFAULT_DATA_PATH;


try {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.dataPath && fs.existsSync(config.dataPath)) {
      userDataPath = config.dataPath;
    }
  }
} catch (error) {
  console.error('Error al cargar la configuración:', error);
}

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
      'reset-data-path',      
      'select-folder-dialog', 
      'check-folder-access',  
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
    
    return Promise.reject(new Error(`Canal no permitido: ${channel}`));
  }
});

ipcMain.handle('get-data-path', () => {
  return userDataPath;
});

ipcMain.handle('set-data-path', async (event, newPath) => {
  try {
    
    if (!fs.existsSync(newPath)) {
      return { success: false, message: 'La carpeta no existe' };
    }
    
    
    try {
      const testFile = path.join(newPath, 'write-test.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    } catch (err) {
      return { success: false, message: 'No tiene permisos de escritura en esta carpeta' };
    }
    
    
    userDataPath = newPath;
    
    
    const configPath = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify({ dataPath: newPath }));
    
    return { success: true };
  } catch (error) {
    console.error('Error al configurar ruta de datos:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('reset-data-path', async () => {
  try {
    userDataPath = DEFAULT_DATA_PATH;
    
    
    const configPath = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify({ dataPath: DEFAULT_DATA_PATH }));
    
    return { success: true, path: DEFAULT_DATA_PATH };
  } catch (error) {
    console.error('Error al restablecer ruta de datos:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('select-folder-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Seleccione la carpeta para los archivos de datos',
    buttonLabel: 'Seleccionar'
  });
  
  if (result.canceled) {
    return { canceled: true };
  }
  
  return { canceled: false, filePath: result.filePaths[0] };
});

ipcMain.handle('check-folder-access', (event, folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) {
      return { success: false, message: 'La carpeta no existe' };
    }
    
    
    const testFile = path.join(folderPath, 'access-test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});