import request from "@/utils/request";
import { apiConfig } from "../config/api";

/**
 * 修改水卡信息
 * @param cardInfo
 */
export function handle(orderInfo) {
  return request({
    url: apiConfig.chargeOrder.api.handle.url,
    method: "post",
    data: {
      orderCode: orderInfo.orderCode,
      remark: orderInfo.remark
    }
  });
}

/**
 * 根据条件查询水卡列表
 * @param cardInfo
 * @param pageNum
 * @param pageSize
 */
export function selectByCondition(orderInfo, pageNum, pageSize) {
  let params = { pageNum: pageNum, pageSize: pageSize };
  return request({
    url: apiConfig.chargeOrder.api.selectByCondition.url,
    method: "post",
    params: params,
    data: {
      cardNumber: orderInfo.cardNumber,
      payTimeBegin: orderInfo.payTimeBegin,
      payTimeEnd: orderInfo.payTimeEnd,
      payStatus: orderInfo.payStatus,
      handleStatus: orderInfo.handleStatus
    }
  });
}
