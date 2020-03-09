<template>
  <el-form ref="form" :model="form" label-width="80px" style="with: 70%">
    <el-row>
      <table width="100%">
        <tr>
          <td>
            <el-form-item label="科室名称" prop="departmentName">
              <el-input
                v-model="form.departmentName"
                placeholder="科室名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="科室位置" prop="location">
              <el-input
                v-model="form.location"
                placeholder="科室位置"
              ></el-input>
            </el-form-item>
          </td>
          <td style="padding-top: 0;">
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

    <el-form-item label="上级科室" prop="parentCode">
      <el-cascader
        v-model="form.parentCode"
        :options="options"
        :props="defaultCasProps"
        :value="parentCodeArray"
        change-on-select
        class="form-item"
        placeholder="选择上级科室"
        style="with: 200px"
        :show-all-levels="false"
        @change="handleChange"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="上班时间" prop="time">
      <el-row>
        <el-col :span="1" align="center">上午</el-col>
        <el-col :span="10">
          <el-time-picker
            is-range
            v-model="form.amTime"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            arrow-control
            value-format="HHmm"
            @change="amChange"
          >
          </el-time-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1" align="center">下午</el-col>
        <el-col :span="10">
          <el-time-picker
            is-range
            v-model="form.pmTime"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            arrow-control
            value-format="HHmm"
            @change="pmChange"
          >
          </el-time-picker>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="科室序号" prop="idx">
      <el-input-number
        v-model="form.idx"
        :min="0"
        :max="1000"
        label="序号"
      ></el-input-number>
    </el-form-item>
    <el-row>
      <el-form-item label="电话" prop="tel">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.tel"
          placeholder="科室电话，多个以逗号间隔"
        ></el-input>
      </el-form-item>
    </el-row>
    <el-form-item label="科室简介" prop="departmentDesc">
      <el-input
        v-model="form.departmentDesc"
        type="textarea"
        :row="5"
        placeholder="填写科室简介"
      ></el-input>
    </el-form-item>
    <el-form-item label="科室介绍" prop="departmentIntr" style="height: 450px">
      <!-- use with components - bidirectional data binding（双向数据绑定） -->
      <el-row v-loading="uillUpdateImg">
        <quill-editor
          ref="myTextEditor"
          v-model="form.departmentIntr"
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
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="concel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  findHospitalDepartmentByCode,
  addHospitalDepartment,
  findDepartmentTree,
  modifyHospitalDepartment
} from "@/api/hospital";
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
  name: "addHosDepart",
  data() {
    return {
      uploadUrl: BASE_URI + "/document/upload",
      form: {
        departmentCode: "",
        departmentName: "",
        pic: "",
        amTime: ["0000", "2359"],
        pmTime: ["0000", "2359"],
        amStartTime: "",
        amEndTime: "",
        pmStartTime: "",
        pmEndTime: "",
        tel: "",
        location: "",
        parentCode: [],
        departmentDesc: "",
        departmentIntr: "",
        idx: "0"
      },
      loading: false,
      parentCodeArray: [],
      defaultCasProps: {
        children: "children",
        label: "nodeName",
        value: "nodeKey"
      },
      options: [],
      imageUrl: "",
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
    },
    editor: function() {
      return this.$refs.myTextEditor.quillEditor;
    }
  },
  created: function() {
    this.fetchTree();
  },
  activated() {
    if (
      this.$route.params.code !== undefined &&
      this.$route.params.code !== null &&
      this.$route.params.code !== ""
    ) {
      this.fetchData();
    } else {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields(this.form);
      }
      this.imageUrl = "";
    }
  },
  methods: {
    fetchTree: function() {
      findDepartmentTree("", 1)
        .then(data => {
          this.options = data.value;
          this.fetchData();
        })
        .finally(() => {});
    },
    fetchData: function() {
      this.loading = true;
      this.form.departmentCode = this.$route.params.code;
      if (
        this.form.departmentCode !== undefined &&
        this.form.departmentCode !== null &&
        this.form.departmentCode !== ""
      ) {
        console.log(this.form.departmentCode);
        findHospitalDepartmentByCode(this.form.departmentCode)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            }
            this.form.departmentName = data.value.departmentName;
            this.form.location = data.value.location;
            this.form.amTime = [
              ' "0 ' + data.value.amStartTime + '"',
              String(data.value.amEndTime)
            ];
            this.form.pmTime = [
              String(data.value.pmStartTime),
              String(data.value.pmEndTime)
            ];
            this.form.amStartTime = data.value.amStartTime;
            this.form.amEndTime = data.value.amEndTime;
            this.form.pmStartTime = data.value.pmStartTime;
            this.form.pmEndTime = data.value.pmEndTime;
            this.form.tel = data.value.tel;
            this.form.departmentDesc = data.value.departmentDesc;
            this.$refs.myTextEditor.quill.container.querySelector(
              ".ql-editor"
            ).innerHTML = data.value.departmentIntr;
            this.form.departmentIntr = data.value.departmentIntr;
            this.form.idx = data.value.idx;
            this.imageUrl = UPLOAD_URL + data.value.pic;
            this.form.pic = data.value.pic;
            //设置当前节点及所关联的所有父节点编号的array列表
            let nodeCodeSequence = [];
            if (data.value.parentCode !== "0") {
              getNodeCodeSequence(
                nodeCodeSequence,
                this.form.departmentCode,
                this.options
              );
            }
            this.form.parentCode = nodeCodeSequence;
          })
          .finally(() => {});
      }
      this.loading = false;
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
      this.form.departmentIntr = html;
    },
    onSubmit: function() {
      this.loading = true;
      var depart = {
        departmentCode: "",
        parentCode: "",
        departmentName: "",
        departmentDesc: "",
        tel: "",
        pic: "",
        location: "",
        departmentIntr: "",
        amStartTime: "",
        amEndTime: "",
        pmStartTime: "",
        pmEndTime: "",
        idx: 0
      };
      if (
        this.form.departmentName === null ||
        this.form.departmentName === ""
      ) {
        this.$message.warning("请填写科室名称");
        return;
      }
      if (this.form.parentCode === null || this.form.parentCode.length <= 0) {
        depart.parentCode = "0";
      } else {
        depart.parentCode = this.form.parentCode[
          this.form.parentCode.length - 1
        ];
      }
      depart.departmentName = this.form.departmentName;
      depart.departmentDesc = this.form.departmentDesc;
      depart.tel = this.form.tel;
      depart.location = this.form.location;
      depart.departmentIntr = this.form.departmentIntr;
      depart.amStartTime =
        this.form.amStartTime === "" ? "0000" : this.form.amStartTime;
      depart.amEndTime =
        this.form.amEndTime === "" ? "2359" : this.form.amEndTime;
      depart.pmStartTime =
        this.form.pmStartTime === "" ? "0000" : this.form.pmStartTime;
      depart.pmEndTime =
        this.form.pmEndTime === "" ? "2359" : this.form.pmEndTime;
      depart.idx = this.form.idx;
      depart.pic = this.form.pic;
      console.log("Time:" + this.form.amStartTime + ";" + this.form.pmEndTime);
      console.log(depart);
      if (
        this.form.departmentCode !== null &&
        this.form.departmentCode !== "" &&
        this.form.departmentCode !== undefined
      ) {
        depart.departmentCode = this.form.departmentCode;
        modifyHospitalDepartment(depart)
          .then(data => {
            if (data.value != null && data.value !== "") {
              this.$message.info("修改成功！");
            } else {
              this.$message.warning("修改失败！");
            }
          })
          .finally(() => {
            this.loading = false;
            this.closeSelectedTag();
          });
      } else {
        addHospitalDepartment(depart)
          .then(data => {
            if (data.value != null && data.value !== "") {
              this.$message.info("添加成功！");
            } else {
              this.$message.warning("添加失败！");
            }
          })
          .finally(() => {
            this.loading = false;
            this.closeSelectedTag();
          });
      }
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
    handleChange(value) {
      console.log(value[value.length - 1]);
      this.form.parentCode = value;
    },
    amChange: function(value) {
      this.form.amStartTime = value[0];
      this.form.amEndTime = value[1];
    },
    pmChange: function(value) {
      this.form.pmStartTime = value[0];
      this.form.pmEndTime = value[1];
    },
    handleAvatarSuccess: function(response) {
      console.log("response", response);
      this.imageUrl = response.value[0].url;
      this.form.pic = response.value[0].docId;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
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
  if (parentCode === "0") {
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
