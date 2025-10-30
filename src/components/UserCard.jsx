import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import QRCode from 'react-qr-code'

function UserCard({ userId }) {
  const [user, setUser] = useState(null)
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
        {/* User Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header mit Gradient */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 sm:p-8 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{user.name}</h2>
            <p className="text-blue-100 text-sm sm:text-base">{user.email}</p>
          </div>

          {/* QR Code Section */}
          <div className="p-6 sm:p-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 flex flex-col items-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                QR-Code
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCode
                  value={user.qrcode_id}
                  size={200}
                  level="H"
                  fgColor="#1e40af"
                />
              </div>
              <div className="mt-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono text-center">
                  {user.qrcode_id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard

