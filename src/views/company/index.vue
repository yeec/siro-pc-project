<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-card style="width: 70%;margin: 0 auto">
        <div slot="header">
          <span>基础信息</span>
        </div>
        <el-form-item label="公司名称" prop="basicName">
          <el-input
            v-model.trim="form.basicName"
            :disabled="this.isEdit"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司法人" prop="corporation">
              <el-input
                v-model.trim="form.corporation"
                :disabled="this.isEdit"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="法人联系方式" prop="corporationTel">
              <el-input
                v-model.trim="form.corporationTel"
                :disabled="this.isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input
                v-model.trim="form.contact"
                :disabled="this.isEdit"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model.trim="form.phone"
                :disabled="this.isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="公司官网" prop="webSite">
          <el-input
            v-model.trim="form.webSite"
            :disabled="this.isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司logo" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="uploadHeader"
            :show-file-list="false"
            name="file"
            :on-success="onUploadSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="this.isEdit"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司简介" prop="basicRemark">
          <el-input
            v-model.trim="form.basicRemark"
            :disabled="this.isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司详细介绍" prop="content">
          <j-editor
            :contentValue="form.content"
            v-on:changeContent="changeContent"
            :is-edit="this.isEdit"
          ></j-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="this.isEdit" @click="update"
            >修改</el-button
          >
          <el-button type="primary" v-show="!this.isEdit" @click="save"
            >保存</el-button
          >
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.quill-editor {
  height: 400px;
}

.ql-container {
  height: 70%;
}
</style>
<script>
import { modifyProperty, getPropertyOne } from "@/api/company";
import { getToken, getTokenType } from "@/utils/auth";
import { SERVERURL, UPLOAD_URL } from "@/config/index";
import JEditor from "@/components/quillEditor/editor";

export default {
  data() {
    return {
      isLoading: false,
      form: {
        basicCode: "",
        basicName: "",
        corporation: "",
        corporationTel: "",
        contact: "",
        phone: "",
        webSite: "",
        logo: "",
        basicRemark: "",
        content: ""
      },
      isEdit: true,
      imageUrl: "",
      rules: {
        storeName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      uploadUrl: SERVERURL
    };
  },
  components: {
    JEditor
  },
  computed: {
    uploadHeader: function() {
      return {
        Authorization: getTokenType() + " " + getToken()
      };
    }
  },
  methods: {
    changeContent(content) {
      //富文本编辑器  文本改变时 设置字段值
      this.form.content = content;
    },
    initData: function() {
      let self = this;
      getPropertyOne().then(data => {
        self.form = data.value;
        self.imageUrl = UPLOAD_URL + data.value.logo;
      });
    },
    update: function() {
      this.isEdit = false;
    },
    save: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let self = this;
          //修改表单提交
          modifyProperty(this.form)
            .then(function() {
              self.$message({
                message: "修改成功！",
                type: "success"
              });
            })
            .finally(function() {
              self.isEdit = true;
            });
        } else {
          console.log("保存失败，请校验表单数据");
          return false;
        }
      });
    },
    onUploadSuccess: function(response) {
      //console.log("response", response);
      console.log("response", response);
      this.imageUrl = response.value[0].url;
      this.form.logo = response.value[0].docId;
    },
    beforeAvatarUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    }
  },
  created: function() {
    this.initData();
  }
};
</script>
