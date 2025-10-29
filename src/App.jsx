import RealtimeChat from './components/RealtimeChat'
import PWAInstallPrompt from './components/PWAInstallPrompt'

function App() {
  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Realtime Chat
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            Supabase Realtime
          </p>
        </div>
        <RealtimeChat />
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

export default App

