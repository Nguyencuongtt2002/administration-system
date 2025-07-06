// src/components/MessageIcon.tsx

import React from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface MessageIconProps {
  unreadCount?: number
  to?: string
}

const MessageComponent = ({ unreadCount = 0, to = '/admin/message' }: MessageIconProps) => {
  return (
    <Link
      to={to}
      className='relative inline-flex items-center justify-center size-9 rounded-md border transition hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
      aria-label='Tin nhắn'
    >
      <FiMessageSquare className='text-foreground' size={18} />
      {unreadCount > 0 && (
        <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white bg-red-600 rounded-full shadow-lg animate-pulse'>
          {unreadCount}
        </span>
      )}
    </Link>
  )
}

export default React.memo(MessageComponent)
