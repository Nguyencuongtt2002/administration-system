// src/store/slices/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { IAccount } from "@/utils/interface/auth";
import { findAllExcluding } from "./userThunk";

interface UserState {
  list: IAccount[];
}

const initialState: UserState = {
  list: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findAllExcluding.pending, (state) => {})
      .addCase(findAllExcluding.fulfilled, (state, action) => {})
      .addCase(findAllExcluding.rejected, (state, action) => {});
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
