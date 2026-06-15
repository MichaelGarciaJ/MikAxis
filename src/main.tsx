import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/toast-context';

/**
 * Punto de entrada principal de React.
 * Renderiza el componente App dentro de StrictMode para alertas adicionales de React.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
