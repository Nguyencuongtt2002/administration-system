// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { createSlide, deleteSlide, getSlideDetails, getListSlides, updateSlide } from './slideThunk'
import { RootState } from '@/utils/redux/store'

export interface ISlideState {
  isRefreshList: boolean
}

const initialState: ISlideState = {
  isRefreshList: false
}

const slideSlice = createSlice({
  name: 'slide',
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload
    }
  },
  extraReducers(builder) {
    // GET: get list slide
    builder
      .addCase(getListSlides.pending, (state) => {})
      .addCase(getListSlides.fulfilled, (state) => {})
      .addCase(getListSlides.rejected, (state) => {})

    // GET: get slide detail
    builder
      .addCase(getSlideDetails.pending, (state) => {})
      .addCase(getSlideDetails.fulfilled, (state) => {})
      .addCase(getSlideDetails.rejected, (state) => {})

    // Create slide
    builder
      .addCase(createSlide.pending, (state) => {})
      .addCase(createSlide.fulfilled, (state) => {})
      .addCase(createSlide.rejected, (state) => {})

    // Update slide
    builder
      .addCase(updateSlide.pending, (state) => {})
      .addCase(updateSlide.fulfilled, (state) => {})
      .addCase(updateSlide.rejected, (state) => {})

    // delete slide
    builder
      .addCase(deleteSlide.pending, (state) => {})
      .addCase(deleteSlide.fulfilled, (state) => {})
      .addCase(deleteSlide.rejected, (state) => {})
  }
})

// Action
export const slideActions = slideSlice.actions

// Selectors
export const selectIsRefreshSlideList = (state: RootState) => state.slide.isRefreshList

// Reducer
const slideReducer = slideSlice.reducer
export default slideReducer
