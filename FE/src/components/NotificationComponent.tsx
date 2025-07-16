import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { FiBell } from 'react-icons/fi'
import { jwtDecode } from 'jwt-decode'
import { getDecodedToken } from '@/utils/helper/common'
import { IAccount } from '@/utils/interface/auth'
import { getSocket, initSocket } from '@/utils/constants/websocket'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { Button, Card, CardContent, CardHeader, CardTitle, LoadingData, ScrollArea } from '@/components/common'
import { INotification, INotificationResponseData } from '@/utils/interface/notification'
import { fetchNotifications } from '@/thunks/notification/notificationThunk'
import { DEFAULT_LIMIT_PAGE, NUMBER_ONE } from '@/utils/constants/common'
import { toast } from 'sonner'

interface Notification {
  content: string
  created_at: string
  isRead: boolean
}

interface DecodedToken {
  MaNguoiDung: number
  [key: string]: any
}

const NotificationComponent = () => {
  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.access_token)
  const userId = useAppSelector((state) => state.auth.user.MaNguoiDung)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [open, setOpen] = useState(false)
  const [decoded, setDecoded] = useState<DecodedToken | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [totalNotificationCount, setTotalNotificationCount] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Khởi tạo socket
  useEffect(() => {
    if (token) initSocket(token)
  }, [token])

  // Lấy userId từ token và gọi API lần đầu
  useEffect(() => {
    handleGetListNotifications(1)
  }, [])

  const handleGetListNotifications = useCallback(
    (pageNumber: number) => {
      console.log(pageNumber)

      if (!userId) return

      loadingContext?.show()

      dispatch(
        fetchNotifications({
          userId: String(userId),
          query: {
            page: String(pageNumber),
            limit: String(3)
          }
        })
      )
        .unwrap()
        .then((res) => {
          const {
            data: { data: rawData, total, page, totalPages }
          } = res
          const newData = (rawData || []).map((noti) => ({
            ...noti,
            is_read: noti.is_read ?? false
          }))
          if (pageNumber === NUMBER_ONE) {
            setNotifications(newData)
          } else {
            setNotifications((prev) => {
              const prevIds = new Set(prev.map((n) => n.id))
              const unique = newData.filter((n) => !prevIds.has(n.id))
              return [...prev, ...unique]
            })
          }
          setTotalNotificationCount(total || 0)
          setPage(pageNumber)
          setHasMore(page < totalPages)
        })
        .catch(() => {
          toast.error('Lỗi khi tải danh sách!')
        })
        .finally(() => {
          loadingContext?.hide()
        })
    },
    [userId]
  )

  // SOCKET: nhận thông báo realtime
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('receiveNotification', (data) => {
      const newNoti: INotification = {
        content: data.content,
        created_at: new Date(data.timestamp).toISOString(),
        is_read: false
      }
      setNotifications((prev) => [newNoti, ...prev])
      setTotalNotificationCount((prev) => prev + 1)
    })

    return () => {
      socket.off('receiveNotification')
    }
  }, [])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (scrollTop < 10 && page > 1 && !loading) {
      await sleep(1000) // ⏳ Chờ 10 giây
      handleGetListNotifications(NUMBER_ONE)
      return
    }

    if (scrollHeight - scrollTop - clientHeight < 10 && hasMore && !loading) {
      await sleep(1000) // ⏳ Chờ 10 giây
      handleGetListNotifications(page + NUMBER_ONE)
    }
  }

  // Đánh dấu thông báo là đã đọc khi nhấp và

  const sendTestNotification = () => {
    if (!decoded?.MaNguoiDung) return
    const socket = getSocket()
    if (!socket) return

    socket.emit('sendNotification', {
      sender_id: decoded.MaNguoiDung,
      receiver_id: decoded.MaNguoiDung,
      content: `Người dùng ${decoded.MaNguoiDung} đã đặt đơn hàng #${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className='size-9 inline-flex border items-center justify-center rounded-md text-sm font-medium bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 relative'
        aria-label='Notifications'
      >
        <FiBell size={18} className='text-foreground' />
        {totalNotificationCount > 0 && (
          <span className='absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded-full shadow-lg animate-pulse'>
            {totalNotificationCount} {/* Hiển thị số thông báo chưa đọc */}
          </span>
        )}
      </Button>

      {open && (
        <div className='absolute right-0 mt-2 w-90 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50'>
          <Card className='max-w-full m-0 shadow-none rounded-none'>
            <CardHeader className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
              <CardTitle className='text-lg font-semibold'>Thông báo</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setNotifications([])}
                className='text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900'
              >
                Xóa tất cả
              </Button>
            </CardHeader>
            <CardContent className='p-4'>
              <Button onClick={sendTestNotification} className='mb-4 w-full' variant='default'>
                Gửi test notification
              </Button>
              <ScrollArea
                ref={scrollAreaRef}
                onScroll={handleScroll}
                className='max-h-64 overflow-y-auto custom-scrollbar'
              >
                {notifications.length === 0 ? (
                  <p className='text-center text-sm text-gray-500 dark:text-gray-400 select-none'>
                    Không có thông báo mới
                  </p>
                ) : (
                  <ul className='flex flex-col gap-3'>
                    {notifications.map((noti, idx) => (
                      <li
                        key={`${noti.created_at}-${idx}`}
                        className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer ${
                          noti.is_read ? '' : 'bg-gray-300 dark:bg-gray-800'
                        }`}
                      >
                        <p className='text-gray-800 dark:text-gray-200'>{noti.content}</p>
                        <time className='block text-xs text-gray-500 dark:text-gray-400 mt-1 select-none'>
                          {new Date(noti.created_at).toLocaleString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
                {hasMore && (
                  <div className='py-3 flex justify-center'>
                    <div className='w-6 h-6 inline-block box-border animate-spin rounded-full border-2 border-picton-blue-500 border-b-transparent border-solid'></div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default React.memo(NotificationComponent)
