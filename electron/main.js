import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'
import { initialize, enable } from '@electron/remote/main/index.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'  // Añadir esta importación

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

initialize()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,  // Ventana más grande para mejor visualización
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  enable(mainWindow.webContents)

  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : formatUrl({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      });
  
  console.log('Loading URL:', startUrl);
  
  mainWindow.loadURL(startUrl)
  
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Configurar el manejo de exportación a Excel
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

// Manejo de solicitudes para obtener la ruta de la aplicación
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});