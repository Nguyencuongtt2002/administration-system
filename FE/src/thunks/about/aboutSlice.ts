// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { createAbout, getAboutDetails, getListAbout, updateAbout, deleteAbout } from './aboutThunk'
import { RootState } from '@/utils/redux/store'

export interface IAboutState {
  isRefreshList: boolean
}

const initialState: IAboutState = {
  isRefreshList: false
}

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload
    }
  },
  extraReducers(builder) {
    // GET: get list about
    builder
      .addCase(getListAbout.pending, (state) => {})
      .addCase(getListAbout.fulfilled, (state) => {})
      .addCase(getListAbout.rejected, (state) => {})

    // GET: get about detail
    builder
      .addCase(getAboutDetails.pending, (state) => {})
      .addCase(getAboutDetails.fulfilled, (state) => {})
      .addCase(getAboutDetails.rejected, (state) => {})

    // Create about
    builder
      .addCase(createAbout.pending, (state) => {})
      .addCase(createAbout.fulfilled, (state) => {})
      .addCase(createAbout.rejected, (state) => {})

    // Update about
    builder
      .addCase(updateAbout.pending, (state) => {})
      .addCase(updateAbout.fulfilled, (state) => {})
      .addCase(updateAbout.rejected, (state) => {})

    // delete about
    builder
      .addCase(deleteAbout.pending, (state) => {})
      .addCase(deleteAbout.fulfilled, (state) => {})
      .addCase(deleteAbout.rejected, (state) => {})
  }
})

// Action
export const aboutActions = aboutSlice.actions

// Selectors
export const selectIsRefreshAboutList = (state: RootState) => state.about.isRefreshList

// Reducer
const aboutReducer = aboutSlice.reducer
export default aboutReducer
