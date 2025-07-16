// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { createSize, deleteSize, getSizeDetails, getListSize, updateSize } from './sizeThunk'
import { RootState } from '@/utils/redux/store'

export interface ISizeState {
  isRefreshList: boolean
}

const initialState: ISizeState = {
  isRefreshList: false
}

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload
    }
  },
  extraReducers(builder) {
    // GET: get list size
    builder
      .addCase(getListSize.pending, (state) => {})
      .addCase(getListSize.fulfilled, (state) => {})
      .addCase(getListSize.rejected, (state) => {})

    // GET: get size detail
    builder
      .addCase(getSizeDetails.pending, (state) => {})
      .addCase(getSizeDetails.fulfilled, (state) => {})
      .addCase(getSizeDetails.rejected, (state) => {})

    // Create size
    builder
      .addCase(createSize.pending, (state) => {})
      .addCase(createSize.fulfilled, (state) => {})
      .addCase(createSize.rejected, (state) => {})

    // Update size
    builder
      .addCase(updateSize.pending, (state) => {})
      .addCase(updateSize.fulfilled, (state) => {})
      .addCase(updateSize.rejected, (state) => {})

    // delete size
    builder
      .addCase(deleteSize.pending, (state) => {})
      .addCase(deleteSize.fulfilled, (state) => {})
      .addCase(deleteSize.rejected, (state) => {})
  }
})

// Action
export const sizeActions = sizeSlice.actions

// Selectors
export const selectIsRefreshSizeList = (state: RootState) => state.size.isRefreshList

// Reducer
const sizeReducer = sizeSlice.reducer
export default sizeReducer
