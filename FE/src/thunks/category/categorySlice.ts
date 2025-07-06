// Libs
import { createSlice } from "@reduxjs/toolkit";

// Others
import {
  createCategory,
  deleteCategory,
  getCategoryDetails,
  getListCategory,
  updateCategory,
} from "./categoryThunk";
import { RootState } from "@/utils/redux/store";

export interface ICategoryState {
  isRefreshCategoryList: boolean;
}

const initialState: ICategoryState = {
  isRefreshCategoryList: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setRefreshList(state, action) {
      state.isRefreshCategoryList = action.payload;
    },
  },
  extraReducers(builder) {
    // GET: get list category
    builder
      .addCase(getListCategory.pending, (state) => {})
      .addCase(getListCategory.fulfilled, (state) => {})
      .addCase(getListCategory.rejected, (state) => {});

    // GET: get category detail
    builder
      .addCase(getCategoryDetails.pending, (state) => {})
      .addCase(getCategoryDetails.fulfilled, (state) => {})
      .addCase(getCategoryDetails.rejected, (state) => {});

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {})
      .addCase(createCategory.fulfilled, (state) => {})
      .addCase(createCategory.rejected, (state) => {});

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {})
      .addCase(updateCategory.fulfilled, (state) => {})
      .addCase(updateCategory.rejected, (state) => {});

    // delete category
    builder
      .addCase(deleteCategory.pending, (state) => {})
      .addCase(deleteCategory.fulfilled, (state) => {})
      .addCase(deleteCategory.rejected, (state) => {});
  },
});

// Action
export const categoryActions = categorySlice.actions;

// Selectors
export const selectIsRefreshCategoryList = (state: RootState) =>
  state.category.isRefreshCategoryList;

// Reducer
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
