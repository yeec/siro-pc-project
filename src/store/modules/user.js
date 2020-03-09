import {
  getToken,
  setToken,
  getTokenType,
  setTokenType,
  removeToken,
  removeTokenType,
  getUsername,
  setUsername,
  removeUsername,
  setIsAdmin,
  removeIsAdminKey,
  isAdmin,
  setResources,
  getResources,
  removeResources
} from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    tokenType: getTokenType(),
    username: getUsername(),
    isAdmin: isAdmin(),
    avatar: "",
    resources: getResources()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_TOKEN_TYPE: (state, tokenType) => {
      state.tokenType = tokenType;
    },
    SET_USER_NAME: (state, username) => {
      state.username = username;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_RESOURCES: (state, resources) => {
      state.resources = resources;
    },
    SET_ADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin;
    }
  },

  actions: {
    //保存登录信息
    saveAccessInfo({ commit }, info) {
      var accessInfo = info[0];
      var resources = info[1];
      setToken(accessInfo["access_token"]);
      commit("SET_TOKEN", accessInfo["access_token"]);
      setTokenType(accessInfo["token_type"]);
      commit("SET_TOKEN_TYPE", accessInfo["token_type"]);
      setUsername(accessInfo["X-UserName"]);
      commit("SET_USER_NAME", accessInfo["X-UserName"]);
      if (resources) {
        commit("SET_RESOURCES", resources);
        setResources(resources);
      }
      if (accessInfo["X-Admin"]) {
        commit("SET_ADMIN", accessInfo["X-Admin"]);
        setIsAdmin(accessInfo["X-Admin"]);
      } else {
        commit("SET_ADMIN", 0);
        setIsAdmin(0);
      }
    },
    clearAccessInfo({ commit }) {
      commit("SET_TOKEN", "");
      removeToken();
      commit("SET_TOKEN_TYPE", "");
      removeTokenType();
      commit("SET_RESOURCES", {});
      removeResources();
      commit("SET_USER_NAME", "");
      removeUsername();
      commit("SET_ADMIN", 0);
      removeIsAdminKey();
    }
  }
};

export default user;
