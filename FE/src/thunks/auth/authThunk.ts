import authApi from '@/apis/auth'
import { CHECK_CODE, LOGIN, REGISTER, RESEND_CODE, RETRY_ACTIVE } from '@/utils/constants/actionType'
import { IBodyCodeActive, IBodyLogin, IBodyRegister } from '@/utils/interface/auth'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const handleLogin = createAsyncThunk(LOGIN, async (payload: IBodyLogin, { rejectWithValue }) => {
  try {
    const resp = await authApi.login(payload)

    return resp?.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const handleRegister = createAsyncThunk(REGISTER, async (payload: IBodyRegister, { rejectWithValue }) => {
  try {
    const resp = await authApi.register(payload)

    return resp?.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const handleCheckCode = createAsyncThunk(CHECK_CODE, async (payload: IBodyCodeActive, { rejectWithValue }) => {
  try {
    const resp = await authApi.handleCheckCode(payload)

    return resp?.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const handleResendCode = createAsyncThunk(
  RESEND_CODE,
  async (payload: { MaNguoiDung: number }, { rejectWithValue }) => {
    try {
      const resp = await authApi.handleResendCode(payload)

      return resp?.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const handleRetryActive = createAsyncThunk(
  RETRY_ACTIVE,
  async (payload: { Email: string }, { rejectWithValue }) => {
    try {
      const resp = await authApi.handleRetryActive(payload)

      return resp?.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
