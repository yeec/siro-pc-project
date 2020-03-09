import store from "@/store";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;

    if (value && value instanceof Array && value.length > 0) {
      if (store.getters.isAdmin == 1) {
        //如果是admin用户，则直接赋予权限
        return;
      }

      const resources = store.getters.resources;
      const curentRouterName = vnode.context.$router.history.current.name;
      const permissionResources = value;

      var hasPermission = false;
      if (!resources || resources.length == 0) {
        hasPermission = false;
      } else {
        const childrenResources = resources.filter(res => {
          if (res.parentCode == curentRouterName) {
            return true;
          }
          return false;
        });

        if (childrenResources && childrenResources.length > 0) {
          hasPermission = childrenResources.some(res => {
            return permissionResources.includes(res.path);
          });
        }
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`);
    }
  }
};
