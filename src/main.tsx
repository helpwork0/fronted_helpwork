import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { bootstrap } from './app/bootstrap'
import './styles/index.css'

// Se llama ANTES de renderizar: así React ya arranca con el estado correcto
bootstrap()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
