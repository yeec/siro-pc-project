import { BASE_URI } from "./index";

//注：apiURL设置，这里的设置与asyncRouterMap中的名称需要保持一致，如这里配置的user(resource=true)与asyncRouterMap中的user相对应决定权限
export const apiConfig = {
  auth: {
    resource: false,
    api: {
      login: BASE_URI + "/oauth/token",
      checkToken: BASE_URI + "/oauth/check_token",
      resource: BASE_URI + "/auth/resources",
      logout: BASE_URI + "/oauth/logout"
    },
    meta: {
      findByGroupCode: BASE_URI + "/metadata/findByGroupCode"
    }
  },
  baseBasicInfo: {
    name: "物业管理",
    resource: true,
    api: {
      search: {
        name: "查询物业",
        url: {
          list: BASE_URI + "/generator/list",
          detail: BASE_URI + "/generator/info",
          getOne: BASE_URI + "/generator/getOne"
        }
      },
      delete: {
        name: "删除物业",
        url: BASE_URI + "/generator/delete"
      },
      deletes: {
        name: "批量删除物业",
        url: BASE_URI + "/generator/deletes"
      },
      update: {
        name: "更新物业",
        url: BASE_URI + "/generator/update"
      },
      add: {
        name: "新增物业",
        url: BASE_URI + "/generator/save"
      }
    }
  },
  user: {
    name: "用户管理",
    resource: true,
    api: {
      search: {
        name: "查询用户",
        url: {
          list: BASE_URI + "/user/list",
          detail: BASE_URI + "/user/detail"
        }
      },

      add: {
        name: "新增用户",
        url: BASE_URI + "/user/add"
      },
      update: {
        name: "更新用户",
        url: BASE_URI + "/user/modify"
      },
      delete: {
        name: "删除用户",
        url: BASE_URI + "/user/delete"
      },
      resetpwd: {
        name: "重置密码",
        url: BASE_URI + "/user/resetpwd"
      },
      uproles: {
        name: "分配角色",
        url: {
          rel: BASE_URI + "/user/roles",
          list: BASE_URI + "/role/list",
          auth: BASE_URI + "/user/uprole"
        }
      }
    }
  },
  role: {
    name: "角色管理",
    resource: true,
    api: {
      search: {
        name: "查询角色",
        url: BASE_URI + "/role/list"
      },
      delete: {
        name: "删除角色",
        url: BASE_URI + "/role/delete"
      },
      update: {
        name: "更新角色",
        url: BASE_URI + "/role/modify"
      },
      add: {
        name: "新增角色",
        url: BASE_URI + "/role/add"
      },
      upresource: {
        name: "角色授权",
        url: {
          auth: BASE_URI + "/role/upresource",
          tree: BASE_URI + "/resource/tree",
          rel: BASE_URI + "/role/resources"
        }
      }
    }
  },
  resource: {
    name: "资源管理",
    resource: true,
    api: {
      search: {
        name: "查询资源",
        url: BASE_URI + "/resource/tree"
      },
      delete: {
        name: "删除资源",
        url: BASE_URI + "/resource/delete"
      },
      update: {
        name: "更新资源",
        url: BASE_URI + "/resource/modify"
      },
      add: {
        name: "新增资源",
        url: BASE_URI + "/resource/add"
      }
    }
  },
  waterCard: {
    name: "水卡管理",
    resource: true,
    api: {
      add: {
        name: "添加水卡",
        url: BASE_URI + "/waterCard/add"
      },
      update: {
        name: "修改水卡信息",
        url: BASE_URI + "/waterCard/update"
      },
      delete: {
        name: "删除水卡",
        url: BASE_URI + "/waterCard/delete"
      },
      unbind: {
        name: "解除绑定水卡",
        url: BASE_URI + "/waterCard/unbind"
      },
      selectByCondition: {
        name: "查询水卡列表",
        url: BASE_URI + "/waterCard/selectByCondition"
      },
      selectDutyUser: {
        name: "查询责任人下拉列表",
        url: BASE_URI + "/waterCard/selectDutyUser"
      },
      selectCard: {
        name: "根据条件查询水卡",
        url: BASE_URI + "/waterCard/selectCard"
      }
    }
  },
  chargeOrder: {
    name: "缴费管理",
    resource: true,
    api: {
      selectByCondition: {
        name: "查询缴费列表",
        url: BASE_URI + "/chargeOrder/selectByCondition"
      },
      handle: {
        name: "处理缴费",
        url: BASE_URI + "/chargeOrder/handle"
      }
    }
  },
  article: {
    name: "文章管理",
    resource: true,
    api: {
      add: {
        name: "文章添加",
        url: BASE_URI + "/article/add"
      },
      modify: {
        name: "文章修改",
        url: BASE_URI + "/article/modify"
      },
      delete: {
        name: "文章删除",
        url: BASE_URI + "/article/delete"
      },
      list: {
        name: "文章列表",
        url: BASE_URI + "/article/list"
      },
      info: {
        name: "文章详情",
        url: BASE_URI + "/article/info"
      },
      showFlag: {
        name: "文章详情",
        url: BASE_URI + "/article/updateShowFlag"
      },
      feedbackList: {
        name: "反馈列表",
        url: BASE_URI + "/article/feedback/list"
      },
      addFeedback: {
        name: "添加反馈",
        url: BASE_URI + "/article/feedback/submit"
      },
      reply: {
        name: "反馈回复",
        url: BASE_URI + "/article/feedback/reply"
      }
    }
  },
  info: {
    name: "通知管理",
    resource: true,
    api: {
      add: {
        name: "通知添加",
        url: BASE_URI + "/article/add"
      },
      modify: {
        name: "通知修改",
        url: BASE_URI + "/article/modify"
      },
      delete: {
        name: "通知删除",
        url: BASE_URI + "/article/delete"
      },
      list: {
        name: "通知列表",
        url: BASE_URI + "/article/list"
      },
      info: {
        name: "文章详情",
        url: BASE_URI + "/article/info"
      }
    }
  },
  contact: {
    name: "联系方式",
    resource: true,
    api: {
      search: {
        name: "查询联系方式",
        url: BASE_URI + "/communityContact/list"
      },
      add: {
        name: "新增联系方式",
        url: BASE_URI + "/communityContact/save"
      },
      edit: {
        name: "编辑联系方式",
        url: BASE_URI + "/communityContact/update"
      },
      delete: {
        name: "删除联系方式",
        url: BASE_URI + "/communityContact/delete"
      }
    }
  },
  onlineMessage: {
    name: "在线留言",
    resource: true,
    api: {
      list: {
        name: "查询在线留言列表",
        url: BASE_URI + "/olmessage/list"
      },
      update: {
        name: "更新留言状态",
        url: BASE_URI + "/olmessage/update"
      }
    }
  }
};

/**
 * 获取资源树配置，用于权限管理
 */
export function getResourceConfigs() {
  let result = [];

  Object.keys(apiConfig).forEach(function(key) {
    let itemVal = apiConfig[key];
    if (itemVal && itemVal.resource == true) {
      let res = { operatorCode: key, operatorName: itemVal.name };
      let operators = [];
      if (itemVal.api && Object.keys(itemVal.api).length > 0) {
        Object.keys(itemVal.api).forEach(function(opKey) {
          let operMap = itemVal.api[opKey];
          if (operMap) {
            var authUrls = getAuthUrls(operMap.url);
            let operator = {
              operatorCode: opKey,
              operatorName: operMap.name,
              authUrls: authUrls
            };
            operators.push(operator);
          }
        });
      }
      res.operators = operators;
      result.push(res);
    }
  });

  return result;
}

function getAuthUrls(url) {
  if (url && typeof url == "string") {
    return [url];
  } else if (url && Object.keys(url).length > 0) {
    let urls = [];
    Object.keys(url).forEach(function(key) {
      var val = url[key];
      if (val) {
        urls.push(val);
      }
    });
    return urls;
  }
  return null;
}
