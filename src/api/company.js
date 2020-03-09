import request from "@/utils/request";
import { apiConfig } from "../config/api";
//添加物业基础信息
export function addProperty(baseBasicInfo) {
  return request({
    url: apiConfig.baseBasicInfo.api.add.url,
    method: "post",
    data: {
      basicName: baseBasicInfo.basicName,
      basicRemark: baseBasicInfo.basicRemark,
      contact: baseBasicInfo.contact,
      phone: baseBasicInfo.phone,
      content: baseBasicInfo.content,
      corporation: baseBasicInfo.corporation,
      corporationTel: baseBasicInfo.corporationTel,
      webSite: baseBasicInfo.webSite,
      logo: baseBasicInfo.logo
    }
  });
}

//更新物业
export function modifyProperty(baseBasicInfo) {
  return request({
    url: apiConfig.baseBasicInfo.api.update.url,
    method: "post",
    data: {
      basicCode: baseBasicInfo.basicCode,
      basicName: baseBasicInfo.basicName,
      basicRemark: baseBasicInfo.basicRemark,
      contact: baseBasicInfo.contact,
      phone: baseBasicInfo.phone,
      content: baseBasicInfo.content,
      corporation: baseBasicInfo.corporation,
      corporationTel: baseBasicInfo.corporationTel,
      webSite: baseBasicInfo.webSite,
      logo: baseBasicInfo.logo
    }
  });
}
//删除物业
export function deleteLogicProperty(basicCode) {
  return request({
    url: apiConfig.baseBasicInfo.api.delete.url,
    method: "get",
    params: { basicCode: basicCode }
  });
}
//查询单个物业信息
export function getProperty(basicCode) {
  return request({
    url: apiConfig.baseBasicInfo.api.search.url.detail,
    method: "get",
    params: { basicCode: basicCode }
  });
}
export function getPropertyOne() {
  return request({
    url: apiConfig.baseBasicInfo.api.search.url.getOne,
    method: "get"
  });
}
//获取物业列表
export function listPage(pageNum, pageSize, basicName) {
  return request({
    url: apiConfig.baseBasicInfo.api.search.url.list,
    method: "get",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      basicName: basicName
    }
  });
}
