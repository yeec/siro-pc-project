import request from "@/utils/request";
import { apiConfig } from "../config/api";

//获取在线留言列表
export function olmessageList(params) {
  return request({
    url: apiConfig.onlineMessage.api.list.url,
    method: "post",
    data: {
      userName: params.userName,
      userPhone: params.userPhone,
      endDate: params.endDate,
      startDate: params.startDate,
      pageNo: params.pageNo,
      pageSize: params.pageSize
    }
  });
}

//处理在线留言
export function olmessageUpdate(params) {
  return request({
    url: apiConfig.onlineMessage.api.update.url,
    method: "post",
    data: {
      status: params.status,
      tellerId: params.tellerId,
      reply: params.reply,
      id: params.id
    }
  });
}
