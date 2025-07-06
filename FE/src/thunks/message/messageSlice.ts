// src/redux/slices/messageSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages } from "./messageThunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {})
      .addCase(fetchMessages.fulfilled, (state, action) => {})
      .addCase(fetchMessages.rejected, (state, action) => {});
  },
});

const messageReducer = messageSlice.reducer;
export default messageReducer;
