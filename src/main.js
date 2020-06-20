import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import "@/styles/index.scss"; // global css
import "@/icons"; // icon
import "@/permission"; // permission control
//富文本
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor);

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
