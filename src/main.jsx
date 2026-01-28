import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Register Service Worker
registerSW({ immediate: true })

// Global error handling for PWA/Chunk loading issues
window.addEventListener('error', (e) => {
  if (e.message.includes('ChunkLoadError') || e.message.includes('Loading chunk')) {
    console.warn('Chunk loading error detected - forcing refresh...');
    window.location.reload(true);
  }
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
