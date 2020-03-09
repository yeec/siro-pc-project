<template>
  <div class="role-edit">
    <el-form
      v-loading="loading"
      :model="roleForm"
      :rules="roleFormRules"
      ref="roleForm"
      status-icon
      label-width="80px"
      style="margin-left: 24px;margin-right: 24px;"
    >
      <template v-if="isEdit">
        <!-- <el-form-item> -->
        <el-input type="hidden" v-model="roleForm.roleCode"></el-input>
        <!-- </el-form-item> -->
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.newRoleCode"></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input
          type="textarea"
          rows="4"
          v-model="roleForm.roleDesc"
        ></el-input>
      </el-form-item>
      <el-form-item class="form-footer">
        <el-button @click="onFormCancle">取消</el-button>
        <el-button type="primary" @click="onFormSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addRole, updateRole } from "@/api/role";
export default {
  name: "RoleEdit",
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    editForm: {
      type: Object,
      required: false
    }
  },
  data: function() {
    let reg = /^[0-9a-zA-Z]+$/;
    const validateRoleCode = (rule, value, callback) => {
      if (!this.isEdit) {
        if (!value || value === "" || value.trim() === "") {
          callback(new Error("角色编码不能为空"));
        } else {
          if (!reg.test(value)) {
            callback(new Error("角色编码只能为英文和数字"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    const validateEditRoleCode = (rule, value, callback) => {
      if (this.isEdit) {
        if (!value || value === "" || value.trim() === "") {
          callback(new Error("角色编码不能为空"));
        } else {
          if (!reg.test(value)) {
            callback(new Error("角色编码只能为英文和数字"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    const validateRoleName = (rule, value, callback) => {
      if (!value || value === "" || value.trim() === "") {
        callback(new Error("角色名称不能为空"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      roleForm: {
        roleCode: null,
        roleName: null,
        roleDesc: null,
        newRoleCode: null
      },
      roleFormRules: {
        roleCode: [{ validator: validateRoleCode, trigger: "blur" }],
        newRoleCode: [{ validator: validateEditRoleCode, trigger: "blur" }],
        roleName: [{ validator: validateRoleName, trigger: "blur" }]
      }
    };
  },
  watch: {
    editForm: {
      handler: function(value) {
        if (this.isEdit == true) {
          this.roleForm = value;
          this.roleForm.newRoleCode = value.roleCode;
        } else {
          this.roleForm = {
            roleCode: null,
            roleName: null,
            roleDesc: null,
            newRoleCode: null
          };
        }
      },
      deep: true
    }
  },
  mounted: function() {
    if (this.isEdit == true) {
      this.roleForm = JSON.parse(JSON.stringify(this.editForm));
      this.roleForm.newRoleCode = this.editForm.roleCode;
    } else {
      this.roleForm = {
        roleCode: null,
        roleName: null,
        roleDesc: null,
        newRoleCode: null
      };
    }
  },
  methods: {
    onFormSave: function() {
      let self = this;
      this.$refs["roleForm"].validate(valid => {
        if (valid) {
          self.loading = true;
          if (this.isEdit) {
            updateRole(self.roleForm)
              .then(function() {
                self.$message({
                  message: "更新成功！",
                  type: "success"
                });
                self.$emit("onSaveSuccess");
              })
              .finally(function() {
                self.loading = false;
                self.$refs["roleForm"].resetFields();
                self.$emit("onCancle");
              });
          } else {
            addRole(self.roleForm)
              .then(function() {
                self.$message({
                  message: "新增成功！",
                  type: "success"
                });
                self.$emit("onSaveSuccess");
              })
              .finally(function() {
                self.loading = false;
                self.$refs["roleForm"].resetFields();
                self.$emit("onCancle");
              });
          }
        } else {
          return false;
        }
      });
    },
    onFormCancle: function() {
      this.$emit("onCancle");
    }
  }
};
</script>
