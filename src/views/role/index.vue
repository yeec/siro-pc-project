<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.roleName"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['search']"
            type="primary"
            @click="onSearchRole"
            icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['add']"
            type="primary"
            @click="onCreateRole"
            icon="el-icon-plus"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-card shadow="never" class=" scrollable">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        row-key="id"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="roleCode" label="角色编码" width="180">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300">
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="180">
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="240">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button @click="handleDelete(scope.row)" type="text" size="small"
              >删除</el-button
            >
            <el-button @click="onUpResource(scope.row)" type="text" size="small"
              >授权</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="35%"
      :show-close="false"
    >
      <role-edit
        v-if="dialogFormVisible"
        :is-edit="isFormEdit"
        :editForm="editForm"
        @onCancle="editCancle"
        @onSaveSuccess="onSaved"
      />
    </el-dialog>

    <el-dialog
      :title="dialogAuthTitle"
      :visible.sync="dialogAuthVisible"
      :show-close="false"
      :lock-scroll="true"
    >
      <auth-config
        v-if="dialogAuthVisible"
        :role-code="currentRoleCode"
        @on-cancel="onAuthWindownClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getRoles } from "@/api/role";
import permission from "@/directive/permission"; // 权限判断指令
import RoleEdit from "./RoleEdit";
import { deleteRole } from "@/api/role";
import AuthConfig from "./AuthConfig";

export default {
  name: "Role",
  components: { AuthConfig, RoleEdit },
  directives: { permission },
  data: function() {
    return {
      searchForm: {
        roleName: null
      },
      tableData: null,
      dialogFormVisible: false,
      tableLoading: false,
      isFormEdit: false,
      editForm: null,
      dialogAuthTitle: "设置权限",
      dialogAuthVisible: false,
      currentRoleCode: null
    };
  },
  computed: {
    dialogTitle: function() {
      if (this.isFormEdit) {
        return "更新角色";
      } else {
        return "新增角色";
      }
    }
  },
  activated: function() {
    this.searchForm.roleName = "";
    this.loadRoles();
  },
  created: function() {},
  methods: {
    onSearchRole: function() {
      this.loadRoles();
    },
    onCreateRole: function() {
      this.isFormEdit = false;
      this.editForm = null;
      this.dialogFormVisible = true;
    },
    onUpResource: function(data) {
      this.currentRoleCode = data.roleCode;
      this.dialogAuthVisible = true;
    },
    onAuthWindownClose: function() {
      this.dialogAuthVisible = false;
    },
    loadRoles: function() {
      let self = this;
      this.tableLoading = true;
      getRoles(this.searchForm.roleName)
        .then(function(data) {
          if (data) {
            self.tableData = data.value;
          }
        })
        .finally(function() {
          self.tableLoading = false;
        });
    },
    handleEdit: function(row) {
      let newObj = JSON.parse(JSON.stringify(row));
      this.isFormEdit = true;
      this.editForm = newObj;
      this.dialogFormVisible = true;
    },
    handleDelete: function(row) {
      let self = this;
      const loading = this.$loading({
        lock: true,
        text: "删除中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.roleCode)
            .then(() => {
              self.$message({
                message: "删除成功！",
                type: "success"
              });
              self.loadRoles();
            })
            .finally(() => {
              loading.close();
            });
        })
        .catch(() => loading);
    },
    editCancle: function() {
      this.dialogFormVisible = false;
    },
    onSaved: function() {
      this.loadRoles();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.card-fix-height {
  position: relative;
  height: calc(100vh - 84px - 15px - 15px - 51px);
}
</style>
