<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="医院名称" prop="hospitalName">
      <el-input v-model="form.hospitalName"></el-input>
    </el-form-item>
    <el-form-item label="医院地址" prop="location">
      <el-input v-model="form.location"></el-input>
    </el-form-item>
    <el-form-item label="简介" prop="hospitalDesc">
      <el-input
        type="textarea"
        :rows="5"
        v-model="form.hospitalDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="介绍" prop="hospitalIntro" style="height: 450px">
      <!-- use with components - bidirectional data binding（双向数据绑定） -->
      <el-row v-loading="uillUpdateImg">
        <quill-editor
          ref="myTextEditor"
          v-model="form.hospitalIntro"
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
import { modifyHospitalInfo, infoHospitalInfo } from "@/api/hospital";
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
  name: "addHospital",
  data() {
    return {
      uploadUrl: BASE_URI + "/document/upload",
      form: {
        hospitalName: "",
        hospitalDesc: "",
        location: "",
        hospitalIntro: "",
        hospitalCode: ""
      },
      loading: false,
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
  created: function() {},
  activated() {
    if (
      this.$route.params.code !== null &&
      this.$route.params.code !== "" &&
      this.$route.params.code != undefined
    ) {
      this.fetchData();
    } else {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields(this.form);
      }
    }
  },
  methods: {
    fetchData: function() {
      this.loading = true;
      this.form.hospitalCode = this.$route.params.code;
      if (this.form.hospitalCode !== null && this.form.hospitalCode !== "") {
        infoHospitalInfo(this.form.hospitalCode)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            }
            this.form.hospitalName = data.value.hospitalName;
            this.form.location = data.value.location;
            this.form.hospitalDesc = data.value.hospitalDesc;
            this.form.hospitalIntro = data.value.hospitalIntro;
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
      this.form.hospitalIntro = html;
    },
    onSubmit: function() {
      this.loading = true;
      modifyHospitalInfo(
        this.form.hospitalCode,
        this.form.hospitalName,
        this.form.hospitalDesc,
        this.form.hospitalIntro,
        this.form.location
      )
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
</script>
<style>
.quill-editor {
  height: 400px;
}
</style>
