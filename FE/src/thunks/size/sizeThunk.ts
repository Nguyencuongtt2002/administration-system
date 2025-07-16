import sizeApi from '@/apis/size'
import { CREATE_SIZE, DELETE_SIZE, GET_LIST_SIZE, GET_SIZE_DETAILS, UPDATE_SIZE } from '@/utils/constants/actionType'
import { IQueryBase } from '@/utils/interface/common'
import { IAddSizeReq, IUpdateSize } from '@/utils/interface/size'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListSize = createAsyncThunk(GET_LIST_SIZE, async (payload: IQueryBase, { rejectWithValue }) => {
  try {
    const res = await sizeApi.getListSize(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getSizeDetails = createAsyncThunk(GET_SIZE_DETAILS, async (id: string, { rejectWithValue }) => {
  try {
    const res = await sizeApi.getSizeDetails(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createSize = createAsyncThunk(CREATE_SIZE, async (payload: IAddSizeReq, { rejectWithValue }) => {
  try {
    const res = await sizeApi.createSize(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateSize = createAsyncThunk(UPDATE_SIZE, async (payload: IUpdateSize, { rejectWithValue }) => {
  try {
    const res = await sizeApi.updateSize(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteSize = createAsyncThunk(DELETE_SIZE, async (id: string, { rejectWithValue }) => {
  try {
    const res = await sizeApi.deleteSize(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
