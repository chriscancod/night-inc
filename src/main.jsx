import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PublicLanding from './PublicLanding.jsx'
import CEODashboard  from './CEODashboard.jsx'
import FounderPortal from './FounderPortal.jsx'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const fn = () => setHash(window.location.hash)
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])
  return hash
}

function Root() {
  const hash = useHash()
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('night_authed') === '1'
  )

  // /founder route — always takes priority, handles its own auth
  if (hash === '#/founder') return <FounderPortal />

  // CEO God View — entered via TerminalGate on the landing page
  if (authed) {
    return <CEODashboard onLogout={() => {
      sessionStorage.removeItem('night_authed')
      setAuthed(false)
    }} />
  }

  return <PublicLanding onAuth={() => {
    sessionStorage.setItem('night_authed', '1')
    setAuthed(true)
  }} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)
