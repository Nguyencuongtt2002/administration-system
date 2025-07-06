import { urlApiMessage } from "@/utils/constants/urlApi";
import { IBaseResponse } from "@/utils/interface/base";
import http from "./axios.customize";
import { IMessage, IQueryMessgae } from "@/utils/interface/message";

const messageApi = {
  fetchMessages(query: IQueryMessgae) {
    const url = `${urlApiMessage.fetchMessages}`;
    return http.get<IBaseResponse<IMessage[]>>(url, {
      params: query,
    });
  },
};

export default messageApi;
