<template>
  <el-container>
    <el-header>
      <el-form
        :inline="true"
        ref="formRef"
        :model="formInline"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item label="微信用户" prop="uid">
          <el-input placeholder="微信昵称" v-model="formInline.uid"> </el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="questionType">
          <el-select v-model="formInline.questionType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.metaCode"
              :label="item.metaName"
              :value="item.metaCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formInline.phone" placeholder="填写手机号">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询 </el-button>
          <el-button type="primary" @click="handleClear()">清空 </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="微信用户"
          width="180"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="questionType"
          label="问题类型"
          width="100"
          header-align="center"
          align="center"
        >
          <!--<template slot-scope="scope" v-for="item in options">-->
          <!--<span v-if="scope.row.questionType === item.metaCode" :key="item.metaCode" style="margin-left: 10px">{{ item.metaName }}</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          width="110"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="createdBy"-->
        <!--label="创建人"-->
        <!--header-align="center" align="center">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="question"
          label="问题描述"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建日期"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === null"
              size="mini"
              @click="handleReply(scope.$index, scope.row)"
              >回复</el-button
            >
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              @click="handleReply(scope.$index, scope.row)"
              >已回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePrev"
          @next-click="handleNext"
          :current-page="currentPage4"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="layout"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          align="center"
        >
        </el-pagination>
      </el-row>
    </el-footer>

    <el-dialog title="就医反馈" :visible.sync="replyFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item label="微信用户:">
          <span>{{ selectedRow.uid }}</span>
        </el-form-item>
        <el-form-item label="电话:">
          <span>{{ selectedRow.phone }}</span>
        </el-form-item>
        <el-form-item label="问题类型:">
          <span>{{ selectedRow.questionType }}</span>
          <!--<template slot-scope="scope" v-for="item in options">-->
          <!--<span v-if="selectedRow.questionType === item.metaCode" :key="item.metaCode" style="margin-left: 10px">{{item.metaName}}</span>-->
          <!--</template>-->
        </el-form-item>
        <el-form-item label="反馈内容:">
          <span>{{ selectedRow.question }}</span>
        </el-form-item>
        <el-form-item label="回复内容:" :prop="reply">
          <el-input
            v-if="selectedRow.reply == null || selectedRow.reply === ''"
            v-model="form.reply"
            type="textarea"
            :row="5"
          ></el-input>
          <span v-if="selectedRow.reply !== null && selectedRow.reply !== ''">{{
            selectedRow.reply
          }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="selectedRow.reply == null || selectedRow.reply === ''"
          type="primary"
          @click="replay(selectedRow.id)"
          >确 定</el-button
        >
        <el-button @click="replayConcel">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { findByGroupCode } from "@/api/meta";
import { findPagesList, replayUserFeedback } from "@/api/article";
import { defaultPageConfig } from "@/config/pagination";
export default {
  name: "index",
  data() {
    return {
      formInline: {
        uid: "",
        questionType: "",
        phone: ""
      },
      options: [],
      optionsJson: {},
      loading: false,
      currentPage4: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: 100,
      tableData: [],
      replyFormVisible: false,
      selectedRow: {
        id: "",
        uid: "",
        questionType: "",
        phone: "",
        reply: ""
      },
      form: {
        reply: ""
      }
    };
  },
  created: function() {
    const typeGet = new Promise(function(resolve, reject) {
      findByGroupCode("question_type")
        .then(data => {
          if (data.code === "200") {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .finally(() => {});
    });
    const dataGet = new Promise((resolve, reject) => {
      findPagesList(
        this.currentPage4,
        this.pageSize,
        1,
        null,
        null,
        null,
        null,
        null
      )
        .then(data => {
          if (data.code === "200") {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .finally(() => {});
    });
    this.loading = true;
    Promise.all([typeGet, dataGet]).then(([typeData, tableData]) => {
      this.options = typeData.value;
      typeData.value.forEach(value => {
        this.optionsJson[value.metaCode] = value.metaName;
      });
      this.tableData = tableData.value.list;
      this.tableData.forEach(value => {
        value.questionType = this.optionsJson[value.questionType];
      });
      this.total = tableData.value.total;
    });
    this.loading = false;
  },
  methods: {
    getQuestionType: function() {
      findByGroupCode("question_type")
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning("查询错误");
            return;
          }
          this.options = data.value;
          this.fetechData();
        })
        .finally(() => {});
    },
    fetechData: function() {
      let pageNum = this.currentPage4;
      let pageSize = this.pageSize;
      let flag = 1;
      let nickName = this.formInline.uid;
      let questionType = this.formInline.questionType;
      let question = null;
      let phone = this.formInline.phone;
      this.loading = true;
      findPagesList(
        pageNum,
        pageSize,
        flag,
        null,
        nickName,
        questionType,
        question,
        phone
      )
        .then(data => {
          this.tableData = data.value.list;
          this.total = data.value.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleReply: function(index, row) {
      console.log(index, row.id);
      this.selectedRow = row;
      this.replyFormVisible = true;
    },
    handleClear: function() {
      this.$refs["formRef"].resetFields(this.formInline);
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
      this.pageCount = (this.total + this.pageSize - 1) / this.pageSize;
    },
    handleCurrentChange: function(val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetechData();
    },
    handlePrev: function() {
      //上一页
      console.log(this.currentPage4 + ";" + this.pageSize);
    },
    handleNext: function() {
      //下一页
    },
    replay: function(id) {
      if (this.form.reply === null || this.form.reply === "") {
        this.$message.info("填写回复内容");
        return;
      }
      replayUserFeedback(id, this.form.reply)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning("提交出错！请重新提交");
            return;
          }
          if (data.code === "200" && data.value >= 0) {
            this.$message.info("回复成功");
            this.replyFormVisible = false;
            this.fetechData();
            this.$refs["form"].resetFields(this.form);
          }
        })
        .finally(() => {});
    },
    replayConcel: function() {
      this.replyFormVisible = false;
      this.$refs["form"].resetFields(this.form);
    },
    handleSearch: function() {
      this.currentPage4 = 1;
      this.fetechData();
    }
  }
};
</script>

<style scoped></style>
