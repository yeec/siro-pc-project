import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";
import { getTokenType } from "./auth";
import { BASE_URI } from "@/config";
import devMock from "./dev_mock";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    let str = config.url;
    let index = str.lastIndexOf("/");
    let productCode = str.substring(index + 1, str.length)
    console.log("请求URL:" + config.url);
    // 非打包环境 且不是自定义mock接口时，调用mock数据
    if (
      process.env.NODE_ENV !== "production" &&
      devMock.includes(productCode)
    ) {
      config.url = `/mock/api/${productCode}.do`;
    } else {
      // 请求后端接口
      config.url = `${config.url}`;
    }
    if (
      store.getters.token &&
      !config.url.startsWith(BASE_URI + "/oauth/token") &&
      !config.url.startsWith(BASE_URI + "/oauth/check_token")
    ) {
      config.headers["Authorization"] = getTokenType() + " " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (response.config.url.indexOf("token") > 0) {
      return res;
    }
    if (res.code != 200) {
      Message({
        message: res.message,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(response);
    } else {
      return response.data;
    }
  },
  error => {
    var message = "服务器请求失败";
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      } else if (
        error.response.data.error == "invalid_token" &&
        !error.response.config.url.startsWith(BASE_URI + "/oauth")
      ) {
        MessageBox.confirm("登录已过期，请重新登录", "登录过期", {
          confirmButtonText: "确定",
          type: "warning"
        }).then(() => {
          store.dispatch("clearAccessInfo").then(() => {
            store.dispatch("clearRoutes").then(() => {
              Message.error("会话已失效，请重新登录");
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          });
        });
      }
    }

    Message({
      message: message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
