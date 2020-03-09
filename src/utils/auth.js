import { deserialize } from "@/utils";

const TokenKey = "Admin-Token";
const TokenTypeKey = "Admin-Token-Type";
const TokenUserName = "Admin-User-Name";
const TokenIsAdminKey = "X-Admin";
const TokenResourceKey = "Admin-Resource";

let serialize = require("serialize-javascript");

export function getToken() {
  return window.localStorage.getItem(TokenKey);
}

export function setToken(token) {
  window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey);
}

export function setTokenType(tokenType) {
  window.localStorage.setItem(TokenTypeKey, tokenType);
}

export function getTokenType() {
  return window.localStorage.getItem(TokenTypeKey);
}

export function removeTokenType() {
  window.localStorage.removeItem(TokenTypeKey);
}

export function setUsername(username) {
  window.localStorage.setItem(TokenUserName, username);
}

export function getUsername() {
  return window.localStorage.getItem(TokenUserName);
}

export function removeUsername() {
  window.localStorage.removeItem(TokenUserName);
}

export function setIsAdmin(isAdmin) {
  window.localStorage.setItem(TokenIsAdminKey, isAdmin);
}

export function isAdmin() {
  return window.localStorage.getItem(TokenIsAdminKey);
}

export function removeIsAdminKey() {
  window.localStorage.removeItem(TokenIsAdminKey);
}

export function setResources(resources) {
  if (resources) {
    window.localStorage.setItem(TokenResourceKey, serialize(resources));
  }
}

export function getResources() {
  var ret = window.localStorage.getItem(TokenResourceKey);
  if (ret) {
    return deserialize(ret);
  }
  return ret;
}

export function removeResources() {
  window.localStorage.removeItem(TokenResourceKey);
}
