import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { SmilePlus } from 'lucide-react'

const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍']

const ReactionPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative inline-block' ref={containerRef}>
      <button
        className='w-6 h-6 flex items-center justify-center rounded-full bg-transparent hover:bg-white/20 transition'
        onClick={() => setShowPicker((prev) => !prev)}
      >
        <SmilePlus className='w-4 h-4 text-gray-300' />
      </button>

      {/* Quick reactions */}
      {showPicker && (
        <div className='absolute z-50 bottom-full right-0 mb-2 bg-white p-1 px-2 rounded-full shadow-xl flex items-center space-x-2'>
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              className='text-xl hover:scale-125 transition-transform duration-150'
              onClick={() => {
                onSelect(emoji)
                setShowPicker(false)
              }}
            >
              {emoji}
            </button>
          ))}

          <button
            onClick={() => {
              setShowEmojiPicker(true)
              setShowPicker(false)
            }}
            className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300'
          >
            +
          </button>
        </div>
      )}

      {/* Emoji picker full */}
      {showEmojiPicker && (
        <div className='absolute z-50 bottom-full right-0 mb-3 translate-x-1/2'>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji)
              setShowEmojiPicker(false)
            }}
            height={350}
            width={300}
            theme={Theme.LIGHT}
          />
        </div>
      )}
    </div>
  )
}

export default ReactionPicker
