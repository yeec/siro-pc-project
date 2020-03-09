<template>
  <div id="JEditor">
    <quill-editor
      ref="myTextEditor"
      v-model="content"
      :options="editorOption"
      :disabled="isEdit"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <!-- 图片上传组件辅助-->
    <el-upload
      class="avatar-uploader quill-upload"
      :action="serverUrl"
      name="file"
      :headers="uploadHeader"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    >
    </el-upload>
  </div>
</template>

<script>
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
import { getTokenType, getToken } from "@/utils/auth";
import { SERVERURL } from "@/config/index";
export default {
  name: "JEditor",
  props: {
    contentValue: {
      type: String,
      required: false
    },
    isEdit: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    contentValue: function(value) {
      console.log("1111111111111111" + value);
      this.content = value;
    }
  },
  mounted: function() {
    console.log("00000000000000000" + this.contentValue);
    this.content = this.contentValue;
  },
  data() {
    return {
      name: "quillEditor",
      content: "",
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: SERVERURL, // 这里写你要上传的图片服务器地址
      header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
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
    }; // 富文本编辑器配置
  },
  computed: {
    uploadHeader: function() {
      return {
        Authorization: getTokenType() + " " + getToken()
      };
    }
  },
  created: function() {},
  methods: {
    // onInput:function(val) {
    //   this.$emit("input",val);
    // },
    // 富文本图片上传前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    uploadSuccess(res) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
      // 如果上传成功
      if (res.code === "200" && res.value !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.value[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    onEditorReady: function() {},
    onEditorChange: function({ html }) {
      //console.log("editor change!",  html, text);
      this.content = html;
      this.$emit("changeContent", html);
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
