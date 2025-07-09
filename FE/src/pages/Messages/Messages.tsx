// MessagePage.tsx – có hỗ trợ chức năng reply

import { useContext, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { formatLastActive, formatToHourMinute, getDecodedToken } from '@/utils/helper/common'
import { IMessage, IQueryMessgae } from '@/utils/interface/message'
import { LoadingData } from '@/components/common'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { fetchMessages } from '@/thunks/message/messageThunk'
import { toast } from 'sonner'
import { getSocket, initSocket } from '@/utils/constants/websocket'
import { IAccount } from '@/utils/interface/auth'
import { NUMBER_ONE, NUMBER_ZERO } from '@/utils/constants/common'
import { findAllExcluding } from '@/thunks/user/userThunk'
import { Reply } from 'lucide-react'

export default function MessagePage() {
  const loadingContext = useContext(LoadingData)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.access_token)
  const currentUserId = getDecodedToken<IAccount>()?.MaNguoiDung
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
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
        const parsedMap = JSON.parse(savedStatusMap)
        setUserStatusMap(parsedMap)
      } catch (err) {
        console.error('Lỗi khi parse userStatusMap từ localStorage:', err)
      }
    }

    const interval = setInterval(() => {
      setTick((prev) => prev + NUMBER_ONE)
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (token) {
      initSocket(token)
    }
  }, [])

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
              updated[id] = { isOnline: false, lastActive: now }
            }
          }
        })

        localStorage.setItem('userStatusMap', JSON.stringify(updated))
        return updated
      })
    })

    return () => {
      socket.off('onlineUsers')
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

    socket.on('receiveMessage', (msg: IMessage) => {
      if (msg.senderId === selectedUser?.MaNguoiDung || msg.senderId === currentUserId) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.off('receiveMessage')
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleFindAllExcluding = async () => {
    try {
      loadingContext?.show()
      const res = await dispatch(findAllExcluding()).unwrap()
      const usersData = res.data
      setUsers(usersData)
      const savedUserId = localStorage.getItem('selectedUserId')
      if (savedUserId) {
        const foundUser = usersData.find((user) => String(user.MaNguoiDung) === savedUserId)
        if (foundUser) setSelectedUser(foundUser)
      }
      const savedStatusMap = localStorage.getItem('userStatusMap')
      let currentStatusMap: Record<number, { isOnline: boolean; lastActive: string | null }> = {}

      if (savedStatusMap) {
        try {
          currentStatusMap = JSON.parse(savedStatusMap)
        } catch (err) {
          console.error('Lỗi khi parse userStatusMap từ localStorage:', err)
        }
      }

      usersData.forEach((user: any) => {
        const existing = currentStatusMap[user.MaNguoiDung]
        currentStatusMap[user.MaNguoiDung] = {
          isOnline: existing?.isOnline ?? false,
          lastActive: existing?.lastActive ?? null
        }
      })

      setUserStatusMap(currentStatusMap)
    } catch (err) {
      console.error('Lỗi khi fetch users:', err)
      toast.error('Lỗi khi gọi API!')
    } finally {
      loadingContext?.hide()
    }
  }

  const handleListMessage = (payload: IQueryMessgae) => {
    loadingContext?.show()
    dispatch(fetchMessages(payload))
      .unwrap()
      .then((res) => {
        setMessages(res.data)
      })
      .catch(() => {
        toast.error('Lỗi khi gọi api!')
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handleSend = () => {
    if (!newMessage.trim()) return

    const msg = {
      senderId: currentUserId,
      receiverId: selectedUser.MaNguoiDung,
      content: newMessage,
      replyToMessageId: replyingTo?.id
    }

    const socket = getSocket()
    if (!socket) return

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

  const handleSelectUser = (user: IAccount) => {
    localStorage.setItem('selectedUserId', user.MaNguoiDung.toString())
    setSelectedUser(user)
  }

  return (
    <div className='grid grid-cols-12 gap-4 h-[90vh] p-4'>
      <div className='max-h-[90vh] col-span-3 border-r dark:border-gray-700 flex flex-col'>
        <h2 className='text-lg font-semibold mb-4'>Danh sách</h2>
        <ul className='overflow-y-auto space-y-3 px-2 pb-7 flex-1 custom-scrollbar'>
          {users?.map((user) => {
            const isOnline = onlineUserIds.includes(user.MaNguoiDung)
            return (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                  selectedUser?.MaNguoiDung === user.MaNguoiDung ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                <div className='relative'>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={user?.AnhDaiDien} />
                    <AvatarFallback>{user?.TaiKhoan?.[0]}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full' />
                  )}
                </div>
                <span>{user?.TaiKhoan}</span>
              </li>
            )
          })}
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
                {messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-2xl w-fit max-w-[80%] ${
                      msg.senderId === currentUserId ? 'bg-[#04A7EB] text-white ml-auto' : 'bg-[#133644] text-white'
                    }`}
                  >
                    {msg.replyToMessage && (
                      <div className='mb-2 px-3 py-2 text-xs rounded-lg bg-white/10 border-l-4 border-blue-400 text-gray-100'>
                        <p className='line-clamp-2 break-words italic opacity-90'>{msg.replyToMessage.content}</p>
                      </div>
                    )}

                    <p className='text-sm break-words whitespace-pre-wrap'>{msg.content}</p>
                    <p className='text-[10px] text-gray-200 mt-1'>
                      {(() => {
                        const time = msg.timestamp || msg.createdAt
                        return formatToHourMinute(time)
                      })()}
                    </p>

                    <button
                      onClick={() => setReplyingTo(msg)}
                      className='flex items-center gap-1 text-[10px] text-blue-200 hover:underline mt-1'
                    >
                      <Reply size={12} strokeWidth={2} />
                      Trả lời
                    </button>
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
            </ScrollArea>

            {replyingTo && (
              <div className='flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-[#f0f2f5] text-sm text-gray-800'>
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
