import request from "@/utils/request";
import { apiConfig } from "../config/api";

//添加
export function add(contact) {
  return request({
    url: apiConfig.contact.api.add.url,
    method: "post",
    data: {
      contactName: contact.contactName,
      contactTel: contact.contactTel
    }
  });
}

//更新
export function modify(contact) {
  return request({
    url: apiConfig.contact.api.edit.url,
    method: "post",
    data: {
      contactName: contact.contactName,
      contactCode: contact.contactCode,
      contactTel: contact.contactTel
    }
  });
}
//删除
export function deleteContact(contactCode) {
  return request({
    url: apiConfig.contact.api.delete.url,
    method: "post",
    params: { code: contactCode }
  });
}

//获取 列表
export function listPage(pageNum, pageSize) {
  return request({
    url: apiConfig.contact.api.search.url,
    method: "get",
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  });
}
