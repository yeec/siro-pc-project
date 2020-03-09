<template>
  <div class="createPost-container" style="text-align: center;">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="formRules"
      v-loading="formLoading"
      class="form-container"
      style=" margin:0 auto;"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label-width="100px"
            label="编号"
            class="postInfo-container-item"
            prop="diseaseCode"
          >
            <el-input
              v-model="postForm.diseaseCode"
              :disabled="diseaseCodeInput"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label-width="100px"
            label="名称"
            class="postInfo-container-item"
            prop="diseaseName"
          >
            <el-input v-model="postForm.diseaseName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        style=""
        label-width="100px"
        label="症状"
        prop="diseaseSymptomsDesc"
      >
        <el-row v-loading="uillUpdateImg">
          <quill-editor
            ref="mySymptomEditor"
            v-model="postForm.diseaseSymptomsDesc"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange1"
          >
          </quill-editor>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader quill-upload"
            :action="uploadUrl"
            name="file"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="uploadSuccess1"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item
        style=""
        label-width="100px"
        label="检查"
        prop="diseaseExaminationDesc"
      >
        <el-row v-loading="uillUpdateImg">
          <quill-editor
            ref="myCheckEditor"
            v-model="postForm.diseaseExaminationDesc"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange2"
          >
          </quill-editor>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader quill-upload"
            :action="uploadUrl"
            name="file"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="uploadSuccess2"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item
        style=""
        label-width="100px"
        label="治疗"
        prop="diseaseTreatingDesc"
      >
        <el-row v-loading="uillUpdateImg">
          <quill-editor
            ref="mytreatEditor"
            v-model="postForm.diseaseTreatingDesc"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange3"
          >
          </quill-editor>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader quill-upload"
            :action="uploadUrl"
            name="file"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="uploadSuccess3"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item
        style=""
        label-width="100px"
        label="预防和预后"
        prop="diseasePapDesc"
      >
        <el-row v-loading="uillUpdateImg">
          <quill-editor
            ref="myDefendEditor"
            v-model="postForm.diseasePapDesc"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange4"
          >
          </quill-editor>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader quill-upload"
            :action="uploadUrl"
            name="file"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="uploadSuccess4"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
          </el-upload> </el-row
        >f
      </el-form-item>
      <el-form-item
        label-width="100px"
        label="科室:"
        class="postInfo-container-item"
        prop="departments"
      >
        <el-tree
          ref="departmentsTree"
          :data="data5"
          :props="defaultProps"
          node-key="nodeKey"
          show-checkbox
          v-loading="treeLoading"
        >
        </el-tree>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="concel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  findDepartmentTree,
  findDiseaseInfoByDiseaseCode,
  addDiseaseInfo,
  modifyDiseaseInfo
} from "@/api/hospital";
import { getTokenType, getToken } from "@/utils/auth";
import { BASE_URI } from "@/config";
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["image"],
  ["clean"] // remove formatting button
];
export default {
  name: "addDisease",
  data() {
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("编号不能为空"));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("名称不能为空"));
      } else {
        callback();
      }
    };
    const validatedepartment = (rule, value, callback) => {
      if (!value || value.length < 0) {
        callback(new Error("请选择科室"));
      } else {
        callback();
      }
    };
    return {
      uploadUrl: BASE_URI + "/document/upload",
      formRules: {
        diseaseCode: [
          { required: true, trigger: "blur", validator: validateCode }
        ],
        diseaseName: [
          { required: true, trigger: "blur", validator: validateName }
        ],
        departments: [{ required: true, validator: validatedepartment }]
      },
      postForm: {
        id: "",
        diseaseCode: "",
        diseaseName: "",
        diseaseDesc: "",
        diseaseSymptomsDesc: "",
        diseaseExaminationDesc: "",
        diseaseTreatingDesc: "",
        diseasePapDesc: "",
        departments: []
      },
      diseaseCodeInput: false,
      formLoading: false,
      treeLoading: false,
      data5: [],
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      uillUpdateImg: false,
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".quill-upload input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  computed: {
    uploadHeader: function() {
      return {
        Authorization: getTokenType() + " " + getToken()
      };
    }
  },
  created: function() {
    this.loading = true;
    this.fetchTree();
    this.loading = false;
  },
  activated() {
    if (this.$route.params.code !== null && this.$route.params.code !== "") {
      this.fetchData();
    } else {
      this.diseaseCodeInput = false;
      this.$refs["postForm"].resetFields(this.postForm);
    }
  },
  methods: {
    fetchTree: function() {
      this.treeLoading = true;
      findDepartmentTree("", 1)
        .then(data => {
          this.data5 = data.value;
        })
        .finally(() => {});
      this.treeLoading = false;
    },
    fetchData: function() {
      this.postForm.diseaseCode = this.$route.params.code;
      if (
        this.postForm.diseaseCode !== null &&
        this.postForm.diseaseCode !== ""
      ) {
        this.formLoading = true;
        findDiseaseInfoByDiseaseCode(this.postForm.diseaseCode)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
              return;
            }
            if (data.code === "200" && data.value !== "") {
              this.postForm = data.value;
              this.diseaseCodeInput = true;
              if (data.value.departments.length > 0) {
                let departs = [];
                data.value.departments.forEach(value => {
                  departs.splice(0, 0, value.departmentCode);
                });
                this.$refs.departmentsTree.setCheckedKeys(departs, false);
              }
            }
          })
          .finally(() => {
            this.formLoading = false;
          });
      } else {
        this.diseaseCodeInput = false;
        this.$refs["postForm"].resetFields(this.postForm);
      }
    },
    onEditorBlur: function(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus: function(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady: function(editor) {
      console.log("editor ready!", editor);
    },
    onEditorChange1: function({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.postForm.diseaseSymptomsDesc = html;
    },
    onEditorChange2: function({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.postForm.diseaseExaminationDesc = html;
    },
    onEditorChange3: function({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.postForm.diseaseTreatingDesc = html;
    },
    onEditorChange4: function({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.postForm.diseasePapDesc = html;
    },
    onSubmit: function() {
      this.postForm.departments = this.$refs.departmentsTree.getCheckedKeys(
        true
      );
      console.log(this.postForm.departments);
      this.$refs.postForm.validate(valid => {
        if (
          this.postForm.departments === null ||
          this.postForm.departments.length < 0
        ) {
          this.$message.warning("请选择科室！");
          return;
        }
        if (valid) {
          debugger;
          this.loading = true;
          if (this.postForm.id === null || this.postForm.id === "") {
            addDiseaseInfo(this.postForm)
              .then(data => {
                if (data.code !== "200") {
                  this.$message.warning(data.message);
                  return;
                }
                if (data.code === "200" && data.value !== "") {
                  this.$message.info("保存成功！");
                  this.closeSelectedTag();
                }
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            modifyDiseaseInfo(this.postForm)
              .then(data => {
                if (data.code !== "200") {
                  this.$message.warning(data.message);
                  return;
                }
                if (data.code === "200" && data.value !== "") {
                  this.$message.info("保存成功！");
                  this.closeSelectedTag();
                }
              })
              .finally(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    concel: function() {
      this.closeSelectedTag();
    },
    closeSelectedTag: function() {
      this.$store.dispatch("delView", this.$route).then(({ visitedViews }) => {
        const latestView = visitedViews.slice(-1)[0];
        if (latestView) {
          this.$router.push(latestView);
        } else {
          this.$router.push("/");
        }
      });
    },
    visitedViews: function() {
      return this.$store.state.tagsView.visitedViews;
    },
    // 富文本图片上传前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.uillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    uploadSuccess1(response) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.mySymptomEditor.quill;
      // 如果上传成功
      if (response.code === "200") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", response.value[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.uillUpdateImg = false;
    },
    uploadSuccess2(response) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myCheckEditor.quill;
      // 如果上传成功
      if (response.code === "200") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", response.value[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.uillUpdateImg = false;
    },
    uploadSuccess3(response) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.mytreatEditor.quill;
      // 如果上传成功
      if (response.code === "200") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", response.value[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.uillUpdateImg = false;
    },
    uploadSuccess4(response) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myDefendEditor.quill;
      // 如果上传成功
      if (response.code === "200") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", response.value[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.uillUpdateImg = false;
    }
  }
};
</script>

<style>
.quill-editor {
  height: 400px;
}
.ql-container {
  height: 85%;
}
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
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
