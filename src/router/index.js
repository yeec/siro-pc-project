import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  { path: "/401", component: () => import("@/views/error/401"), hidden: true },
  { path: "/404", component: () => import("@/views/error/404"), hidden: true },
  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    hidden: true,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        hidden: true,
        meta: { title: "首页", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/article",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "addArticle",
        component: () => import("@/views/article/addArticle"),
        name: "addArticle",
        hidden: true,
        meta: { title: "新增资讯信息", icon: "dashboard", noCache: true }
      },
      {
        path: "editArticle",
        component: () => import("@/views/article/addArticle"),
        name: "editArticle",
        hidden: true,
        meta: { title: "修改资讯信息", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/notice",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "addNotice",
        component: () => import("@/views/notice/addNotice"),
        name: "addNotice",
        hidden: true,
        meta: { title: "新增通知信息", icon: "dashboard", noCache: true }
      },
      {
        path: "editNotice",
        component: () => import("@/views/notice/addNotice"),
        name: "editNotice",
        hidden: true,
        meta: { title: "编辑通知信息", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/hospital",
    component: Layout,
    name: "Hospital",
    hidden: true,
    children: [
      {
        path: "addHospital",
        component: () => import("@/views/hospital/addHospital"),
        name: "addHospital",
        hidden: true,
        meta: { title: "医院信息", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/hosDepart",
    component: Layout,
    name: "HosDepart",
    hidden: true,
    children: [
      {
        path: "addHosDepart",
        component: () => import("@/views/hosdepart/addHosDepart"),
        name: "addHosDepart",
        hidden: true,
        meta: { title: "科室信息", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/doctor",
    component: Layout,
    name: "Doctor",
    hidden: true,
    children: [
      {
        path: "addDoctor",
        component: () => import("@/views/doctorScheduling/addDoctor"),
        name: "addDoctor",
        hidden: true,
        meta: { title: "医生信息", icon: "dashboard", noCache: true }
      }
    ]
  },
  {
    path: "/disease",
    component: Layout,
    name: "Disease",
    hidden: true,
    children: [
      {
        path: "addDisease",
        component: () => import("@/views/disease/addDisease"),
        name: "addDisease",
        hidden: true,
        meta: { title: "疾病信息", icon: "dashboard", noCache: true }
      }
    ]
  }
];

export const defaultRouterMap = constantRouterMap.concat();

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // mode: "hash", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
