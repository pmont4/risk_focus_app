import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { RiskFocusApp } from './app/RiskFocusApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RiskFocusApp />
    </BrowserRouter>
  </StrictMode>,
)
