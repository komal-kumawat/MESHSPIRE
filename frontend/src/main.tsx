import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'
import { SocketProvider } from './providers/SocketProvider.tsx'
import { PeerProvider } from './providers/PeerProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <PeerProvider>
          <App />

        </PeerProvider>
      </SocketProvider>

    </AuthProvider>
  </StrictMode>,
)
