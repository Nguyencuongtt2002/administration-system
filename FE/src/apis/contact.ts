import { urlApiContact } from '@/utils/constants/urlApi'
import { IBaseResponse, IListDataResponse } from '@/utils/interface/base'
import http from './axios.customize'
import { IQueryBase } from '@/utils/interface/common'
import { IAddContactReq, IListContact, IUpdateContact } from '@/utils/interface/contact'

const contactApi = {
  getListContact(query: IQueryBase) {
    const url = `${urlApiContact.getAll}`
    return http.get<IBaseResponse<IListDataResponse<IListContact[]>>>(url, {
      params: query
    })
  },

  createContact(body: IAddContactReq) {
    const url = `${urlApiContact.createContact}`
    return http.post<IBaseResponse>(url, body)
  },

  getContactDetails(id: string) {
    const url = `${urlApiContact.getContactDetails(id)}`
    return http.get<IBaseResponse<IListContact>>(url)
  },

  updateContact(body: IUpdateContact) {
    const url = `${urlApiContact.updateContact}`
    return http.patch<IBaseResponse>(url, body)
  },

  deleteContact(id: string) {
    const url = `${urlApiContact.deleteContact(id)}`
    return http.delete<IBaseResponse>(url)
  }
}

export default contactApi
