<template>
  <div v-permission="['search']">
    <el-row :gutter="5">
      <el-col :span="9">
        <el-card shadow="never" class=" scrollable">
          <el-tree
            v-loading="treeLoading"
            ref="tree"
            node-key="nodeKey"
            :props="defaultTreeProps"
            :data="resourceTreeData"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            @current-change="onCurrentChange"
          >
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card shadow="never" class=" scrollable">
          <template>
            <el-tabs tab-position="right" v-model="selectedTab">
              <el-tab-pane label="资源详情" name="tab-1">
                <resource-detail
                  :node="currentNode"
                  :operatorsData="currentOperatorsData"
                  :menuResourceOptions="menuResourceOptions"
                  :key="currentNode.nodeKey"
                  @new-resource="changeTab('tab-2')"
                  @update-resource="changeTab('tab-3')"
                  @on-deleted="loadResourceTree(true)"
                ></resource-detail>
              </el-tab-pane>
              <el-tab-pane
                v-permission="['add']"
                v-if="
                  currentResourceType === 'root' ||
                    currentResourceType === 'menu'
                "
                label="新增资源"
                name="tab-2"
              >
                <resource-edit
                  :is-edit="false"
                  v-model="currentNode"
                  :menu-resource-options="menuResourceOptions"
                  :resource-menu-data="resourceMenuData"
                  :resource-tree-data="resourceTreeData"
                  @on-created="createdSuccess"
                ></resource-edit>
              </el-tab-pane>
              <el-tab-pane
                v-permission="['update']"
                v-if="
                  currentResourceType === 'menu' ||
                    currentResourceType === 'menu_item'
                "
                name="tab-3"
                label="更新资源"
              >
                <resource-edit
                  :is-edit="true"
                  v-model="currentNode"
                  :menu-resource-options="menuResourceOptions"
                  :resource-menu-data="resourceMenuData"
                  :resource-tree-data="resourceTreeData"
                ></resource-edit>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ResourceDetail from "./ResourceDetail";
import ResourceEdit from "./ResourceEdit";
import { getResources } from "@/api/resource";
import { getResourceConfigs } from "@/config/api";
import permission from "@/directive/permission"; // 权限判断指令

const rootTreeNode = {
  nodeKey: "0",
  node: {
    resourceCode: "0",
    resourceName: "系统资源树",
    parentCode: "0",
    resourceTypeCode: "root"
  },
  children: []
};

export default {
  name: "Resource",
  components: { ResourceEdit, ResourceDetail },
  directives: { permission },
  data() {
    return {
      selectedTab: "tab-1",
      defaultExpandedKeys: ["0"],
      currentNode: rootTreeNode,
      currentResourceType: "root",
      resourceTreeData: null,
      resourceMenuData: null,
      currentOperatorsData: null,
      menuResourceOptions: [],
      defaultTreeProps: {
        children: "children",
        label: function(data) {
          if (data && data.node) {
            return data.node.resourceName;
          }
          return "";
        }
      },
      defaultCasProps: {
        children: "children",
        label: "nodeName",
        value: "nodeKey"
      },
      treeLoading: false,
      addFormLoading: false,
      modifyFormLoading: false
    };
  },
  computed: {
    currentMenuType: function() {
      if (this.currentResourceType === "root") {
        return "根菜单";
      } else if (this.currentResourceType === "menu") {
        return "菜单组";
      } else if (this.currentResourceType === "menu_item") {
        return "功能页";
      } else if (this.currentResourceType === "operator") {
        return "操作权限";
      }
      return "其他";
    },
    currentResourceInstanceName: function() {
      let result = "未设置";
      if (
        this.currentNode &&
        this.currentNode.node &&
        this.currentNode.node.path &&
        this.currentNode.node.resourceTypeCode === "menu_item"
      ) {
        let currentPath = this.currentNode.node.path;
        if (this.menuResourceOptions) {
          this.menuResourceOptions.forEach(function(value) {
            if (value && value.operatorCode === currentPath) {
              result = value.operatorName;
              return;
            }
          });
        }
      }
      return result;
    }
  },
  created: function() {
    this.loadResourceTree(true);
    this.menuResourceOptions = getResourceConfigs();
  },
  methods: {
    createdSuccess: function(nodeKey) {
      let self = this;
      this.loadResourceTree(false, function() {
        if (nodeKey) {
          self.defaultExpandedKeys = [nodeKey];
          self.refs["tree"].setCurrentKey(nodeKey);
        }
      });
    },
    loadResourceTree: function(firstLoad, callback) {
      //加载资源树
      let self = this;
      // var resources = getResourceConfigs();
      this.resourceTreeData = [rootTreeNode];
      this.resourceMenuData = [rootTreeNode];
      this.treeLoading = true;
      getResources()
        .then(data => {
          if (
            data.value &&
            data.value.children &&
            data.value.children.length > 0
          ) {
            this.resourceTreeData[0].children = data.value.children;
            this.resourceMenuData[0] = JSON.parse(
              JSON.stringify(this.resourceTreeData[0])
            );
            repackTreeDataToMenus(this.resourceMenuData[0]);
            if (firstLoad) {
              self.currentNode = this.resourceTreeData[0];
              //设置当前选中为根节点
              self.$refs.tree.setCurrentKey("0");
              self.currentResourceType = "root";
            }

            if (callback) {
              callback();
            }
          }
        })
        .finally(() => {
          self.treeLoading = false;
        });
    },
    onCurrentChange: function(data) {
      //当选中的树节点变化时
      if (data && data.nodeKey === "0") {
        this.currentResourceType = "root";
        if (this.selectedTab === "tab-3") {
          this.selectedTab = "tab-1";
        }
      } else {
        if (data && data.node && data.node.resourceTypeCode) {
          //设置当前资源类型编号
          this.currentResourceType = data.node.resourceTypeCode;
        }
      }

      //设置当前节点数据
      this.currentNode = data;

      if (
        this.currentNode &&
        this.currentNode.node &&
        this.currentNode.node.path &&
        this.currentNode.node.resourceTypeCode === "operator"
      ) {
        if (this.selectedTab === "tab-2" || this.selectedTab === "tab-3") {
          this.selectedTab = "tab-1";
        }
      }

      this.currentOperatorsData = null;
      //如果resourceTypeCode='menu_item',则取出操作权限列表
      if (
        this.currentNode &&
        this.currentNode.node &&
        this.currentNode.node.path &&
        this.currentNode.node.resourceTypeCode === "menu_item"
      ) {
        if (this.selectedTab === "tab-2") {
          this.selectedTab = "tab-1";
        }

        //如不为空，则查询现有资源的明细，填充到表中
        var obj;
        let self = this;
        this.menuResourceOptions.forEach(function(item) {
          if (item && item.operatorCode === self.currentNode.node.path) {
            obj = item;
            return;
          }
        });
        if (obj && obj.operators) {
          this.currentOperatorsData = obj.operators;
        }
      }
    },
    changeTab: function(tab) {
      if (tab) {
        this.selectedTab = tab;
      }
    }
  }
};

/**
 * 重新组装tree数据
 * @param treeData$refs
 */
function repackTreeDataToMenus(treeData) {
  if (treeData && treeData.node && treeData.node.resourceName) {
    treeData.nodeName = treeData.node.resourceName;
  }
  if (treeData && treeData.children && treeData.children.length > 0) {
    treeData.children = treeData.children.filter(function(value) {
      if (value && value.node && value.node.resourceTypeCode === "menu") {
        return true;
      }
      return false;
    });
    if (treeData.children && treeData.children.length > 0) {
      treeData.children.forEach(function(value) {
        repackTreeDataToMenus(value);
      });
    } else {
      treeData.children = "";
    }
  }
}
</script>

<style>
.card-fix-height {
  position: relative;
  height: calc(100vh - 84px - 15px - 15px);
}

.form-item {
  width: 300px;
}
</style>
