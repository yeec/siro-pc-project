import request from "@/utils/request";
import { apiConfig } from "../config/api";

//请求角色列表
export function getRoles(roleName) {
  return request({
    url: apiConfig.role.api.search.url,
    method: "get",
    params: {
      roleName: roleName,
      scope: 1
    }
  });
}

//新增角色
export function addRole(role) {
  return request({
    url: apiConfig.role.api.add.url,
    method: "post",
    data: {
      roleCode: role.roleCode,
      roleName: role.roleName,
      roleDesc: role.roleDesc
    }
  });
}

//更新角色
export function updateRole(role) {
  return request({
    url: apiConfig.role.api.update.url,
    method: "post",
    data: {
      roleCode: role.roleCode,
      newRoleCode: role.newRoleCode,
      roleName: role.roleName,
      roleDesc: role.roleDesc
    }
  });
}

//删除角色
export function deleteRole(roleCode) {
  return request({
    url: apiConfig.role.api.delete.url,
    method: "post",
    params: {
      roleCode: roleCode
    }
  });
}

//通过角色编号查询资源
export function findRoleResources(roleCode) {
  return request({
    url: apiConfig.role.api.upresource.url.rel,
    method: "get",
    params: {
      roleCode: roleCode,
      resourceTypeCode: "operator"
    }
  });
}

//更新角色与资源之间的关联
export function updateRoleResources(roleCode, resources) {
  return request({
    url: apiConfig.role.api.upresource.url.auth,
    method: "post",
    data: {
      roleCode: roleCode,
      resources: resources
    }
  });
}
