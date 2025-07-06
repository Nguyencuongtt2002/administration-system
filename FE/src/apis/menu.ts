import { IBaseResponse, IListDataResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { IQueryBase } from '@/utils/interface/common'
import { urlApiMenu } from '@/utils/constants/urlApi'
import { IAddMenuReq, IListMenu, IUpdateMenu } from '@/utils/interface/menu'

const menuApi = {
  getListMenu(query: IQueryBase) {
    const url = `${urlApiMenu.getAll}`
    return http.get<IBaseResponse<IListDataResponse<IListMenu[]>>>(url, {
      params: query
    })
  },

  createMenu(body: IAddMenuReq) {
    const url = `${urlApiMenu.createMenu}`
    return http.post<IBaseResponse>(url, body)
  },

  getMenuDetails(id: string) {
    const url = `${urlApiMenu.getMenuDetails(id)}`
    return http.get<IBaseResponse<IListMenu>>(url)
  },

  updateMenu(body: IUpdateMenu) {
    const url = `${urlApiMenu.updateMenu}`
    return http.patch<IBaseResponse>(url, body)
  },

  deleteMenu(id: string) {
    const url = `${urlApiMenu.deleteMenu(id)}`
    return http.delete<IBaseResponse>(url)
  }
}

export default menuApi
