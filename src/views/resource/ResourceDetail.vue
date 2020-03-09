<template>
  <div class="resource-detail">
    <h4>资源类型</h4>
    <p class="text-color-info">{{ currentMenuType }}</p>
    <h4>资源名称</h4>
    <p class="text-color-info">{{ node.node.resourceName }}</p>
    <template v-if="node && node.node && node.node.resourceDesc">
      <h4>资源描述</h4>
      <p class="text-color-info">{{ node.node.resourceDesc }}</p>
    </template>
    <template v-if="node && node.node && node.node.icon">
      <h4>资源图标</h4>
      <svg-icon class="text-color-info" :icon-class="node.node.icon">
      </svg-icon>
    </template>
    <template>
      <h4>资源顺序</h4>
      <p class="text-color-info">{{ node.node.idx ? node.node.idx : "0" }}</p>
    </template>
    <template
      v-if="
        node &&
          node.node &&
          node.node.path &&
          node.node.resourceTypeCode == 'menu_item'
      "
    >
      <h4>功能实例</h4>
      <p class="text-color-info">{{ currentResourceInstanceName }}</p>
      <h4 v-if="operatorsData">操作权限</h4>
      <el-table v-if="operatorsData" :data="operatorsData" style="width: 100%">
        <el-table-column prop="operatorCode" label="权限编号" width="150">
        </el-table-column>
        <el-table-column prop="operatorName" label="权限名称">
        </el-table-column>
      </el-table>
    </template>
    <template
      v-permission="['add', 'update', 'delete']"
      v-if="currentResourceType !== 'operator'"
    >
      <h4>可选操作</h4>
      <div>
        <el-button
          v-permission="['add']"
          v-if="
            currentResourceType === 'root' || currentResourceType === 'menu'
          "
          type="text"
          @click="$emit('new-resource')"
          >新增资源</el-button
        >
        <el-button
          v-permission="['update']"
          v-if="
            currentResourceType === 'menu' ||
              currentResourceType === 'menu_item'
          "
          type="text"
          @click="$emit('update-resource')"
          >更新当前资源</el-button
        >
        <el-button
          v-permission="['delete']"
          v-if="
            currentResourceType === 'menu' ||
              currentResourceType === 'menu_item'
          "
          type="text"
          @click="deleteCurrentResouce"
          >删除当前资源</el-button
        >
      </div>
    </template>
  </div>
</template>

<script>
import { deleteResource } from "@/api/resource";
import permission from "@/directive/permission"; // 权限判断指令

export default {
  name: "ResourceDetail",
  directives: { permission },
  props: {
    node: {
      type: Object,
      required: true
    },
    operatorsData: {
      type: Array,
      required: false
    },
    menuResourceOptions: {
      type: Array,
      required: false
    }
  },
  computed: {
    currentResourceType: function() {
      if (this.node && this.node.node) {
        return this.node.node.resourceTypeCode;
      }
      return null;
    },
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
        this.node &&
        this.node.node &&
        this.node.node.path &&
        this.node.node.resourceTypeCode === "menu_item"
      ) {
        let currentPath = this.node.node.path;
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
  methods: {
    deleteCurrentResouce: function() {
      let self = this;
      this.$confirm("该操作将删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: "删除中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        deleteResource(this.node.nodeKey)
          .then(function() {
            self.$message({
              message: "删除成功！",
              type: "success"
            });
            self.$emit("on-deleted", self.node.node.parentCode);
          })
          .finally(function() {
            loading.close();
          });
      });
    }
  }
};
</script>
