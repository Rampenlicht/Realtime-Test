function ConnectionStatus({ isConnected }) {
  return (
    <div className={`
      flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full
      text-[10px] sm:text-xs font-medium transition-all duration-300 whitespace-nowrap
      ${isConnected 
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      }
    `}>
      <div className={`
        w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse-slow flex-shrink-0
        ${isConnected ? 'bg-green-500' : 'bg-red-500'}
      `} />
      <span className="hidden xs:inline sm:inline">
        {isConnected ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}

export default ConnectionStatus

