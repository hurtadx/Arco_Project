const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const XLSX = require('xlsx');
const { enable } = require('@electron/remote/main');

const { initialize } = require('@electron/remote/main');
const { fileURLToPath } = require('url');
const { dirname } = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false 
    }
  });

  enable(mainWindow.webContents);

  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : formatUrl({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      });
  
  console.log('Loading URL:', startUrl);
  
  mainWindow.loadURL(startUrl);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('export-to-excel', (event, { type, data }) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    
    dialog.showSaveDialog({
      title: 'Guardar reporte',
      defaultPath: `reporte-${type}-${new Date().toISOString().split('T')[0]}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    }).then(result => {
      if (!result.canceled && result.filePath) {
        XLSX.writeFile(workbook, result.filePath);
        event.reply('export-to-excel-result', { success: true, path: result.filePath });
      }
    }).catch(err => {
      console.error('Error en diálogo de guardado:', err);
      event.reply('export-to-excel-result', { success: false, error: err.message });
    });
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    event.reply('export-to-excel-result', { success: false, error: error.message });
  }
});


ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});


let dataDir = 'P:\\ArcoData';


if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (error) {
    console.error(`Error al crear directorio ${dataDir}:`, error);
    dataDir = path.join(app.getPath('userData'), 'ArcoData');
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

console.log('Usando directorio de configuración:', dataDir);
console.log('Usando directorio de datos:', dataDir);


const LOCK_FILE = 'arco-lock.json';
const LOCK_TIMEOUT = 5 * 60 * 1000; 


const checkIfLocked = () => {
  const lockPath = path.join(dataDir, LOCK_FILE);
  
  if (!fs.existsSync(lockPath)) return { isLocked: false };
  
  try {
    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    
    
    const isOurLock = lockData.hostname === os.hostname() && 
                      lockData.username === os.userInfo().username;
    
    
    if (isOurLock) return { isLocked: false };
    
    
    const lockTime = new Date(lockData.timestamp).getTime();
    const now = Date.now();
    
    if (now - lockTime > LOCK_TIMEOUT) {
      
      try {
        fs.unlinkSync(lockPath);
        return { isLocked: false };
      } catch {
        
        return { 
          isLocked: true, 
          lockedBy: `${lockData.username}@${lockData.hostname} (expirado)` 
        };
      }
    }
    
    
    return { 
      isLocked: true, 
      lockedBy: `${lockData.username}@${lockData.hostname}` 
    };
    
  } catch (error) {
    console.error('Error al verificar el bloqueo:', error);
    return { 
      isLocked: true, 
      error: 'Error al verificar bloqueo' 
    };
  }
};


const acquireLock = () => {
  const lockStatus = checkIfLocked();
  
  if (lockStatus.isLocked) {
    return { 
      success: false, 
      message: lockStatus.lockedBy 
        ? `Los datos están siendo editados por ${lockStatus.lockedBy}` 
        : 'Los datos están siendo editados por otro usuario'
    };
  }
  
  const lockPath = path.join(dataDir, LOCK_FILE);
  const lockData = {
    username: os.userInfo().username,
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error al adquirir bloqueo:', error);
    return { success: false, message: 'Error al adquirir bloqueo: ' + error.message };
  }
};


const releaseLock = () => {
  const lockPath = path.join(dataDir, LOCK_FILE);
  
  if (!fs.existsSync(lockPath)) return { success: true };
  
  try {
    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    
    
    if (lockData.hostname === os.hostname() && 
        lockData.username === os.userInfo().username) {
      fs.unlinkSync(lockPath);
      return { success: true };
    }
    
    return { 
      success: false, 
      message: 'No puedes liberar un bloqueo que pertenece a otro usuario' 
    };
  } catch (error) {
    console.error('Error al liberar bloqueo:', error);
    return { success: false, message: 'Error al liberar bloqueo: ' + error.message };
  }
};


ipcMain.handle('check-lock', async () => {
  return checkIfLocked();
});

ipcMain.handle('acquire-lock', async () => {
  return acquireLock();
});

ipcMain.handle('release-lock', async () => {
  return releaseLock();
});

ipcMain.handle('get-data-path', async () => {
  return dataDir;
});

ipcMain.handle('set-data-path', async (event, newPath) => {
  if (fs.existsSync(newPath)) {
    dataDir = newPath;
    return { success: true, path: dataDir };
  }
  return { success: false, message: 'La carpeta no existe' };
});


app.on('will-quit', () => {
  releaseLock();
});


ipcMain.handle('load-excel-data', async (event, args) => {
  try {
    const { fileName, sheet } = args;
    const filePath = path.join(dataDir, fileName);
    
    
    if (!fs.existsSync(filePath)) {
      return { success: true, data: [] };
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = sheet || workbook.SheetNames[0];
    
    if (!workbook.SheetNames.includes(sheetName)) {
      
      return { success: true, data: [] };
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al cargar datos Excel:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('save-excel-data', async (event, args) => {
  try {
    const { fileName, sheet, data } = args;
    const filePath = path.join(dataDir, fileName);
    
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet || 'Hoja1');
    
    
    XLSX.writeFile(workbook, filePath);
    
    return { success: true };
  } catch (error) {
    console.error('Error al guardar datos Excel:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('create-backup', async (event, args) => {
  try {
    const { fileName } = args;
    const filePath = path.join(dataDir, fileName);
    
    
    if (!fs.existsSync(filePath)) {
      return { success: true, message: 'No existe archivo para respaldar' };
    }
    
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(dataDir, 'backups');
    
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupPath = path.join(
      backupDir, 
      `${path.parse(fileName).name}_${timestamp}${path.parse(fileName).ext}`
    );
    
    
    fs.copyFileSync(filePath, backupPath);
    
    return { success: true, backupPath };
  } catch (error) {
    console.error('Error al crear backup:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('export-dialog', async (event, args) => {
  try {
    const { fileName, sheet, data } = args;
    
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet || 'Hoja1');
    
    
    const result = await dialog.showSaveDialog({
      title: 'Exportar datos',
      defaultPath: fileName,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    });
    
    if (result.canceled) {
      return { success: false, message: 'Operación cancelada por el usuario' };
    }
    
    
    XLSX.writeFile(workbook, result.filePath);
    
    return { success: true, filePath: result.filePath };
  } catch (error) {
    console.error('Error en exportación:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('import-excel-file', async (event, args) => {
  try {
    const { filePath, targetFile, sheet } = args;
    
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'El archivo seleccionado no existe' };
    }
    
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = sheet || workbook.SheetNames[0];
    
    if (!workbook.SheetNames.includes(sheetName)) {
      return { success: false, error: `La hoja "${sheetName}" no existe en el archivo` };
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      return { success: false, error: 'El archivo no contiene datos' };
    }
    
    
    if (targetFile) {
      await ipcMain.handle('create-backup', event, { fileName: targetFile });
      
      
      const targetPath = path.join(dataDir, targetFile);
      XLSX.writeFile(workbook, targetPath);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al importar Excel:', error);
    return { success: false, error: error.message };
  }
});



ipcMain.handle('check-connection', async () => {
  try {
    
    fs.accessSync(dataDir, fs.constants.R_OK | fs.constants.W_OK);
    
    
    const testFile = path.join(dataDir, '.connection-test');
    fs.writeFileSync(testFile, new Date().toISOString());
    fs.unlinkSync(testFile); 
    
    return { connected: true };
  } catch (error) {
    console.error('Error de conexión a carpeta compartida:', error);
    return { 
      connected: false, 
      error: error.message || 'Error de acceso a carpeta compartida'
    };
  }
});