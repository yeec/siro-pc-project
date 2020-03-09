import request from "@/utils/request";
import { apiConfig } from "../config/api";

//根据分组Code查询数据字典
export function findByGroupCode(groupCode) {
  return request({
    url: apiConfig.auth.meta.findByGroupCode,
    method: "get",
    params: {
      groupCode: groupCode
    }
  });
}
