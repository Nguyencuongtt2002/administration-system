import { IBaseResponse, IListDataResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { IQueryBase } from '@/utils/interface/common'
import { urlApiSize } from '@/utils/constants/urlApi'
import { IAddSizeReq, IListSize, IUpdateSize } from '@/utils/interface/size'

const sizeApi = {
  getListSize(query: IQueryBase) {
    const url = `${urlApiSize.getAll}`
    return http.get<IBaseResponse<IListDataResponse<IListSize[]>>>(url, {
      params: query
    })
  },

  createSize(body: IAddSizeReq) {
    const url = `${urlApiSize.createSize}`
    return http.post<IBaseResponse>(url, body)
  },

  getSizeDetails(id: string) {
    const url = `${urlApiSize.getSizeDetails(id)}`
    return http.get<IBaseResponse<IListSize>>(url)
  },

  updateSize(body: IUpdateSize) {
    const url = `${urlApiSize.updateSize}`
    return http.patch<IBaseResponse>(url, body)
  },

  deleteSize(id: string) {
    const url = `${urlApiSize.deleteSize(id)}`
    return http.delete<IBaseResponse>(url)
  }
}

export default sizeApi
