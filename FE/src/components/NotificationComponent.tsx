import { useEffect, useState, useRef } from 'react'
import { FiBell } from 'react-icons/fi'
import { jwtDecode } from 'jwt-decode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getDecodedToken } from '@/utils/helper/common'
import { IAccount } from '@/utils/interface/auth'
import { getSocket, initSocket } from '@/utils/constants/websocket'
import { useAppSelector } from '@/utils/redux/hooks'

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
  const token = useAppSelector((state) => state.auth.access_token)
  const [notifications, setNotifications] = useState<Notification[]>([])
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
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken)
        setDecoded(decodedToken)
        fetchNotifications(1)
      } catch (err) {
        console.error('Decode token failed', err)
      }
    }
  }, [])

  const fetchNotifications = async (pageNumber: number) => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('access_token')
      const userId = getDecodedToken<IAccount>()?.MaNguoiDung
      const response = await fetch(
        `http://localhost:8080/api/v1/notifications/receiver/${userId}?page=${pageNumber}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      const result = await response.json()

      const newData = (result.data.data || []).map((noti: any) => ({
        ...noti,
        isRead: noti.isRead ?? false // Giả sử API trả về isRead, nếu không thì mặc định là false
      }))
      if (pageNumber === 1) {
        setNotifications(newData)
      } else {
        setNotifications((prev) => [...prev, ...newData])
      }
      setTotalNotificationCount(result.data.total || 0)
      setPage(pageNumber)
      setHasMore(result.data.page < result.data.totalPages)
    } catch (err) {
      console.error('Fetch notifications failed', err)
    } finally {
      setLoading(false)
    }
  }

  // SOCKET: nhận thông báo realtime
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('receiveNotification', (data) => {
      const newNoti: Notification = {
        content: data.content,
        created_at: new Date(data.timestamp).toISOString(),
        isRead: false // Thông báo mới từ socket mặc định là chưa đọc
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

  // Load thêm khi scroll gần cuối, reset khi scroll lên đầu
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (scrollTop < 10 && page > 1 && !loading) {
      fetchNotifications(1)
      return
    }

    if (scrollHeight - scrollTop - clientHeight < 10 && hasMore && !loading) {
      fetchNotifications(page + 1)
    }
  }

  // Đánh dấu thông báo là đã đọc khi nhấp vào
  const markAsRead = async (index: number) => {
    const notification = notifications[index]
    if (notification.isRead) return // Nếu đã đọc thì không làm gì

    try {
      const accessToken = localStorage.getItem('access_token')
      // Giả sử có API để đánh dấu thông báo là đã đọc
      await fetch(`http://localhost:8080/api/v1/notifications/${notification.created_at}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      // Cập nhật trạng thái client-side
      setNotifications((prev) => prev.map((noti, i) => (i === index ? { ...noti, isRead: true } : noti)))
    } catch (err) {
      console.error('Mark notification as read failed', err)
    }
  }

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
                          noti.isRead ? '' : 'bg-gray-300 dark:bg-gray-800'
                        }`}
                        onClick={() => markAsRead(idx)}
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

export default NotificationComponent
