import slideApi from '@/apis/slide'
import {
  CREATE_SLIDE,
  DELETE_SLIDE,
  GET_LIST_SLIDE,
  GET_SLIDE_DETAILS,
  UPDATE_SLIDE
} from '@/utils/constants/actionType'
import { IQueryBase } from '@/utils/interface/common'
import { IAddSlideReq, IUpdateSlide } from '@/utils/interface/slide'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListSlides = createAsyncThunk(GET_LIST_SLIDE, async (payload: IQueryBase, { rejectWithValue }) => {
  try {
    const res = await slideApi.getListSlides(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getSlideDetails = createAsyncThunk(GET_SLIDE_DETAILS, async (id: string, { rejectWithValue }) => {
  try {
    const res = await slideApi.getSlideDetails(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createSlide = createAsyncThunk(CREATE_SLIDE, async (payload: IAddSlideReq, { rejectWithValue }) => {
  try {
    const res = await slideApi.createSlide(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateSlide = createAsyncThunk(UPDATE_SLIDE, async (payload: IUpdateSlide, { rejectWithValue }) => {
  try {
    const res = await slideApi.updateSlide(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteSlide = createAsyncThunk(DELETE_SLIDE, async (id: string, { rejectWithValue }) => {
  try {
    const res = await slideApi.deleteSlide(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
