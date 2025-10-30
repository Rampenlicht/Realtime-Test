import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function BalanceCard({ userId }) {
  const [balance, setBalance] = useState(null)
  const [user, setUser] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Prüfe Supabase Konfiguration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl.includes('dein-projekt') || 
        supabaseKey.includes('dein-anon-key')) {
      setError('Supabase nicht konfiguriert. Bitte .env Datei einrichten.')
      setLoading(false)
      return
    }

    // Lade initiale Balance
    loadBalance()

    // Subscribe zu Realtime Updates für Balance-Änderungen
    const channel = supabase
      .channel('balance-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: userId ? `id=eq.${userId}` : undefined
        },
        (payload) => {
          console.log('💰 Balance aktualisiert:', payload)
          const updatedUser = payload.new
          
          // Aktualisiere nur wenn es der richtige User ist
          if (!userId || updatedUser.id === userId) {
            setBalance(parseFloat(updatedUser.balance))
            setUser(updatedUser)
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Balance Realtime Status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          console.log('✅ Balance Realtime verbunden!')
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          console.log('❌ Balance Realtime getrennt')
        }
      })

    return () => {
      console.log('🔌 Trenne Balance Realtime...')
      supabase.removeChannel(channel)
    }
  }, [userId])

  const loadBalance = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('users')
        .select('*')

      if (userId) {
        query = query.eq('id', userId)
      }

      const { data, error: fetchError } = await query.single()

      if (fetchError) {
        // Wenn kein User gefunden, lade ersten User
        const { data: firstUser, error: firstError } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .single()

        if (firstError) {
          console.error('❌ Konnte User nicht laden:', firstError)
          setError('Keine User gefunden. Bitte Datenbank einrichten.')
          return
        }

        setBalance(parseFloat(firstUser.balance))
        setUser(firstUser)
        console.log('✅ Balance geladen:', firstUser.balance)
      } else {
        setBalance(parseFloat(data.balance))
        setUser(data)
        console.log('✅ Balance geladen:', data.balance)
      }
    } catch (err) {
      console.error('❌ Fehler beim Laden:', err)
      setError('Fehler beim Laden der Balance')
    } finally {
      setLoading(false)
    }
  }

  // Demo-Funktion zum Testen
  const updateBalance = async (amount) => {
    if (!user) return

    try {
      const newBalance = parseFloat(user.balance) + amount

      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id)

      if (updateError) {
        console.error('❌ Konnte Balance nicht aktualisieren:', updateError)
        setError('Fehler beim Aktualisieren der Balance')
        return
      }

      console.log('✅ Balance aktualisiert')
    } catch (err) {
      console.error('❌ Fehler beim Update:', err)
      setError('Fehler beim Aktualisieren')
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || balance === null) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <div className="text-red-600 dark:text-red-400 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            {error || 'Fehler beim Laden'}
          </h3>
          <button
            onClick={loadBalance}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Connection Status */}
      <div className="flex justify-center mb-3">
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
          ${isConnected 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {isConnected ? 'Realtime aktiv' : 'Verbinde...'}
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Gradient Header mit Balance */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
          {/* Animated Background Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          </div>
          
          <div className="relative">
            <p className="text-sm text-green-100 mb-2 font-medium">Aktuelles Guthaben</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl sm:text-6xl font-bold tracking-tight">
                {balance.toFixed(2)}
              </span>
              <span className="text-3xl font-semibold text-green-100">€</span>
            </div>
            {user && (
              <p className="text-sm text-green-100 mt-3 opacity-90">{user.name}</p>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Updates in Echtzeit</span>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
            Demo: Balance ändern
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateBalance(10)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all active:scale-95"
            >
              <span className="text-xl">+</span>
              <span className="text-xs">10 €</span>
            </button>
            <button
              onClick={() => updateBalance(50)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95"
            >
              <span className="text-xl">+</span>
              <span className="text-xs">50 €</span>
            </button>
            <button
              onClick={() => updateBalance(-10)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all active:scale-95"
            >
              <span className="text-xl">−</span>
              <span className="text-xs">10 €</span>
            </button>
          </div>
        </div>

        {/* Last Update */}
        {user && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Letztes Update: {new Date(user.updated_at).toLocaleTimeString('de-DE')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BalanceCard

