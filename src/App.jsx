import UserCard from './components/UserCard'
import BalanceCard from './components/BalanceCard'
import PWAInstallPrompt from './components/PWAInstallPrompt'

function App() {
  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          User Dashboard
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <UserCard />
          <BalanceCard />
        </div>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

export default App

