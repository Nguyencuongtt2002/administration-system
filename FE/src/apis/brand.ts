import { urlApiBrand } from "@/utils/constants/urlApi";
import { IBaseResponse, IListDataResponse } from "@/utils/interface/base";
import http from "./axios.customize";
import { IQueryBase } from "@/utils/interface/common";
import {
  IAddBrandReq,
  IListBrand,
  IUpdateBrand,
} from "@/utils/interface/brand";

const brandApi = {
  getListBrand(query: IQueryBase) {
    const url = `${urlApiBrand.getAll}`;
    return http.get<IBaseResponse<IListDataResponse<IListBrand[]>>>(url, {
      params: query,
    });
  },

  createBrand(body: IAddBrandReq) {
    const url = `${urlApiBrand.createBrand}`;
    return http.post<IBaseResponse>(url, body);
  },

  getBrandDetails(id: string) {
    const url = `${urlApiBrand.getBrandDetails(id)}`;
    return http.get<IBaseResponse<IListBrand>>(url);
  },

  updateBrand(body: IUpdateBrand) {
    const url = `${urlApiBrand.updateBrand}`;
    return http.patch<IBaseResponse>(url, body);
  },

  deleteBrand(id: string) {
    const url = `${urlApiBrand.deleteBrand(id)}`;
    return http.delete<IBaseResponse>(url);
  },
};

export default brandApi;
