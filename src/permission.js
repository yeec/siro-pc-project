import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { getToken } from "@/utils/auth"; // 验权
import { checkToken } from "@/api/auth";
import { getResources } from "@/utils/auth";

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      //每次页面跳转的时候都验证token有效性
      checkToken()
        .then(() => {
          if (
            !store.getters.async_routers ||
            store.getters.async_routers.length === 0
          ) {
            store
              // .dispatch("flushRoutesView")
              .dispatch("generateRoutes", getResources())
              .then(() => {
                if (
                  store.getters.async_routers &&
                  store.getters.async_routers.length > 0
                ) {
                  router.addRoutes(store.getters.async_routers); // 动态添加可访问路由表
                  next({ ...to, replace: true });
                } else {
                  next();
                }
              })
              .finally(() => {
                NProgress.done();
              });
          } else {
            next();
            NProgress.done();
          }
        })
        .catch(() => {
          store.dispatch("clearAccessInfo").then(() => {
            store.dispatch("clearRoutes").then(() => {
              Message.error("会话已失效，请重新登录");
              next({ path: "/" });
            });
          });
        });
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
      NProgress.done();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
