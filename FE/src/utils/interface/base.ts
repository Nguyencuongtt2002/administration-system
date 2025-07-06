import type { ResponseStatusEnum } from "../enum/base";

export interface IBaseResponse<T = undefined> {
  statusCode: ResponseStatusEnum;
  message: string;
  data: T;
}

export interface IListDataResponse<T> {
  result: T;
  meta: IPaginationResponse;
}

export interface IPaginationResponse {
  current?: number;
  pageSize: number;
  pages: number;
  total?: number;
}
