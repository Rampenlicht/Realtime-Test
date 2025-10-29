import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import ConnectionStatus from './ConnectionStatus'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

function RealtimeChat() {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [currentUser] = useState(`User${Math.floor(Math.random() * 1000)}`)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  useEffect(() => {
    // Prüfe Supabase Konfiguration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl.includes('dein-projekt') || 
        supabaseKey.includes('dein-anon-key')) {
      setError('Supabase nicht konfiguriert. Bitte .env Datei einrichten.')
      console.error('❌ Supabase Konfiguration fehlt!')
      return
    }

    // Lade vorhandene Nachrichten
    loadMessages()

    // Erstelle Realtime Channel
    const channel = supabase
      .channel('realtime-chat')
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log('📨 Neue Nachricht empfangen:', payload)
        const newMessage = payload.payload
        setMessages((prev) => {
          // Vermeide Duplikate
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })
      })
      .subscribe((status) => {
        console.log('📡 Channel Status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          console.log('✅ Mit Supabase Realtime verbunden!')
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          console.log('❌ Verbindung getrennt')
        }
      })

    channelRef.current = channel

    // Cleanup beim Unmount
    return () => {
      console.log('🔌 Trenne Realtime Verbindung...')
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(50)

      if (error) {
        console.warn('⚠️ Konnte Nachrichten nicht laden:', error.message)
        // Kein Fehler setzen, falls Tabelle noch nicht existiert
        return
      }

      if (data) {
        setMessages(data)
        console.log(`✅ ${data.length} Nachrichten geladen`)
      }
    } catch (err) {
      console.warn('⚠️ Fehler beim Laden der Nachrichten:', err)
    }
  }

  const handleSendMessage = async (text) => {
    if (!isConnected) {
      console.error('❌ Nicht verbunden!')
      return
    }

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      username: currentUser,
      timestamp: new Date().toISOString()
    }

    try {
      // Speichere in Datenbank (optional)
      const { error: dbError } = await supabase
        .from('messages')
        .insert([newMessage])

      if (dbError) {
        console.warn('⚠️ Konnte Nachricht nicht speichern:', dbError.message)
        // Fahre trotzdem fort mit Broadcast
      }

      // Sende via Realtime Broadcast
      const { error: broadcastError } = await channelRef.current.send({
        type: 'broadcast',
        event: 'message',
        payload: newMessage
      })

      if (broadcastError) {
        console.error('❌ Broadcast Fehler:', broadcastError)
        setError('Nachricht konnte nicht gesendet werden')
        return
      }

      console.log('✅ Nachricht gesendet:', newMessage)
      
      // Füge Nachricht lokal hinzu
      setMessages((prev) => [...prev, newMessage])
    } catch (err) {
      console.error('❌ Fehler beim Senden:', err)
      setError('Fehler beim Senden der Nachricht')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
      {/* Header - Kompakt für Mobile */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" />
          <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
            {currentUser}
          </span>
        </div>
        <ConnectionStatus isConnected={isConnected} />
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mx-3 mt-3 sm:mx-4 sm:mt-4 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Messages - Nimmt verfügbaren Platz */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
      
      {/* Input - Fixed am unteren Rand */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!isConnected}
        />
      </div>
    </div>
  )
}

export default RealtimeChat

