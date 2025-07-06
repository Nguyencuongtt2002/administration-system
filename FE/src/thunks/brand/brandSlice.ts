// Libs
import { createSlice } from "@reduxjs/toolkit";

// Others
import {
  createBrand,
  deleteBrand,
  getBrandDetails,
  getListBrand,
  updateBrand,
} from "./brandThunk";
import { RootState } from "@/utils/redux/store";

export interface IBrandState {
  isRefreshList: boolean;
}

const initialState: IBrandState = {
  isRefreshList: false,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshList = action.payload;
    },
  },
  extraReducers(builder) {
    // GET: get list brand
    builder
      .addCase(getListBrand.pending, (state) => {})
      .addCase(getListBrand.fulfilled, (state) => {})
      .addCase(getListBrand.rejected, (state) => {});

    // GET: get brand detail
    builder
      .addCase(getBrandDetails.pending, (state) => {})
      .addCase(getBrandDetails.fulfilled, (state) => {})
      .addCase(getBrandDetails.rejected, (state) => {});

    // Create brand
    builder
      .addCase(createBrand.pending, (state) => {})
      .addCase(createBrand.fulfilled, (state) => {})
      .addCase(createBrand.rejected, (state) => {});

    // Update brand
    builder
      .addCase(updateBrand.pending, (state) => {})
      .addCase(updateBrand.fulfilled, (state) => {})
      .addCase(updateBrand.rejected, (state) => {});

    // delete brand
    builder
      .addCase(deleteBrand.pending, (state) => {})
      .addCase(deleteBrand.fulfilled, (state) => {})
      .addCase(deleteBrand.rejected, (state) => {});
  },
});

// Action
export const brandActions = brandSlice.actions;

// Selectors
export const selectIsRefreshBrandList = (state: RootState) =>
  state.brand.isRefreshList;

// Reducer
const brandReducer = brandSlice.reducer;
export default brandReducer;
