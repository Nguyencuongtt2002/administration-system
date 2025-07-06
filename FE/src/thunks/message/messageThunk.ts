// src/redux/thunks/messageThunks.ts
import messageApi from "@/apis/message";
import { GET_LIST_MESSAGE } from "@/utils/constants/actionType";
import { IQueryMessgae } from "@/utils/interface/message";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessages = createAsyncThunk(
  GET_LIST_MESSAGE,
  async (payload: IQueryMessgae, { rejectWithValue }) => {
    try {
      const res = await messageApi.fetchMessages(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
