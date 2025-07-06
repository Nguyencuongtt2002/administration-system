import brandApi from "@/apis/brand";
import {
  CREATE_BRAND,
  DELETE_BRAND,
  GET_BRAND_DETAILS,
  GET_LIST_BRAND,
  UPDATE_BRAND,
} from "@/utils/constants/actionType";
import { IAddBrandReq, IUpdateBrand } from "@/utils/interface/brand";
import { IQueryBase } from "@/utils/interface/common";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListBrand = createAsyncThunk(
  GET_LIST_BRAND,
  async (payload: IQueryBase, { rejectWithValue }) => {
    try {
      const res = await brandApi.getListBrand(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getBrandDetails = createAsyncThunk(
  GET_BRAND_DETAILS,
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await brandApi.getBrandDetails(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createBrand = createAsyncThunk(
  CREATE_BRAND,
  async (payload: IAddBrandReq, { rejectWithValue }) => {
    try {
      const res = await brandApi.createBrand(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateBrand = createAsyncThunk(
  UPDATE_BRAND,
  async (payload: IUpdateBrand, { rejectWithValue }) => {
    try {
      const res = await brandApi.updateBrand(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  DELETE_BRAND,
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await brandApi.deleteBrand(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
