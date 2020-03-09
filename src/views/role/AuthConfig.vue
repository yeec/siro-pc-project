<template>
  <div class="auth-config dialog-body scrollable">
    <el-tree
      v-loading="treeLoading"
      ref="tree"
      node-key="nodeKey"
      :props="defaultTreeProps"
      :data="resourceTreeData"
      :highlight-current="true"
      :expand-on-click-node="false"
      :default-expand-all="true"
      show-checkbox
    >
    </el-tree>
    <div class="diloag-footer">
      <el-button @click="onCancle">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { updateRoleResources, findRoleResources } from "@/api/role";
import { getResources } from "@/api/resource";

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
  name: "AuthConfig",
  props: {
    roleCode: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      treeLoading: false,
      resourceTreeData: null,
      currentNode: rootTreeNode,
      checkedTreeKeys: null,
      defaultTreeProps: {
        children: "children",
        label: function(data) {
          if (data && data.node) {
            return data.node.resourceName;
          }
          return "";
        }
      }
    };
  },
  watch: {
    roleCode: {
      handler: function() {
        this.loadResourceTree(false);
      },
      deep: true
    }
  },
  updated: function() {
    if (this.$refs && this.$refs.tree) {
      this.$refs.tree.setCheckedKeys(this.checkedTreeKeys);
    }
  },
  created: function() {
    //加载tree
    this.loadResourceTree(true);
  },
  methods: {
    loadResourceTree: function(firstLoad) {
      //加载资源树
      let self = this;
      // var resources = getResourceConfigs();
      this.resourceTreeData = [rootTreeNode];
      this.treeLoading = true;
      let resourcesReq = getResources();
      let roleResourcesReq = findRoleResources(this.roleCode);
      Promise.all([resourcesReq, roleResourcesReq])
        .then(result => {
          let resources = result[0];
          if (
            resources.value &&
            resources.value.children &&
            resources.value.children.length > 0
          ) {
            this.resourceTreeData[0].children = resources.value.children;

            if (firstLoad) {
              self.currentNode = this.resourceTreeData[0];
              //设置当前选中为根节点
              self.$refs.tree.setCurrentKey("0");
            }
          }
          let roleResources = result[1];
          self.checkedTreeKeys = [];
          if (roleResources && roleResources.value) {
            roleResources.value.forEach(row => {
              self.checkedTreeKeys.push(row.resourceCode);
            });
          }
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },
    onCancle: function() {
      this.$emit("on-cancel");
    },
    onSave: function() {
      let self = this;
      this.treeLoading = true;
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      if (checkedKeys == undefined || checkedKeys == null) checkedKeys = [];
      let resources = checkedKeys.concat(halfCheckedKeys);
      resources = resources.filter(function(row) {
        if (
          row == undefined ||
          row == null ||
          row.trim() === "" ||
          row.trim() === "0"
        ) {
          return false;
        }
        return true;
      });
      updateRoleResources(this.roleCode, resources)
        .then(() => {
          self.$message({
            message: "保存成功！",
            type: "success"
          });
        })
        .finally(() => {
          self.treeLoading = false;
          self.$emit("on-cancel");
        });
    }
  }
};
</script>

<style>
.diloag-footer {
  padding-top: 10px;
  text-align: right;
  box-sizing: border-box;
  position: absolute;
  bottom: 10px;
  right: 24px;
}

.dialog-body {
  height: 500px;
  margin-bottom: 40px;
}
</style>
