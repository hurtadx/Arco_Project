import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './utils/fontAwesome' 
import { initErrorHandler } from './utils/errorHandler'
import { createElectronBridge } from './utils/electronBridge';

try {
  createElectronBridge();
  initErrorHandler();
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error during render:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h2>Error al cargar la aplicación</h2>
    <pre>${error.message}</pre>
  </div>`;
}
