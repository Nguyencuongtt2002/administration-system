import userApi from "@/apis/user";
import { GET_LIST_USER_EXCLUDING } from "@/utils/constants/actionType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findAllExcluding = createAsyncThunk(
  GET_LIST_USER_EXCLUDING,
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.findAllExcluding();
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
