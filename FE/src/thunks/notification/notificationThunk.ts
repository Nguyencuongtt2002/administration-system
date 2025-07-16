// src/redux/thunks/messageThunks.ts
import notificationApi from '@/apis/notification'
import { GET_LIST_NOTIFICATION } from '@/utils/constants/actionType'
import { IQueryNotification } from '@/utils/interface/notification'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchNotifications = createAsyncThunk(
  GET_LIST_NOTIFICATION,
  async (data: { userId: string; query: IQueryNotification }, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getListNotification(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
