// Libs
import { createSlice } from '@reduxjs/toolkit'

// Others
import { createContact, deleteContact, getContactDetails, getListContact, updateContact } from './contactThunk'
import { RootState } from '@/utils/redux/store'

export interface IContactState {
  isRefreshList: boolean
}

const initialState: IContactState = {
  isRefreshList: false
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload
    }
  },
  extraReducers(builder) {
    // GET: get list contact
    builder
      .addCase(getListContact.pending, (state) => {})
      .addCase(getListContact.fulfilled, (state) => {})
      .addCase(getListContact.rejected, (state) => {})

    // GET: get contact detail
    builder
      .addCase(getContactDetails.pending, (state) => {})
      .addCase(getContactDetails.fulfilled, (state) => {})
      .addCase(getContactDetails.rejected, (state) => {})

    // Create contact
    builder
      .addCase(createContact.pending, (state) => {})
      .addCase(createContact.fulfilled, (state) => {})
      .addCase(createContact.rejected, (state) => {})

    // Update contact
    builder
      .addCase(updateContact.pending, (state) => {})
      .addCase(updateContact.fulfilled, (state) => {})
      .addCase(updateContact.rejected, (state) => {})

    // delete contact
    builder
      .addCase(deleteContact.pending, (state) => {})
      .addCase(deleteContact.fulfilled, (state) => {})
      .addCase(deleteContact.rejected, (state) => {})
  }
})

// Action
export const contactActions = contactSlice.actions

// Selectors
export const selectIsRefreshContactList = (state: RootState) => state.contact.isRefreshList

// Reducer
const contactReducer = contactSlice.reducer
export default contactReducer
