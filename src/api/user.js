import request from "@/utils/request";
import { apiConfig } from "../config/api";

//请求角色列表
export function getUsers(searchType, searchValue, page, pagesize) {
  let params = { page: pagesize, pagesize: pagesize, scope: 1 };
  if (searchType) {
    params[searchType] = searchValue;
  }
  return request({
    url: apiConfig.user.api.search.url.list,
    method: "get",
    params: params
  });
}

//新增角色
export function addUser(user) {
  // var isAdmin = false;
  // if (user.admin == "1") {
  //   isAdmin = true;
  // }
  return request({
    url: apiConfig.user.api.add.url,
    method: "post",
    data: {
      loginName: user.loginName,
      userName: user.userName,
      pwd: user.pwd,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      admin: user.admin,
      status: user.status
    }
  });
}

//更新角色
export function updateUser(user) {
  return request({
    url: apiConfig.user.api.update.url,
    method: "post",
    data: {
      uid: user.uid,
      loginName: user.loginName,
      userName: user.userName,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      admin: user.admin,
      status: user.status
    }
  });
}

//更新角色
export function resetUserPassword(uid, password) {
  return request({
    url: apiConfig.user.api.resetpwd.url,
    method: "post",
    params: {
      uid: uid,
      password: password
    }
  });
}

//删除角色
export function deleteUser(uid) {
  return request({
    url: apiConfig.user.api.delete.url,
    method: "post",
    params: {
      uid: uid
    }
  });
}

//通过角色编号查询资源
export function findUserRoles(uid) {
  return request({
    url: apiConfig.user.api.uproles.url.rel,
    method: "get",
    params: {
      uid: uid
    }
  });
}

//更新角色与资源之间的关联
export function updateUserRoles(uid, roles) {
  return request({
    url: apiConfig.user.api.uproles.url.auth,
    method: "post",
    data: {
      uid: uid,
      roles: roles
    }
  });
}
