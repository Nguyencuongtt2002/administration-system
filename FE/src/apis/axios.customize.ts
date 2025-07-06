import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/utils/constants/auth'
import path from '@/utils/routes/path'
import { IResponseLogin, RefreshTokenReponse } from '@/utils/interface/auth'
import { IBaseResponse } from '@/utils/interface/base'
import { toast } from 'sonner'
import i18n from 'i18next'

class Http {
  instance: AxiosInstance
  private accessToken: string = ''
  private refreshToken: string = ''
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Gắn token vào request
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Xử lý response
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        // Nếu là login
        if (url === path.login) {
          const data = response.data as IBaseResponse<IResponseLogin>
          console.log(data)

          const access_token = data?.data?.access_token
          const refresh_token = data.data.refreshToken

          this.setAccessToken(access_token)
          this.setRefreshToken(refresh_token)
          toast.success(i18n.t('auth_login_success'))
        }

        // Nếu là logout
        if (url === path.logout) {
          this.clearAccessToken()
        }

        return response
      },
      (error: AxiosError) => {
        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          const data = error.response?.data as { message?: string }
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          console.log('error.response?.status', error.response)
          const responseData = error.response?.data as { statusCode?: number }
          if (responseData.statusCode === 401 && url !== '/auth/refresh-token') {
            // Hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }

          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(data?.message || 'Unauthorized')
          // window.location.reload()
        }

        return Promise.reject(error)
      }
    )
  }

  setAccessToken(token: string) {
    this.accessToken = token
    setAccessTokenToLS(token)
  }

  setRefreshToken(token: string) {
    this.refreshToken = token
    setRefreshTokenToLS(token)
  }

  clearAccessToken() {
    this.accessToken = ''
    this.refreshToken = ''
    clearLS()
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>('/v1/auth/refresh-token', {
        refreshToken: this.refreshToken
      })
      .then((res) => {
        const { access_token, refreshToken } = res.data.data
        console.log(access_token, refreshToken)

        setAccessTokenToLS(access_token)
        setRefreshTokenToLS(refreshToken)
        this.accessToken = access_token
        this.refreshToken = refreshToken
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const httpInstance = new Http()
const http = httpInstance.instance

export { httpInstance }
export default http
