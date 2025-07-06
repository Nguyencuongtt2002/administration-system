// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { createMenu, deleteMenu, getMenuDetails, getListMenu, updateMenu } from './menuThunk'
import { RootState } from '@/utils/redux/store'

export interface IMenuState {
  isRefreshList: boolean
}

const initialState: IMenuState = {
  isRefreshList: false
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload
    }
  },
  extraReducers(builder) {
    // GET: get list menu
    builder
      .addCase(getListMenu.pending, (state) => {})
      .addCase(getListMenu.fulfilled, (state) => {})
      .addCase(getListMenu.rejected, (state) => {})

    // GET: get menu detail
    builder
      .addCase(getMenuDetails.pending, (state) => {})
      .addCase(getMenuDetails.fulfilled, (state) => {})
      .addCase(getMenuDetails.rejected, (state) => {})

    // Create menu
    builder
      .addCase(createMenu.pending, (state) => {})
      .addCase(createMenu.fulfilled, (state) => {})
      .addCase(createMenu.rejected, (state) => {})

    // Update menu
    builder
      .addCase(updateMenu.pending, (state) => {})
      .addCase(updateMenu.fulfilled, (state) => {})
      .addCase(updateMenu.rejected, (state) => {})

    // delete menu
    builder
      .addCase(deleteMenu.pending, (state) => {})
      .addCase(deleteMenu.fulfilled, (state) => {})
      .addCase(deleteMenu.rejected, (state) => {})
  }
})

// Action
export const menuActions = menuSlice.actions

// Selectors
export const selectIsRefreshMenuList = (state: RootState) => state.menu.isRefreshList

// Reducer
const menuReducer = menuSlice.reducer
export default menuReducer
