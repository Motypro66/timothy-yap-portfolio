import { createRoot } from 'react-dom/client'
import App from './App'
import AppErrorBoundary from './components/ui/AppErrorBoundary'
import './styles/globals.css'
import './styles/room-journey.css'

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
)
