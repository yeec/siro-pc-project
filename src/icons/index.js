import Vue from "vue";
import SvgIcon from "@/components/SvgIcon"; // svg组件

// register globally
Vue.component("svg-icon", SvgIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);

const req = require.context("./svg", false, /\.svg$/);

const sysicons = req
  .keys()
  .filter(icon => {
    if (
      icon === "password.svg" ||
      icon === "./password.svg" ||
      icon === "user.svg" ||
      icon == "./user.svg"
    ) {
      return false;
    }
    return true;
  })
  .map(function(item) {
    let idx = item.indexOf(".svg") - 2;
    return item.substr(2, idx);
  });

Vue.prototype.$icons = sysicons;

requireAll(req);
