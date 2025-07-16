import { urlApiNotification } from '@/utils/constants/urlApi'
import { IBaseResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { INotificationResponseData, IQueryNotification } from '@/utils/interface/notification'

const notificationApi = {
  getListNotification(data: { userId: string; query: IQueryNotification }) {
    const url = `${urlApiNotification.getListNotification(data.userId)}`
    return http.get<IBaseResponse<INotificationResponseData>>(url, {
      params: data.query
    })
  }
}

export default notificationApi
