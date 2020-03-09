const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  tokenType: state => state.user.tokenType,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  isAdmin: state => state.user.isAdmin,
  resources: state => state.user.resources,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers,
  async_routers: state => state.permission.asyncRouter
};
export default getters;
