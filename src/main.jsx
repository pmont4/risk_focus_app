import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { RiskFocusApp } from './app/RiskFocusApp'
import { LogInProvider } from './context/provider/LogInProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LogInProvider>
        <RiskFocusApp />
      </LogInProvider>
    </BrowserRouter>
  </StrictMode>,
)
