<template>
  <div class="createPost-container" style="text-align: center;">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="formRules"
      class="form-container"
      style=" margin:0 auto;"
    >
      <el-row>
        <table width="100%">
          <tr>
            <td>
              <el-form-item label-width="100px" label="医生工号:" prop="jobnum">
                <el-input
                  placeholder="输入工号"
                  v-model="postForm.jobnum"
                ></el-input>
              </el-form-item>
              <el-form-item label-width="100px" label="医生名称:" prop="name">
                <el-input
                  placeholder="输入名称"
                  v-model="postForm.name"
                ></el-input>
              </el-form-item>
            </td>
            <td style="padding-top: 0">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                name="file"
                :headers="uploadHeader"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </td>
          </tr>
        </table>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="100px" label="性别:" prop="sex">
            <el-select
              v-model="postForm.sex"
              placeholder="性别"
              style="width: 100%"
            >
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label-width="100px"
            label="科室:"
            class="postInfo-container-item"
            prop="department"
          >
            <el-cascader
              v-model="departments"
              :options="options"
              :props="defaultCasProps"
              :value="parentCodeArray"
              change-on-select
              class="form-item"
              placeholder="选择科室"
              style="width: 100%"
              :show-all-levels="false"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label-width="100px"
            label="职称:"
            class="postInfo-container-item"
            prop="position"
          >
            <el-select
              v-model="postForm.position"
              placeholder="选择职称"
              style="width: 100%"
            >
              <el-option
                v-for="item in positionListOptions"
                :key="item.metaCode"
                :label="item.metaName"
                :value="item.metaCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label-width="100px"
            label="职务:"
            class="postInfo-container-item"
            prop="duty"
          >
            <el-select
              v-model="postForm.duty"
              placeholder="选择职务"
              style="width: 100%"
            >
              <el-option
                v-for="item in dutyListOptions"
                :key="item.metaCode"
                :label="item.metaName"
                :value="item.metaCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        style="margin-bottom: 40px;"
        label-width="100px"
        label="身份证号:"
        class="postInfo-container-item"
        prop="idcard"
      >
        <el-input
          v-model="postForm.idcard"
          autosize
          placeholder="请输入身份证号"
        ></el-input>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 40px;"
        label-width="100px"
        label="联系电话:"
        class="postInfo-container-item"
        prop="tel"
      >
        <el-input
          v-model="postForm.tel"
          autosize
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item
        style="margin-bottom: 40px;"
        label-width="100px"
        label="擅长领域:"
        class="postInfo-container-item"
        prop="expertise"
      >
        <el-input
          :rows="5"
          v-model="postForm.expertise"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item
        style=""
        label-width="100px"
        label="介绍"
        prop="introduction"
      >
        <!-- use with components - bidirectional data binding（双向数据绑定） -->
        <el-row v-loading="uillUpdateImg">
          <quill-editor
            ref="myTextEditor"
            v-model="postForm.introduction"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange"
          >
          </quill-editor>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader quill-upload"
            :action="uploadUrl"
            name="file"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="concel">取消</el-button>
      </el-form-item>
      <el-form-item style="visibility: hidden">
        <el-input v-model="postForm.doctorCode"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  findDepartmentTree,
  findHospitalDoctorInfo,
  addHospitalDoctor,
  modifyHospitalDoctor
} from "@/api/hospital";
import { findByGroupCode } from "@/api/meta";
import { getTokenType, getToken } from "@/utils/auth";
import { UPLOAD_URL, BASE_URI } from "@/config/index";
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
  name: "addDoctor",
  data() {
    const validateJobnum = (rule, value, callback) => {
      if (!value) {
        callback(new Error("工号不能为空"));
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
    const validateGender = (rule, value, callback) => {
      if (!value) {
        callback(new Error("性别不能为空"));
      } else {
        callback();
      }
    };
    const validatedepartment = (rule, value, callback) => {
      if (!value) {
        callback(new Error("性别不能为空"));
      } else {
        callback();
      }
    };
    return {
      formRules: {
        jobnum: [
          { required: true, trigger: "blur", validator: validateJobnum }
        ],
        name: [{ required: true, trigger: "blur", validator: validateName }],
        sex: [{ required: true, validator: validateGender }],
        department: [{ required: true, validator: validatedepartment }]
      },
      uploadUrl: BASE_URI + "/document/upload",
      postForm: {
        doctorCode: "",
        name: "",
        sex: "",
        pic: "",
        department: "",
        departmentName: "",
        position: "",
        positionName: "",
        expertise: "",
        idcard: "",
        jobnum: "",
        duty: "",
        dutyName: "",
        tel: "",
        introduction: "",
        expertFlag: ""
      },
      departments: [],
      imageUrl: "",
      parentCodeArray: [],
      options: [],
      dutyListOptions: [],
      positionListOptions: [],
      defaultCasProps: {
        children: "children",
        label: "nodeName",
        value: "nodeKey"
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
    this.fetchDuty();
    this.fetchPostion();
    this.loading = false;
  },
  activated() {
    if (
      this.$route.params.code !== null &&
      this.$route.params.code !== "" &&
      this.$route.params.code !== undefined
    ) {
      this.fetchData();
    } else {
      if (this.$refs["postForm"] !== undefined) {
        this.$refs["postForm"].resetFields(this.postForm);
      }
      this.imageUrl = "";
    }
  },
  methods: {
    fetchTree: function() {
      findDepartmentTree("", 1)
        .then(data => {
          this.options = data.value;
        })
        .finally(() => {});
    },
    fetchDuty: function() {
      findByGroupCode("duty")
        .then(data => {
          this.dutyListOptions = data.value;
        })
        .finally(() => {});
    },
    fetchPostion: function() {
      findByGroupCode("position")
        .then(data => {
          this.positionListOptions = data.value;
        })
        .finally(() => {});
    },
    fetchData: function() {
      this.postForm.doctorCode = this.$route.params.code;
      if (
        this.postForm.doctorCode !== null &&
        this.postForm.doctorCode !== "" &&
        this.postForm.doctorCode !== undefined
      ) {
        findHospitalDoctorInfo(this.postForm.doctorCode)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            } else {
              this.postForm = data.value;
              this.postForm.introduction = data.value.introduction;
              this.imageUrl = UPLOAD_URL + data.value.pic;
              let nodeCodeSequence = [];
              if (data.value.department !== "0") {
                getNodeCodeSequence(
                  nodeCodeSequence,
                  data.value.department,
                  this.options
                );
              }
              this.departments = nodeCodeSequence;
            }
          })
          .finally(() => {});
      }
    },
    handleChange(value) {
      console.log(value[value.length - 1]);
      this.postForm.department = value[value.length - 1];
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
    onEditorChange: function({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.postForm.introduction = html;
    },
    onSubmit: function() {
      console.log(this.postForm.doctorCode);
      this.$refs.postForm.validate(valid => {
        if (
          this.postForm.department === null ||
          this.postForm.department === ""
        ) {
          this.$message.warning("请选择科室！");
          return;
        }
        if (valid) {
          this.loading = true;
          if (
            this.postForm.doctorCode === null ||
            this.postForm.doctorCode === "" ||
            this.postForm.doctorCode === undefined
          ) {
            addHospitalDoctor(this.postForm)
              .then(data => {
                debugger;
                if (data.code !== "200") {
                  this.$message.warning(data.message);
                }
                if (data.code === "200" && data.value !== "") {
                  this.$message.info("添加成功");
                  this.closeSelectedTag();
                }
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            modifyHospitalDoctor(this.postForm)
              .then(data => {
                if (data.code !== "200") {
                  this.$message.warning(data.message);
                }
                if (data.value > 0) {
                  this.$message.info("修改成功");
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
    handleAvatarSuccess: function(response) {
      console.log("response", response);
      this.imageUrl = response.value[0].url;
      this.postForm.pic = response.value[0].docId;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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

    uploadSuccess(response) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
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

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.uillUpdateImg = false;
      this.$message.error("图片插入失败");
    }
  }
};

function getNodeCodeSequence(result, departmentCode, treeData) {
  var parentCode = getParentNode(departmentCode, treeData);
  if (parentCode === "0" || parentCode === undefined) {
    result.splice(0, 0, departmentCode);
    return result;
  } else {
    result.splice(0, 0, parentCode);
    console.log(treeData.length);
    getNodeCodeSequence(result, parentCode, treeData);
  }
}
function getParentNode(parentCode, treeData) {
  var result = "";
  for (var i = 0; i < treeData.length; i++) {
    var value = treeData[i];
    if (value.nodeKey === parentCode) {
      console.log(value);
      result = value.node.parentCode;
      return result;
    } else {
      if (value.children.length > 0) {
        return getParentNode(parentCode, value.children);
      }
    }
  }
}
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
