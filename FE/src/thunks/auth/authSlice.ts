// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { handleCheckCode, handleLogin, handleRegister, handleResendCode, handleRetryActive } from './authThunk'
import { IAccount } from '@/utils/interface/auth'
import { RootState } from '@/utils/redux/store'
import { StorageEnum } from '@/utils/enum/common'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/utils/constants/auth'
import { getDecodedToken } from '@/utils/helper/common'
import { EMPTY_STRING } from '@/utils/constants/common'

export interface AuthState {
  access_token: string
  user: IAccount
  isRefreshProfile: boolean
  isAuthenticated: boolean
  refreshToken: string
}

const initialState: AuthState = {
  access_token: getAccessTokenFromLS(),
  refreshToken: getRefreshTokenFromLS(),
  user: {} as IAccount,
  isRefreshProfile: false,
  isAuthenticated: Boolean(getAccessTokenFromLS())
}

console.log('Initial Auth State:', initialState)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    handleLogout(state) {
      localStorage.removeItem(StorageEnum.ACCESS_TOKEN)
      localStorage.removeItem(StorageEnum.REFRESH_TOKEN)
      state.access_token = EMPTY_STRING
      state.refreshToken = EMPTY_STRING
      state.user = {} as IAccount
      state.isAuthenticated = false
      state.isRefreshProfile = false
    },

    setAccessToken(state, action) {
      state.access_token = action.payload
      const decodedUser = getDecodedToken<IAccount>()
      if (decodedUser) {
        state.user = decodedUser
      }
    },

    setRefreshToken(state, action) {
      state.refreshToken = action.payload
    },

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    }
  },
  extraReducers(builder) {
    // POST: login
    builder
      .addCase(handleLogin.pending, (state) => {})
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.data.user
      })
      .addCase(handleLogin.rejected, (state) => {})

    // POST: register
    builder
      .addCase(handleRegister.pending, (state) => {})
      .addCase(handleRegister.fulfilled, (state, action) => {})
      .addCase(handleRegister.rejected, (state) => {})

    // POST: check code
    builder
      .addCase(handleCheckCode.pending, (state) => {})
      .addCase(handleCheckCode.fulfilled, (state, action) => {})
      .addCase(handleCheckCode.rejected, (state) => {})

    // POST: resend code
    builder
      .addCase(handleResendCode.pending, (state) => {})
      .addCase(handleResendCode.fulfilled, (state, action) => {})
      .addCase(handleResendCode.rejected, (state) => {})

    // POST: retry active
    builder
      .addCase(handleRetryActive.pending, (state) => {})
      .addCase(handleRetryActive.fulfilled, (state, action) => {})
      .addCase(handleRetryActive.rejected, (state) => {})
  }
})

export const authActions = authSlice.actions

export const selectAccessToken = (state: RootState) => state.auth.access_token
export const selectUserProfile = (state: RootState) => state.auth.user
export const selectIsRefreshProfile = (state: RootState) => state.auth.isRefreshProfile

const authReducer = authSlice.reducer
export default authReducer
