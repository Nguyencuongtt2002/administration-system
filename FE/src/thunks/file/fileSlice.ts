// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { uploadSingleFile } from './fileThunk'

const fileSlice = createSlice({
  name: 'file',
  initialState: {},
  reducers: {},
  extraReducers(builder) {
    // POST: upload single file
    builder
      .addCase(uploadSingleFile.pending, (state) => {})
      .addCase(uploadSingleFile.fulfilled, (state) => {})
      .addCase(uploadSingleFile.rejected, (state) => {})
  }
})

// Action
export const fileActions = fileSlice.actions

// Reducer
const fileReducer = fileSlice.reducer
export default fileReducer
