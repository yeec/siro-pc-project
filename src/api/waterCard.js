import request from "@/utils/request";
import { apiConfig } from "../config/api";

/**
 * 添加水卡
 * @param cardInfo
 * @param pageNum
 * @param pageSize
 */
export function addCard(cardInfo) {
  return request({
    url: apiConfig.waterCard.api.add.url,
    method: "post",
    data: {
      cardCode: cardInfo.cardCode,
      cardNumber: cardInfo.cardNumber,
      phone: cardInfo.phone,
      dutyUserCode: cardInfo.dutyUserCode,
      ownerCode: cardInfo.ownerCode
    }
  });
}

/**
 * 删除水卡
 * @param cardCode
 */
export function deleteCard(cardCode) {
  return request({
    url: apiConfig.waterCard.api.delete.url,
    method: "post",
    params: {
      cardCode: cardCode
    }
  });
}

/**
 * 解除绑定水卡
 * @param uid
 * @param cardCode
 */
export function unbind(uid, cardCode) {
  return request({
    url: apiConfig.waterCard.api.unbind.url,
    method: "post",
    data: {
      uid: uid,
      cardCode: cardCode
    }
  });
}

/**
 * 修改水卡信息
 * @param cardInfo
 */
export function updateCard(cardInfo) {
  return request({
    url: apiConfig.waterCard.api.update.url,
    method: "post",
    data: {
      cardCode: cardInfo.cardCode,
      cardNumber: cardInfo.cardNumber,
      phone: cardInfo.phone,
      dutyUserCode: cardInfo.dutyUserCode,
      ownerCode: cardInfo.ownerCode
    }
  });
}

/**
 * 根据条件查询水卡列表
 * @param cardInfo
 * @param pageNum
 * @param pageSize
 */
export function selectByCondition(cardInfo, pageNum, pageSize) {
  let params = { pageNum: pageNum, pageSize: pageSize };
  return request({
    url: apiConfig.waterCard.api.selectByCondition.url,
    method: "post",
    params: params,
    data: {
      cardNumber: cardInfo.cardNumber,
      phone: cardInfo.phone,
      dutyUserName: cardInfo.dutyUserName
    }
  });
}

/**
 * 查询责任人列表
 */
export function selectDutyUser() {
  return request({
    url: apiConfig.waterCard.api.selectDutyUser.url,
    method: "post"
  });
}

/**
 * 根据条件查询水卡
 * 用于删除水卡前校验是否被绑定，添加水卡前校验是否存在卡号等
 */
export function selectCard(cardCode, cardNumber) {
  return request({
    url: apiConfig.waterCard.api.selectCard.url,
    method: "post",
    data: {
      cardCode: cardCode,
      cardNumber: cardNumber
    }
  });
}
