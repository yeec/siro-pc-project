<template>
  <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
    <el-form-item label="资讯标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="资讯类型" prop="subType">
      <el-select v-model="form.subType" placeholder="请选择资讯类型">
        <el-option
          v-for="item in options"
          :key="item.metaCode"
          :label="item.metaName"
          :value="item.metaCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发布人" prop="author">
      <el-input v-model="form.author"></el-input>
    </el-form-item>
    <el-form-item label="资讯方式" prop="outerChain">
      <el-radio-group v-model="form.outerChain" @change="outerChainClick">
        <el-radio :label="1">URL链接</el-radio>
        <el-radio :label="0">本地文章</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="URL链接" v-if="ifURL" prop="url">
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item
      label="正文内容"
      v-if="ifContent"
      prop="content"
      style="height: 450px"
    >
      <j-editor
        :contentValue="form.content"
        v-on:changeContent="changeContent"
        :is-edit="this.isEdit"
      ></j-editor>
    </el-form-item>
    <!--<el-form-item label="是否显示" prop="showFlag" >-->
    <!--<el-radio-group v-model="form.showFlag">-->
    <!--<el-radio :label="1">显示</el-radio>-->
    <!--<el-radio :label="0">不显示</el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-form-item>-->
    <el-form-item label="消息推送" prop="wxPushFlag">
      <el-radio-group v-model="form.wxPushFlag">
        <!--<el-radio @click.native.prevent="clickitem(1)" :label="1">文本</el-radio>-->
        <el-radio @click.native.prevent="clickitem(2)" :label="2"
          >图文消息</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传图片" prop="messageImg" v-if="ifPushImg">
      <el-upload
        class="avatar-uploader"
        :action="SERVERURL"
        name="file"
        :headers="uploadHeader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="文本" prop="messageContet" v-if="ifPushContent">
      <el-input
        v-model="form.messageContent"
        type="textarea"
        :row="5"
        placeholder="推送文本"
      ></el-input>
    </el-form-item>
    <el-form-item label="文章编号" v-if="false" prop="articleCode">
      <el-input v-model="form.articleCode"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { findByGroupCode } from "@/api/meta";
import { addJicArticle, modifyJicArticle, findArticle } from "@/api/article";
import { getTokenType, getToken } from "@/utils/auth";
import { UPLOAD_URL, SERVERURL } from "@/config/index";
import JEditor from "@/components/quillEditor/editor";
export default {
  data: function() {
    return {
      ifURL: false,
      ifContent: true,
      options: [],
      loading: false,
      isEdit: false,
      form: {
        articleCode: "",
        title: "",
        outerChain: "",
        subType: "",
        content: "",
        showFlag: "",
        author: "",
        url: "",
        wxPushFlag: "",
        messageFlag: "",
        messageImg: "",
        messageContent: ""
      },
      ifPushImg: false,
      ifPushContent: false,
      imageUrl: "",
      SERVERURL: SERVERURL
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
  created: function() {
    this.getArticleType();
  },
  activated() {
    if (
      this.$route.params.articleCode !== null &&
      this.$route.params.articleCode !== "" &&
      this.$route.params.articleCode !== undefined
    ) {
      this.fetchData();
    } else {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields(this.form);
        this.ifPushContent = false;
        this.ifPushImg = false;
      }
    }
  },
  methods: {
    changeContent(content) {
      //富文本编辑器  文本改变时 设置字段值
      this.form.content = content;
    },
    fetchData: function() {
      this.loading = true;
      this.form.articleCode = this.$route.params.articleCode;
      if (this.form.articleCode !== null && this.form.articleCode !== "") {
        findArticle(this.form.articleCode)
          .then(data => {
            console.log(data.value.title);
            this.form.title = data.value.title;
            this.form.subType = data.value.subType;
            this.form.outerChain = data.value.outerChain;
            this.outerChainClick();
            this.form.showFlag = Number(data.value.showFlag);
            this.form.author = data.value.author;
            this.form.content = data.value.content;
            this.form.url = data.value.url;
            if (data.value.messageImg != null && data.value.messageImg !== "") {
              this.form.wxPushFlag = 2;
              this.ifPushImg = true;
              this.imageUrl = UPLOAD_URL + data.value.messageImg;
            } else if (
              data.value.messageContent != null &&
              data.value.messageContent !== ""
            ) {
              this.form.wxPushFlag = 1;
              this.ifPushContent = true;
              this.form.messageContent = data.value.messageContent;
            }
          })
          .finally(() => {});
      } else {
        if (this.$refs["form"] !== undefined) {
          this.$refs["form"].resetFields(this.form);
          this.ifPushContent = false;
          this.ifPushImg = false;
        }
      }
      this.loading = false;
    },
    getArticleType: function() {
      findByGroupCode("article_info_type")
        .then(data => {
          this.options = data.value;
        })
        .finally(() => {});
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
      this.form.content = html;
    },
    onSubmit: function() {
      console.log("提交信息" + this.form.articleCode);
      var articleInfo = {
        articleCode: "",
        title: "",
        subTitle: "",
        summary: "",
        articleType: "info",
        subType: "",
        outerChain: "",
        url: "",
        content: "",
        showFlag: "",
        author: "",
        messageFlag: "",
        messageImg: "",
        messageContent: ""
      };
      articleInfo.title = this.form.title;
      articleInfo.subType = this.form.subType;
      articleInfo.outerChain = this.form.outerChain;
      articleInfo.content = this.form.content;
      articleInfo.showFlag = this.form.showFlag;
      articleInfo.url = this.form.url;
      articleInfo.author = this.form.author;
      //if (this.form.wxPushFlag != null && this.form.wxPushFlag !== "") {
      articleInfo.messageFlag = 1;
      if (this.form.wxPushFlag === 2) {
        articleInfo.messageImg = this.form.messageImg;
      } else if (this.form.wxPushFlag === 1) {
        articleInfo.messageContent = this.form.messageContent;
      }
      //} else {
      //this.$message.info("请选择推送消息类型");
      //return;
      //}
      if (
        this.form.outerChain === 1 &&
        (this.form.url === null || this.form.url === "")
      ) {
        this.$message.info("外链地址不能为空！");
        return;
      }
      if (
        this.form.outerChain === 0 &&
        (this.form.content === null || this.form.content === "")
      ) {
        this.$message.info("文章内容不能为空！");
        return;
      }
      if (this.form.author === null || this.form.author === "") {
        this.$message.info("发布人不能为空！");
        return;
      }
      if (this.form.articleCode === "" || this.form.articleCode === null) {
        addJicArticle(articleInfo)
          .then(data => {
            if (data.value !== "" && data.value != null) {
              this.$message("添加成功");
              this.$refs["form"].resetFields(this.form);
              this.ifPushContent = false;
              this.ifPushImg = false;
              this.closeSelectedTag();
            } else {
              this.$message("添加失败");
            }
          })
          .finally(() => {});
      } else {
        articleInfo.articleCode = this.form.articleCode;
        modifyJicArticle(articleInfo)
          .then(data => {
            if (data.value > 0) {
              this.$message("修改成功");
              this.closeSelectedTag();
            } else {
              this.$message("修改失败");
            }
          })
          .finally(() => {});
      }
    },
    onCancel: function() {
      this.form.title = this.form.articleCode;
      this.closeSelectedTag();
    },
    outerChainClick: function() {
      if (this.form.outerChain === 1) {
        this.ifURL = true;
        this.ifContent = false;
      } else if (this.form.outerChain === 0) {
        this.ifURL = false;
        this.ifContent = true;
      }
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
    wxPushClick: function() {
      if (this.form.wxPushFlag === 1) {
        this.ifPushImg = false;
        this.ifPushContent = true;
      } else if (this.form.wxPushFlag === 2) {
        this.ifPushImg = true;
        this.ifPushContent = false;
      }
    },
    // 富文本图片上传前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess: function(response) {
      this.imageUrl = response.value[0].url;
      this.form.messageImg = response.value[0].docId;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    clickitem: function(e) {
      e === this.form.wxPushFlag
        ? (this.form.wxPushFlag = "")
        : (this.form.wxPushFlag = e);
      if (this.form.wxPushFlag === 1) {
        this.ifPushImg = false;
        this.ifPushContent = true;
      } else if (this.form.wxPushFlag === 2) {
        this.ifPushImg = true;
        this.ifPushContent = false;
      } else {
        this.ifPushImg = false;
        this.ifPushContent = false;
      }
    }
  }
};
</script>
