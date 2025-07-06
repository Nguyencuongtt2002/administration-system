import { IBodyCodeActive, IBodyLogin, IBodyRegister, IResponseLogin } from '@/utils/interface/auth'
import { urlApiAuth } from '@/utils/constants/urlApi'
import { IBaseResponse } from '@/utils/interface/base'
import http from './axios.customize'

const authApi = {
  login(payload: IBodyLogin) {
    const url = `${urlApiAuth.login}`
    return http.post<IBaseResponse<IResponseLogin>>(url, payload)
  },

  register(payload: IBodyRegister) {
    const url = `${urlApiAuth.register}`
    return http.post<IBaseResponse<{ id: string }>>(url, payload)
  },

  handleCheckCode(payload: IBodyCodeActive) {
    const url = `${urlApiAuth.handleCheckCode}`
    return http.post<IBaseResponse>(url, payload)
  },

  handleResendCode(payload: { MaNguoiDung: number }) {
    const url = `${urlApiAuth.handleResendCode}`
    return http.post<IBaseResponse>(url, payload)
  }
}

export default authApi
