// src/redux/slices/messageSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { fetchNotifications } from './notificationThunk'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {})
      .addCase(fetchNotifications.fulfilled, (state, action) => {})
      .addCase(fetchNotifications.rejected, (state, action) => {})
  }
})

const notificationReducer = notificationSlice.reducer
export default notificationReducer
