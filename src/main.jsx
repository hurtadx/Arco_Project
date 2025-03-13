import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './utils/fontAwesome' 
import { initErrorHandler } from './utils/errorHandler'
import { createElectronBridge } from './utils/electronBridge';


createElectronBridge();

initErrorHandler();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
