import { IBaseResponse, IListDataResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { IQueryBase } from '@/utils/interface/common'
import { IAddAboutReq, IListAbout, IUpdateAbout } from '@/utils/interface/about'
import { urlApiAbout } from '@/utils/constants/urlApi'

const aboutApi = {
  getListAbout(query: IQueryBase) {
    const url = `${urlApiAbout.getAll}`
    return http.get<IBaseResponse<IListDataResponse<IListAbout[]>>>(url, {
      params: query
    })
  },

  createAbout(body: IAddAboutReq) {
    const url = `${urlApiAbout.createAbout}`
    return http.post<IBaseResponse>(url, body)
  },

  getAboutDetails(id: string) {
    const url = `${urlApiAbout.getAboutDetails(id)}`
    return http.get<IBaseResponse<IListAbout>>(url)
  },

  updateAbout(body: IUpdateAbout) {
    const url = `${urlApiAbout.updateAbout}`
    return http.patch<IBaseResponse>(url, body)
  },

  deleteAbout(id: string) {
    const url = `${urlApiAbout.deleteAbout(id)}`
    return http.delete<IBaseResponse>(url)
  }
}

export default aboutApi
