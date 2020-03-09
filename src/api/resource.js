import request from "@/utils/request";
import { apiConfig } from "../config/api";

//请求资源树
export function getResources() {
  return request({
    url: apiConfig.resource.api.search.url,
    method: "get"
  });
}

//新增资源
export function addResource(resource) {
  return request({
    url: apiConfig.resource.api.add.url,
    method: "post",
    data: {
      resourceName: resource.resourceName,
      resourceDesc: resource.resourceDesc,
      resourceTypeCode: resource.resourceTypeCode,
      parentCode: resource.parentCode,
      path: resource.path,
      icon: resource.icon,
      idx: resource.idx,
      operators: resource.operators
    }
  });
}

//更新资源
export function updateResource(resource) {
  return request({
    url: apiConfig.resource.api.update.url,
    method: "post",
    data: {
      resourceCode: resource.resourceCode,
      resourceName: resource.resourceName,
      resourceDesc: resource.resourceDesc,
      resourceTypeCode: resource.resourceTypeCode,
      parentCode: resource.parentCode,
      path: resource.path,
      icon: resource.icon,
      idx: resource.idx,
      operators: resource.operators
    }
  });
}

//删除资源
export function deleteResource(resourceCode) {
  return request({
    url: apiConfig.resource.api.delete.url,
    method: "post",
    params: {
      resourceCode: resourceCode
    }
  });
}
