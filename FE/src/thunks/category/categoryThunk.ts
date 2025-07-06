import categoryApi from "@/apis/category";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY_DETAILS,
  GET_LIST,
  UPDATE_CATEGORY,
} from "@/utils/constants/actionType";
import { IAddCategoryReq, IUpdateCategory } from "@/utils/interface/category";
import { IQueryBase } from "@/utils/interface/common";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListCategory = createAsyncThunk(
  GET_LIST,
  async (payload: IQueryBase, { rejectWithValue }) => {
    try {
      const res = await categoryApi.getListCategory(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCategoryDetails = createAsyncThunk(
  GET_CATEGORY_DETAILS,
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await categoryApi.getCategoryDetails(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCategory = createAsyncThunk(
  CREATE_CATEGORY,
  async (payload: IAddCategoryReq, { rejectWithValue }) => {
    try {
      const res = await categoryApi.createCategory(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  UPDATE_CATEGORY,
  async (payload: IUpdateCategory, { rejectWithValue }) => {
    try {
      const res = await categoryApi.updateCategory(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  DELETE_CATEGORY,
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await categoryApi.deleteCategory(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
