import request from "@/utils/request";
import { APP_SECURITY_CODE } from "../config";
import { getToken } from "../utils/auth";
import { apiConfig } from "../config/api";

//登录
export function login(username, password) {
  return request({
    url: apiConfig.auth.api.login,
    method: "post",
    headers: { Authorization: "Basic " + APP_SECURITY_CODE },
    params: {
      grant_type: "password",
      username,
      password
    }
  });
}

//检查token
export function checkToken() {
  return request({
    url: apiConfig.auth.api.checkToken,
    method: "post",
    headers: { Authorization: "Basic " + APP_SECURITY_CODE },
    params: {
      token: getToken()
    }
  });
}

//获取用户资源信息
export function getUserResource(tokenType, token) {
  var authStr = "";
  if (tokenType && token) {
    authStr = tokenType + " " + token;
  }

  if (authStr) {
    return request({
      url: apiConfig.auth.api.resource,
      method: "get",
      headers: {
        Authorization: authStr
      }
    });
  } else {
    return request({
      url: apiConfig.auth.api.resource,
      method: "get"
    });
  }
}

//登出
export function logout() {
  return request({
    url: apiConfig.auth.api.logout,
    method: "post"
  });
}
