export const asyncRouterMap = {
  user: () => import("@/views/user"),
  role: () => import("@/views/role"),
  resource: () => import("@/views/resource"),
  article: () => import("@/views/article"),
  info: () => import("@/views/notice"),
  waterCard: () => import("@/views/waterCard"),
  chargeOrder: () => import("@/views/chargeOrder"),
  baseBasicInfo: () => import("@/views/company"),
  contact: () => import("@/views/contact"),
  onlineMessage: () => import("@/views/onlineMessage")
};
