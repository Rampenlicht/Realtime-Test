import { useState, useEffect } from 'react'

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      // Verhindere das Mini-Infobar auf Mobile
      e.preventDefault()
      // Speichere das Event für später
      setDeferredPrompt(e)
      // Zeige den Install-Button
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Prüfe ob bereits installiert
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Zeige den Install-Prompt
    deferredPrompt.prompt()

    // Warte auf die User-Entscheidung
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)

    // Setze das Prompt zurück
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const handleDismiss = () => {
    setShowInstall(false)
    // Merke dir für 7 Tage
    localStorage.setItem('pwa-dismissed', Date.now().toString())
  }

  // Prüfe ob kürzlich dismissed wurde
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      if (daysSince < 7) {
        setShowInstall(false)
      }
    }
  }, [])

  if (!showInstall) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              App installieren
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Installiere die App für schnelleren Zugriff und Offline-Nutzung
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium rounded-lg transition-all duration-200 active:scale-95"
              >
                Installieren
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-all duration-200"
              >
                Später
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt

