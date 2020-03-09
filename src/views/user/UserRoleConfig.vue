<template>
  <div class="user-role-resource dialog-body scrollable">
    <el-table
      v-loading="loading"
      ref="table"
      :data="tableData"
      row-key="roleCode"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="roleCode"
        label="角色编号"
        width="120"
      ></el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
    </el-table>
    <div class="diloag-footer">
      <el-button @click="onCancle">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getRoles } from "@/api/role";
import { findUserRoles, updateUserRoles } from "@/api/user";

export default {
  name: "UserRoleConfig",
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      tableData: null,
      loading: false,
      selectedRows: null
    };
  },
  updated: function() {
    if (this.selectedRows && this.$refs && this.$refs.table) {
      let self = this;
      this.selectedRows.forEach(function(key) {
        console.log("key", key);
        self.$refs.table.toggleRowSelection(key, true);
      });
    }
  },
  created: function() {
    this.loadRoles();
  },
  watch: {
    uid: {
      handler: function() {
        this.loadRoles(false);
      },
      deep: true
    }
  },
  methods: {
    loadRoles: function() {
      let self = this;
      this.loading = true;
      var roleSeq = getRoles(null);
      var userRoleSeq = findUserRoles(this.uid);

      Promise.all([roleSeq, userRoleSeq])
        .then(data => {
          if (data && data[0]) {
            this.tableData = data[0].value;
          }
          let selectedList = [];
          if (data && data[1] && data[1].value && self.tableData) {
            self.tableData.forEach(function(row1) {
              data[1].value.forEach(function(row2) {
                if (
                  row1 &&
                  row1.roleCode &&
                  row2 &&
                  row2.roleCode &&
                  row1.roleCode == row2.roleCode
                ) {
                  selectedList.push(row1);
                }
              });
            });
          }
          self.selectedRows = selectedList;
        })
        .finally(() => {
          self.loading = false;
        });
    },
    handleSelectionChange: function(val) {
      this.selectedRows = val;
    },
    onSave: function() {
      let self = this;
      this.loading = true;
      let checkedRoleCodes = [];
      if (this.selectedRows) {
        this.selectedRows.forEach(function(row) {
          if (row && row.roleCode) {
            checkedRoleCodes.push(row.roleCode);
          }
        });
      }
      updateUserRoles(this.uid, checkedRoleCodes)
        .then(() => {
          self.$message({
            message: "保存成功！",
            type: "success"
          });
        })
        .finally(() => {
          self.loading = false;
          self.$emit("on-cancel");
        });
    },
    onCancle: function() {
      this.$emit("on-cancel");
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
  max-height: 500px;
  margin-bottom: 40px;
}
</style>
