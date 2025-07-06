import { urlApiBrand, urlApiUser } from "@/utils/constants/urlApi";
import { IBaseResponse } from "@/utils/interface/base";
import http from "./axios.customize";
import { IAccount } from "@/utils/interface/auth";

const userApi = {
  findAllExcluding() {
    const url = `${urlApiUser.findAllExcluding}`;
    return http.get<IBaseResponse<IAccount[]>>(url);
  },
};

export default userApi;
