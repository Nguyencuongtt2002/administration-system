import contactApi from '@/apis/contact'
import {
  CREATE_CONTACT,
  DELETE_CONTACT,
  GET_CONTACT_DETAILS,
  GET_LIST_CONTACT,
  UPDATE_CONTACT
} from '@/utils/constants/actionType'
import { IQueryBase } from '@/utils/interface/common'
import { IAddContactReq, IUpdateContact } from '@/utils/interface/contact'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListContact = createAsyncThunk(GET_LIST_CONTACT, async (payload: IQueryBase, { rejectWithValue }) => {
  try {
    const res = await contactApi.getListContact(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getContactDetails = createAsyncThunk(GET_CONTACT_DETAILS, async (id: string, { rejectWithValue }) => {
  try {
    const res = await contactApi.getContactDetails(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createContact = createAsyncThunk(CREATE_CONTACT, async (payload: IAddContactReq, { rejectWithValue }) => {
  try {
    const res = await contactApi.createContact(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateContact = createAsyncThunk(UPDATE_CONTACT, async (payload: IUpdateContact, { rejectWithValue }) => {
  try {
    const res = await contactApi.updateContact(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteContact = createAsyncThunk(DELETE_CONTACT, async (id: string, { rejectWithValue }) => {
  try {
    const res = await contactApi.deleteContact(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
