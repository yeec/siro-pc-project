<template>
  <div class="role-edit">
    <el-form
      v-loading="loading"
      :model="userForm"
      :rules="userFormRules"
      ref="userForm"
      status-icon
      label-width="80px"
      style="margin-left: 24px;margin-right: 24px;"
    >
      <el-input v-if="isEdit" type="hidden" v-model="userForm.uid"></el-input>
      <template>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="userForm.loginName"></el-input>
        </el-form-item>
      </template>
      <template>
        <el-form-item label="姓名/昵称" prop="userName">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item v-if="isEdit == false" label="初始密码" prop="pwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="userForm.pwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="admin">
        <el-radio v-model="userForm.admin" :label="false">普通用户</el-radio>
        <el-radio v-model="userForm.admin" :label="true">超级管理员</el-radio>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio v-model="userForm.status" label="0">正常</el-radio>
        <el-radio v-model="userForm.status" label="9">锁定</el-radio>
      </el-form-item>
      <el-form-item class="form-footer">
        <el-button @click="onFormCancle">取消</el-button>
        <el-button type="primary" @click="onFormSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addUser, updateUser } from "@/api/user";
import { validatPhone, validatEmail } from "@/utils/validate";
export default {
  name: "UserEdit",
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
    const validateLoginName = (rule, value, callback) => {
      if (!value || value === "" || value.trim() === "") {
        callback(new Error("登录名不能为空"));
      } else {
        callback();
      }
    };
    const validateUserName = (rule, value, callback) => {
      if (!value || value === "" || value.trim() === "") {
        callback(new Error("姓名/昵称不能为空"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value != null && value != "") {
        if (!validatPhone(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value || value === "" || value.trim() === "" || value.length < 6) {
        callback(new Error("密码不能为空且长度至少为6位"));
      } else {
        callback();
      }
    };

    const validateEmail = (rule, value, callback) => {
      if (value != null && value != "") {
        if (!validatEmail(value)) {
          callback(new Error("邮箱格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      userForm: {
        uid: null,
        loginName: null,
        userName: null,
        pwd: null,
        phone: null,
        email: null,
        avatar: null,
        admin: false,
        status: "0"
      },
      userFormRules: {
        loginName: [{ validator: validateLoginName, trigger: "blur" }],
        userName: [{ validator: validateUserName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        pwd: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  watch: {
    editForm: function(value) {
      if (this.isEdit == true) {
        this.userForm = value;
      }
    }
  },
  mounted: function() {
    if (this.isEdit == true) {
      this.userForm = this.editForm;
    }
  },
  methods: {
    onFormSave: function() {
      let self = this;
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          self.loading = true;
          if (this.isEdit) {
            updateUser(self.userForm)
              .then(function() {
                self.$message({
                  message: "更新成功！",
                  type: "success"
                });
                self.$emit("onSaveSuccess");
              })
              .finally(function() {
                self.loading = false;
                self.$refs.userForm.resetFields();
                self.$emit("onCancle");
              });
          } else {
            addUser(self.userForm)
              .then(function() {
                self.$message({
                  message: "新增成功！",
                  type: "success"
                });
                self.$emit("onSaveSuccess");
              })
              .finally(function() {
                self.loading = false;
                self.$refs.userForm.resetFields();
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
