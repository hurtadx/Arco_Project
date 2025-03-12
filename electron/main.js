import { app, BrowserWindow } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'
import { initialize, enable } from '@electron/remote/main/index.js'
import fs from 'fs'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

initialize()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
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
  
  
  mainWindow.webContents.openDevTools()

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

const directories = [
  'src/components/ObjectChange',
  'src/components/EquipmentChange',
  'src/utils',
  'src/data'
]

directories.forEach(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true })
  }
})