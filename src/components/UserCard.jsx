import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import QRCode from 'react-qr-code'

function UserCard({ userId }) {
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

    // Lade User-Daten
    loadUser()

    // Subscribe zu Realtime Updates
    const channel = supabase
      .channel('user-balance-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: userId ? `id=eq.${userId}` : undefined
        },
        (payload) => {
          console.log('💰 Guthaben aktualisiert:', payload)
          const updatedUser = payload.new
          
          setUser((prev) => {
            if (prev && prev.id === updatedUser.id) {
              return updatedUser
            }
            return prev
          })
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime Status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        }
      })

    return () => {
      console.log('🔌 Trenne Realtime Verbindung...')
      supabase.removeChannel(channel)
    }
  }, [userId])

  const loadUser = async () => {
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

        setUser(firstUser)
        console.log('✅ User geladen:', firstUser)
      } else {
        setUser(data)
        console.log('✅ User geladen:', data)
      }
    } catch (err) {
      console.error('❌ Fehler beim Laden:', err)
      setError('Fehler beim Laden der User-Daten')
    } finally {
      setLoading(false)
    }
  }

  const updateBalance = async (amount) => {
    if (!user) return

    try {
      const newBalance = parseFloat(user.balance) + amount

      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id)

      if (updateError) {
        console.error('❌ Konnte Guthaben nicht aktualisieren:', updateError)
        setError('Fehler beim Aktualisieren des Guthabens')
        return
      }

      console.log('✅ Guthaben aktualisiert')
    } catch (err) {
      console.error('❌ Fehler beim Update:', err)
      setError('Fehler beim Aktualisieren')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade User-Daten...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            {error || 'Fehler beim Laden'}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Bitte prüfe die Supabase-Konfiguration und stelle sicher, dass die users-Tabelle existiert.
          </p>
          <button
            onClick={loadUser}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Connection Status */}
        <div className="flex justify-center mb-4">
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
            ${isConnected 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isConnected ? 'Realtime aktiv' : 'Verbinde...'}
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header mit Gradient */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-blue-100 text-sm">{user.email}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <p className="text-xs font-medium">ID: {user.qrcode_id}</p>
              </div>
            </div>

            {/* Guthaben - Groß angezeigt */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-100 mb-1">Aktuelles Guthaben</p>
              <p className="text-4xl font-bold">
                {parseFloat(user.balance).toFixed(2)} €
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                QR-Code zum Scannen
              </p>
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  value={user.qrcode_id}
                  size={200}
                  level="H"
                  fgColor="#1e40af"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                {user.qrcode_id}
              </p>
            </div>
          </div>

          {/* Action Buttons - Für Demo */}
          <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              Demo: Guthaben ändern
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateBalance(10)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all active:scale-95"
              >
                <span className="text-xl">+</span>
                <span>10 €</span>
              </button>
              <button
                onClick={() => updateBalance(-10)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all active:scale-95"
              >
                <span className="text-xl">−</span>
                <span>10 €</span>
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Erstellt: {new Date(user.created_at).toLocaleDateString('de-DE')}</span>
              <span>Update: {new Date(user.updated_at).toLocaleTimeString('de-DE')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard

