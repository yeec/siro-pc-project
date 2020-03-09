import { constantRouterMap, defaultRouterMap } from "@/router";
import { asyncRouterMap } from "@/router/modules/asyncRouterMap";

// const ASYNC_ROUTER_KEY = "async_router";
// let serialize = require("serialize-javascript");

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
var resourceTypes = ["menu", "menu_item"];
function generateAsyncRouter(currentResource, resources) {
  if (!resources || resources.length == 0) {
    return [];
  }

  var result = [];
  var component = null;
  var h = "";
  if (currentResource == null) {
    component = () => import("@/views/layout/Layout");
    h = "/";
  }

  var childResources = getResourceChildren(currentResource, resources);

  if (childResources != null) {
    childResources.forEach(resource => {
      if (resource && resourceTypes.includes(resource.resourceTypeCode)) {
        var children = null;
        var defaultRouterRoot = null;
        if (resource.resourceTypeCode == "menu") {
          children = generateAsyncRouter(resource, resources);
        } else if (
          resource.resourceTypeCode == "menu_item" &&
          currentResource == null
        ) {
          defaultRouterRoot = {
            name: "p-" + resource.resourceCode,
            path: "/" + resource.resourceCode,
            component: () => import("@/views/layout/Layout"),
            children: []
          };
        } else if (resource.resourceTypeCode == "menu_item") {
          if (asyncRouterMap && asyncRouterMap[resource.path]) {
            component = asyncRouterMap[resource.path];
          }
        }

        const tmp = {
          path: h + resource.path,
          component: component,
          name: resource.resourceCode,
          meta: {
            title: resource.resourceName,
            icon: resource.icon
          },
          children: children
        };
        if (defaultRouterRoot) {
          if (asyncRouterMap && asyncRouterMap[resource.path]) {
            tmp.component = asyncRouterMap[resource.path];
          }

          defaultRouterRoot.children.push(tmp);
          result.push(defaultRouterRoot);
        } else {
          result.push(tmp);
        }
      }
    });
  }
  return result;
}

function getResourceChildren(resource, resources) {
  if (resources) {
    var parentCode =
      resource == null || resource == "" ? "0" : resource.resourceCode;
    return resources.filter(res => parentCode == res.parentCode);
  }
  return null;
}

const permission = {
  state: {
    routers: constantRouterMap,
    asyncRouter: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      if (routers && routers.length > 0) {
        state.asyncRouter = routers;
        state.routers = constantRouterMap.concat(routers);
        // let storeItem = serialize(state.asyncRouter);
        // window.localStorage.setItem(
        //   ASYNC_ROUTER_KEY,
        //     storeItem
        // );
      }
    },
    CLEAR_SYNC_ROUTES: state => {
      state.asyncRouter = [];
      // console.log(constantRouterMap);
      constantRouterMap.length = 0;
      constantRouterMap.concat(defaultRouterMap);
      state.routers = constantRouterMap;
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      let asyncRouter = generateAsyncRouter(null, data);
      let page404 = { path: "*", redirect: "/404", hidden: true };
      if (asyncRouter == null) asyncRouter = [];
      asyncRouter = asyncRouter.concat(page404);
      commit("SET_ROUTERS", asyncRouter);
    },
    // flushRoutesView({ commit }) {
    //   var routerStr = window.localStorage.getItem(ASYNC_ROUTER_KEY);
    //   if (routerStr) {
    //     var asyncRouter = deserialize(routerStr);
    //     commit("SET_ROUTERS", asyncRouter);
    //   } else {
    //     commit("SET_ROUTERS", asyncRouter);
    //   }
    // },
    clearRoutes({ commit }) {
      commit("CLEAR_SYNC_ROUTES");
      // window.localStorage.removeItem(ASYNC_ROUTER_KEY);
    }
  }
};

export default permission;
