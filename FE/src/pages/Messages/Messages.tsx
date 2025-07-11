import { useContext, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { formatLastActive, formatToHourMinute, getDecodedToken } from '@/utils/helper/common'
import { IMessage, IQueryMessgae } from '@/utils/interface/message'
import { LoadingData, ReactionPicker } from '@/components/common'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { fetchMessages } from '@/thunks/message/messageThunk'
import { toast } from 'sonner'
import { getSocket, initSocket } from '@/utils/constants/websocket'
import { IAccount } from '@/utils/interface/auth'
import { NUMBER_ZERO } from '@/utils/constants/common'
import { findAllExcluding } from '@/thunks/user/userThunk'
import { Reply } from 'lucide-react'

export default function MessagePage() {
  const loadingContext = useContext(LoadingData)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.access_token)
  const currentUserId = getDecodedToken<IAccount>()?.MaNguoiDung

  const [users, setUsers] = useState<IAccount[]>([])
  const [selectedUser, setSelectedUser] = useState<IAccount | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([])
  const [userStatusMap, setUserStatusMap] = useState<Record<number, { isOnline: boolean; lastActive: string | null }>>(
    {}
  )
  const [tick, setTick] = useState<number>(NUMBER_ZERO)

  useEffect(() => {
    const savedStatusMap = localStorage.getItem('userStatusMap')
    if (savedStatusMap) {
      try {
        setUserStatusMap(JSON.parse(savedStatusMap))
      } catch {}
    }
    const interval = setInterval(() => setTick((prev) => prev + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (token) initSocket(token)
  }, [token])

  useEffect(() => {
    handleFindAllExcluding()
  }, [])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('onlineUsers', (userIds: number[]) => {
      setOnlineUserIds(userIds)

      setUserStatusMap((prev) => {
        const updated = { ...prev }
        const now = new Date().toISOString()

        userIds.forEach((id) => {
          updated[id] = { isOnline: true, lastActive: null }
        })

        Object.keys(updated).forEach((idStr) => {
          const id = parseInt(idStr)
          if (!userIds.includes(id)) {
            if (updated[id]?.isOnline !== false) {
              updated[id] = {
                isOnline: false,
                lastActive: now
              }
            }
          }
        })
        localStorage.setItem('userStatusMap', JSON.stringify(updated))
        return updated
      })
    })

    socket.on('messageReaction', ({ messageId, userId, emoji }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: [...(msg.reactions?.filter((r) => r.userId !== userId) || []), { userId, emoji }]
              }
            : msg
        )
      )
    })

    return () => {
      socket.off('onlineUsers')
      socket.off('messageReaction')
    }
  }, [])

  useEffect(() => {
    if (!selectedUser || !currentUserId) return
    const params: IQueryMessgae = {
      user1: currentUserId.toString(),
      user2: selectedUser.MaNguoiDung.toString()
    }
    handleListMessage(params)
  }, [selectedUser, currentUserId])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleReceiveMessage = (msg: IMessage) => {
      if (msg.senderId === selectedUser?.MaNguoiDung || msg.senderId === currentUserId) {
        setMessages((prev) => [...prev, msg])
      }
    }

    socket.on('receiveMessage', handleReceiveMessage)
    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [selectedUser, currentUserId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFindAllExcluding = async () => {
    try {
      loadingContext?.show()
      const res = await dispatch(findAllExcluding()).unwrap()
      setUsers(res.data)
      const savedUserId = localStorage.getItem('selectedUserId')
      if (savedUserId) {
        const found = res.data.find((u) => String(u.MaNguoiDung) === savedUserId)
        if (found) setSelectedUser(found)
      }
    } catch {
      toast.error('Lỗi khi gọi API!')
    } finally {
      loadingContext?.hide()
    }
  }

  const handleListMessage = async (payload: IQueryMessgae) => {
    try {
      loadingContext?.show()
      const res = await dispatch(fetchMessages(payload)).unwrap()
      setMessages(res.data)
    } catch {
      toast.error('Lỗi khi gọi API!')
    } finally {
      loadingContext?.hide()
    }
  }

  const handleSend = () => {
    if (!newMessage.trim()) return
    const socket = getSocket()
    if (!socket || !selectedUser || !currentUserId) return

    const msg = {
      senderId: currentUserId,
      receiverId: selectedUser.MaNguoiDung,
      content: newMessage,
      replyToMessageId: replyingTo?.id
    }

    socket.emit('sendMessage', msg)
    setMessages((prev) => [
      ...prev,
      {
        ...(msg as IMessage),
        timestamp: new Date().toISOString(),
        replyToMessage: replyingTo || undefined
      } as IMessage
    ])

    setNewMessage('')
    setReplyingTo(null)
  }

  const handleReactToMessage = (messageId: number, emoji: string) => {
    const socket = getSocket()
    if (!socket) return
    socket.emit('reactionMessage', { messageId, emoji, userId: currentUserId })
  }

  return (
    <div className='grid grid-cols-12 gap-4 h-[90vh] p-4'>
      <div className='max-h-[90vh] col-span-3 border-r dark:border-gray-700 flex flex-col'>
        <h2 className='text-lg font-semibold mb-4'>Danh sách</h2>
        <ul className='overflow-y-auto space-y-3 px-2 pb-7 flex-1 custom-scrollbar'>
          {users.map((user) => (
            <li
              key={user.MaNguoiDung}
              onClick={() => {
                localStorage.setItem('selectedUserId', user.MaNguoiDung.toString())
                setSelectedUser(user)
              }}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                selectedUser?.MaNguoiDung === user.MaNguoiDung ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
            >
              <div className='relative'>
                <Avatar className='w-9 h-9'>
                  <AvatarImage src={user?.AnhDaiDien as string} />
                  <AvatarFallback>{user?.TaiKhoan?.[0]}</AvatarFallback>
                </Avatar>
                {onlineUserIds.includes(user.MaNguoiDung) && (
                  <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full' />
                )}
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>{user.TaiKhoan}</span>
                <span className='text-xs text-gray-500'>
                  {userStatusMap[user.MaNguoiDung]?.isOnline
                    ? 'Đang hoạt động'
                    : formatLastActive(userStatusMap[user.MaNguoiDung]?.lastActive, tick)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='col-span-9'>
        <Card className='h-full max-h-[90vh] flex flex-col'>
          <CardHeader className='border-b border-gray-200 dark:border-gray-700'>
            <CardTitle className='text-base'>
              {selectedUser ? (
                <div className='flex flex-col'>
                  <span>Trò chuyện với {selectedUser.TaiKhoan}</span>
                  <span className='text-sm text-gray-500'>
                    {userStatusMap[selectedUser.MaNguoiDung]?.isOnline
                      ? 'Đang hoạt động'
                      : formatLastActive(userStatusMap[selectedUser.MaNguoiDung]?.lastActive, tick)}
                  </span>
                </div>
              ) : (
                'Chọn người để bắt đầu'
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className='flex-1 overflow-hidden flex flex-col'>
            <ScrollArea className='flex-1 pr-4 overflow-y-auto'>
              <div className='space-y-3 py-4'>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`group relative flex flex-col w-full ${
                      msg.senderId === currentUserId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`relative px-4 py-2 max-w-[75%] w-fit rounded-2xl shadow-md transition-all ${
                        msg.senderId === currentUserId
                          ? 'bg-[#04A7EB] text-white rounded-br-none'
                          : 'bg-[#133644] text-white rounded-bl-none'
                      }`}
                    >
                      {msg.replyToMessage && (
                        <div className='mb-2 px-3 py-2 rounded-xl  dark:bg-white/10'>
                          <p className='text-xs text-gray-800 dark:text-gray-100 italic opacity-90 line-clamp-2 break-words'>
                            {msg.replyToMessage.content}
                          </p>
                        </div>
                      )}

                      <p className='text-sm break-words whitespace-pre-wrap'>{msg.content}</p>

                      <div className='flex justify-between items-center mt-1 text-[10px] text-white/80 gap-2'>
                        <span>{formatToHourMinute(msg.timestamp || msg.createdAt)}</span>
                        <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className='flex items-center gap-1 text-blue-100 hover:underline'
                          >
                            <Reply size={12} strokeWidth={2} /> Trả lời
                          </button>
                          <ReactionPicker onSelect={(emoji) => handleReactToMessage(msg.id as number, emoji)} />
                        </div>
                      </div>
                    </div>

                    {(msg.reactions?.length ?? NUMBER_ZERO) > NUMBER_ZERO && (
                      <div
                        className={`mt-2 flex gap-1 items-center bg-white/90 dark:bg-white/10 text-sm rounded-full px-2 py-0.5 w-fit shadow-sm ${
                          msg.senderId === currentUserId ? 'ml-auto' : ''
                        }`}
                      >
                        {(msg.reactions ?? []).map((reaction, index) => (
                          <span key={index}>{reaction.emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
            </ScrollArea>

            {replyingTo && (
              <div className='flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-[#ffffffcc] dark:bg-[#1e2b3a] text-sm text-gray-800 dark:text-white'>
                <div className='flex-1 overflow-hidden'>
                  <span className='text-[10px] text-gray-500'>Đang trả lời:</span>
                  <p className='text-[12px] truncate'>{replyingTo.content}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className='ml-2 text-xs text-gray-500 hover:text-red-500'>
                  ✕
                </button>
              </div>
            )}

            <div className='mt-2 flex gap-2'>
              <Textarea
                placeholder='Nhập tin nhắn...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className='min-h-[40px] max-h-40 resize-none flex-1'
              />
              <Button onClick={handleSend}>Gửi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
