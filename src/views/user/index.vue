<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item :label="searchTypeName">
          <el-input
            v-model="searchForm.searchValue"
            :placeholder="searchTypeName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.searchType"
            placeholder="请选择查询类型"
            :default-first-option="true"
          >
            <el-option
              v-for="item in searchTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['search']"
            type="primary"
            @click="onSearchUser"
            icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['add']"
            type="primary"
            @click="onCreateUser"
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
        <el-table-column prop="loginName" label="登录名" width="180">
        </el-table-column>
        <el-table-column prop="userName" label="姓名/昵称" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="300">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          :formatter="statusFormatter"
          label="状态"
          width="100"
        >
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
            <el-button
              @click="onResetPassword(scope.row)"
              type="text"
              size="small"
              >重置密码</el-button
            >
            <el-button
              @click="onUserRoleUpdate(scope.row)"
              type="text"
              size="small"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      class="footer"
      background
      :layout="tableLayout"
      :total="tableTotal"
      :current-page="currentPage"
      :page-size.sync="pageSize"
      @current-change="onCurrentPageChange"
      prev-text="上一页"
      next-text="下一页"
    >
    </el-pagination>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="35%"
      :show-close="false"
    >
      <user-edit
        v-if="dialogFormVisible"
        :is-edit="isFormEdit"
        :editForm="editForm"
        @onCancle="editCancle"
        @onSaveSuccess="onSaved"
      ></user-edit>
    </el-dialog>

    <el-dialog
      :title="dialogAuthTitle"
      :visible.sync="dialogAuthVisible"
      :show-close="false"
      :lock-scroll="true"
    >
      <user-role-config
        v-if="dialogAuthVisible"
        :uid="currentUid"
        @on-cancel="onAuthWindownClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, deleteUser, resetUserPassword } from "@/api/user";
import permission from "@/directive/permission"; // 权限判断指令
import { defaultPageConfig } from "@/config/pagination";
import UserEdit from "./UserEdit";
import UserRoleConfig from "./UserRoleConfig";

export default {
  name: "User",
  components: { UserRoleConfig, UserEdit },
  directives: { permission },
  data: function() {
    return {
      searchForm: {
        searchType: null,
        searchValue: null
      },
      searchTypeOptions: [
        { label: "登录名称", value: "loginName" },
        { label: "用户名", value: "userName" },
        { label: "手机号", value: "phone" },
        { label: "邮箱", value: "email" }
      ],
      tableData: null,
      currentPage: 1,
      tableTotal: -1,
      tablePages: 0,
      tableLayout: defaultPageConfig.layout,
      pageSize: defaultPageConfig.pageSize,
      dialogFormVisible: false,
      tableLoading: false,
      isFormEdit: false,
      editForm: null,
      dialogAuthTitle: "分配角色",
      dialogAuthVisible: false,
      currentUid: null
    };
  },
  computed: {
    searchTypeName: function() {
      if (this.searchForm.searchType == "userName") {
        return "用户名";
      } else if (this.searchForm.searchType == "phone") {
        return "手机号";
      } else if (this.searchForm.searchType == "email") {
        return "邮箱";
      }
      return "登录名称";
    },
    dialogTitle: function() {
      if (this.isFormEdit) {
        return "更新用户";
      } else {
        return "新增用户";
      }
    }
  },
  activated: function() {
    this.searchForm.searchValue = "";
    this.searchForm.searchType = "loginName";
    this.loadUsers();
  },
  created: function() {},
  methods: {
    statusFormatter: function(row, column, cellValue) {
      if (cellValue == 9) {
        return "已锁定";
      }
      return "正常";
    },
    onSearchUser: function() {
      this.currentPage = 1;
      this.loadUsers();
    },
    onCreateUser: function() {
      this.isFormEdit = false;
      this.editForm = null;
      this.dialogFormVisible = true;
    },
    onUserRoleUpdate: function(data) {
      this.currentUid = data.uid;
      this.dialogAuthVisible = true;
    },
    onAuthWindownClose: function() {
      this.dialogAuthVisible = false;
    },
    onResetPassword: function(row) {
      this.$prompt("输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "text",
        inputPlaceholder: "密码不能为空且长度至少为6位",
        inputErrorMessage: "密码不能为空且长度至少为6位",
        inputValidator: function(value) {
          if (
            !value ||
            value === "" ||
            value.trim() === "" ||
            value.length < 6
          ) {
            return false;
          }
          return true;
        }
      }).then(({ value }) => {
        const loading = this.$loading({
          lock: true,
          text: "加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        resetUserPassword(row.uid, value)
          .then(data => {
            if (data && data.value === "1") {
              this.$message({
                type: "success",
                message: "密码更新成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "密码更新失败"
              });
            }
          })
          .finally(() => {
            loading.close();
          });
      });
    },
    loadUsers: function() {
      let self = this;
      this.tableLoading = true;
      getUsers(
        this.searchForm.searchType,
        this.searchForm.searchValue,
        this.currentPage,
        defaultPageConfig.pageSize
      )
        .then(function(data) {
          if (data && data.value) {
            self.tableTotal = data.value.total;
            self.tablePages = data.value.pages;
            self.tableData = data.value.result;
          }
        })
        .finally(function() {
          self.tableLoading = false;
        });
    },
    handleEdit: function(row) {
      this.isFormEdit = true;
      this.editForm = row;
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
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.uid)
            .then(() => {
              self.$message({
                message: "删除成功！",
                type: "success"
              });
              self.loadUsers();
            })
            .finally(() => {
              loading.close();
            });
        })
        .catch(() => loading.close());
    },
    editCancle: function() {
      this.dialogFormVisible = false;
    },
    onSaved: function() {
      this.loadUsers();
    },
    onCurrentPageChange: function(page) {
      this.currentPage = page;
      this.loadUsers();
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
  height: calc(100vh - 84px - 15px - 15px - 51px - 51px);
}
</style>
