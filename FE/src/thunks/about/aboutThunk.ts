import aboutApi from '@/apis/about'
import {
  CREATE_ABOUT,
  DELETE_ABOUT,
  GET_ABOUT_DETAILS,
  GET_LIST_ABOUT,
  UPDATE_ABOUT
} from '@/utils/constants/actionType'
import { IAddAboutReq, IUpdateAbout } from '@/utils/interface/about'
import { IQueryBase } from '@/utils/interface/common'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListAbout = createAsyncThunk(GET_LIST_ABOUT, async (payload: IQueryBase, { rejectWithValue }) => {
  try {
    const res = await aboutApi.getListAbout(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getAboutDetails = createAsyncThunk(GET_ABOUT_DETAILS, async (id: string, { rejectWithValue }) => {
  try {
    const res = await aboutApi.getAboutDetails(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createAbout = createAsyncThunk(CREATE_ABOUT, async (payload: IAddAboutReq, { rejectWithValue }) => {
  try {
    const res = await aboutApi.createAbout(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateAbout = createAsyncThunk(UPDATE_ABOUT, async (payload: IUpdateAbout, { rejectWithValue }) => {
  try {
    const res = await aboutApi.updateAbout(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteAbout = createAsyncThunk(DELETE_ABOUT, async (id: string, { rejectWithValue }) => {
  try {
    const res = await aboutApi.deleteAbout(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
