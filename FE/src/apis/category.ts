import { urlApiCategory } from "@/utils/constants/urlApi";
import { IBaseResponse, IListDataResponse } from "@/utils/interface/base";
import http from "./axios.customize";
import { IQueryBase } from "@/utils/interface/common";
import {
  IAddCategoryReq,
  IListCategory,
  IUpdateCategory,
} from "@/utils/interface/category";

const categoryApi = {
  getListCategory(query: IQueryBase) {
    const url = `${urlApiCategory.getAll}`;
    return http.get<IBaseResponse<IListDataResponse<IListCategory[]>>>(url, {
      params: query,
    });
  },

  createCategory(body: IAddCategoryReq) {
    const url = `${urlApiCategory.createCategory}`;
    return http.post<IBaseResponse>(url, body);
  },

  getCategoryDetails(id: string) {
    const url = `${urlApiCategory.getCategoryDetails(id)}`;
    return http.get<IBaseResponse<IListCategory>>(url);
  },

  updateCategory(body: IUpdateCategory) {
    const url = `${urlApiCategory.updateCategory}`;
    return http.patch<IBaseResponse>(url, body);
  },

  deleteCategory(id: string) {
    const url = `${urlApiCategory.deleteCategory(id)}`;
    return http.delete<IBaseResponse>(url);
  },
};

export default categoryApi;
