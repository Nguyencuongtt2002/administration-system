export interface IQueryNotification {
  page: string
  limit: string
}

export interface INotification {
  id?: number
  content: string
  is_read: boolean
  created_at: string
}

export interface INotificationResponseData<T = INotification> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
