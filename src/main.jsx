import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter } from 'react-router-dom' 
import './utils/fontAwesome'
import { initErrorHandler } from './utils/errorHandler'
import { createElectronBridge } from './utils/electronBridge';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> 
      <App />
    </HashRouter>
  </React.StrictMode>
)

try {
  createElectronBridge();
} catch (error) {
  console.error('Error al crear el puente con Electron:', error);
}

