import { useEffect, useRef } from 'react'

function MessageList({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-full overflow-y-auto p-2.5 sm:p-4 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-12">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm sm:text-base font-medium">Noch keine Nachrichten</p>
          <p className="text-xs sm:text-sm mt-1 opacity-70">Sende die erste Nachricht!</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="p-2.5 sm:p-3.5 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm animate-fade-in shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-center mb-1.5 sm:mb-2 gap-2">
                <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                  {msg.username || msg.user || 'Anonym'}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

export default MessageList

