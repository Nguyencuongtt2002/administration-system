import { IBaseResponse, IListDataResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { IQueryBase } from '@/utils/interface/common'
import { urlApiSlide } from '@/utils/constants/urlApi'
import { IAddSlideReq, IListSlide, IUpdateSlide } from '@/utils/interface/slide'

const slideApi = {
  getListSlides(query: IQueryBase) {
    const url = `${urlApiSlide.getAll}`
    return http.get<IBaseResponse<IListDataResponse<IListSlide[]>>>(url, {
      params: query
    })
  },

  createSlide(body: IAddSlideReq) {
    const url = `${urlApiSlide.createSlide}`
    return http.post<IBaseResponse>(url, body)
  },

  getSlideDetails(id: string) {
    const url = `${urlApiSlide.getSlideDetails(id)}`
    return http.get<IBaseResponse<IListSlide>>(url)
  },

  updateSlide(body: IUpdateSlide) {
    const url = `${urlApiSlide.updateSlide}`
    return http.patch<IBaseResponse>(url, body)
  },

  deleteSlide(id: string) {
    const url = `${urlApiSlide.deleteSlide(id)}`
    return http.delete<IBaseResponse>(url)
  }
}

export default slideApi
