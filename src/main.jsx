import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import './utils/fontAwesome'
import { initErrorHandler } from './utils/errorHandler'
import { createElectronBridge } from './utils/electronBridge';


createElectronBridge();

initErrorHandler();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
