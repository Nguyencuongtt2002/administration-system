import menuApi from '@/apis/menu'
import { CREATE_MENU, DELETE_MENU, GET_LIST_MENU, GET_MENU_DETAILS, UPDATE_MENU } from '@/utils/constants/actionType'
import { IQueryBase } from '@/utils/interface/common'
import { IAddMenuReq, IUpdateMenu } from '@/utils/interface/menu'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListMenu = createAsyncThunk(GET_LIST_MENU, async (payload: IQueryBase, { rejectWithValue }) => {
  try {
    const res = await menuApi.getListMenu(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getMenuDetails = createAsyncThunk(GET_MENU_DETAILS, async (id: string, { rejectWithValue }) => {
  try {
    const res = await menuApi.getMenuDetails(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createMenu = createAsyncThunk(CREATE_MENU, async (payload: IAddMenuReq, { rejectWithValue }) => {
  try {
    const res = await menuApi.createMenu(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateMenu = createAsyncThunk(UPDATE_MENU, async (payload: IUpdateMenu, { rejectWithValue }) => {
  try {
    const res = await menuApi.updateMenu(payload)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteMenu = createAsyncThunk(DELETE_MENU, async (id: string, { rejectWithValue }) => {
  try {
    const res = await menuApi.deleteMenu(id)
    return res.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
