<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        ref="formRef"
        :model="formInline"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item label="标题" prop="articleTitle">
          <el-input placeholder="请输入内容" v-model="formInline.articleTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="articleType">
          <el-select v-model="formInline.articleType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.metaCode"
              :label="item.metaName"
              :value="item.metaCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="valueDate">
          <el-date-picker
            v-model="formInline.beginDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          >
          </el-date-picker>
          -
          <el-date-picker
            v-model="formInline.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="handleSearch()"
            >查询
          </el-button>
          <el-button icon="el-icon-delete" type="primary" @click="handleClear()"
            >清空
          </el-button>
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd()"
            >新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-card shadow="never" class=" scrollable">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="subType"
          label="类型"
          header-align="center"
          align="center"
        >
          <!--<template slot-scope="scope" v-for="item in options">-->
          <!--<span v-if="scope.row.subType === item.metaCode" :key="item.metaCode" style="margin-left: 10px">{{item.metaName}}</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
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
        <el-table-column
          prop="flag"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.flag === 1" style="margin-left: 10px"
              >有效</span
            >
            <span v-else style="margin-left: 10px">无效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope" v-if="scope.row.flag === 1">
            <el-button
              size="mini"
              type="text"
              @click="handleRecall(scope.$index, scope.row)"
              v-if="scope.row.showFlag === 1"
              >撤回</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handlePublish(scope.$index, scope.row)"
              v-if="scope.row.showFlag === 0"
              >发布</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="scope.row.showFlag === 0"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              v-if="scope.row.showFlag === 0"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-footer>
      <el-row>
        <el-pagination
          class="footer"
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
  </div>
</template>

<script>
import { deleteLogicJicArticle, listPage, updateShowFlag } from "@/api/article";
import { findByGroupCode } from "@/api/meta";
import { defaultPageConfig } from "@/config/pagination";
export default {
  name: "Notice",
  data() {
    return {
      formInline: {
        articleTitle: "",
        valueDate: "",
        articleType: "",
        beginDate: "",
        endDate: ""
      },
      loading: false,
      currentPage4: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: 100,
      options: [],
      optionsJson: {},
      tableData: []
    };
  },
  created: function() {},
  activated: function() {
    this.currentPage4 = 1;
    const articleTypePro = new Promise(function(resolve, reject) {
      findByGroupCode("article_notice_type")
        .then(data => {
          if (data.code === "200") {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .finally(() => {});
    });
    var pageNum = this.currentPage4;
    var pageSize = this.pageSize;
    var title = this.formInline.articleTitle;
    var scope = 1;
    var articleType = "notice";
    var subType = this.formInline.articleType;
    var beginDate = "";
    if (this.formInline.beginDate) {
      beginDate = this.formInline.beginDate + " 00:00:00";
    }
    var endDate = "";
    if (this.formInline.endDate) {
      endDate = this.formInline.endDate + " 23:59:59";
    }
    var author = "";
    const dataPromise = new Promise((resolve, reject) => {
      listPage(
        pageNum,
        pageSize,
        title,
        scope,
        articleType,
        subType,
        author,
        beginDate,
        endDate,
        1
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
    Promise.all([articleTypePro, dataPromise]).then(([typeData, tableData]) => {
      this.options = typeData.value;
      this.options.forEach(value => {
        this.optionsJson[value.metaCode] = value.metaName;
      });
      this.tableData = tableData.value.list;
      this.total = tableData.value.total;
      this.tableData.forEach(value => {
        value.subType = this.optionsJson[value.subType];
      });
    });
    this.loading = false;
  },
  methods: {
    listPage: function() {
      console.log("进入查询");
      this.loading = true;
      var pageNum = this.currentPage4;
      var pageSize = this.pageSize;
      var title = this.formInline.articleTitle;
      var scope = 1;
      var articleType = "notice";
      var subType = this.formInline.articleType;
      var beginDate = "";
      if (this.formInline.beginDate) {
        beginDate = this.formInline.beginDate + " 00:00:00";
      }
      var endDate = "";
      if (this.formInline.endDate) {
        endDate = this.formInline.endDate + " 23:59:59";
      }
      var author = "";
      listPage(
        pageNum,
        pageSize,
        title,
        scope,
        articleType,
        subType,
        author,
        beginDate,
        endDate,
        1
      )
        .then(data => {
          this.tableData = data.value.list;
          this.total = data.value.total;
          this.tableData.forEach(value => {
            value.subType = this.optionsJson[value.subType];
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit: function(index, row) {
      console.log(index, row.articleCode);
      this.$router.push({
        name: "editNotice",
        params: { articleCode: row.articleCode }
      });
    },
    handleDelete: function(index, row) {
      console.log(index, row);
      this.$confirm("确认删除？")
        .then(() => {
          this.loading = true;
          deleteLogicJicArticle(row.articleCode)
            .then(data => {
              if (data.value > 0) {
                this.$message({
                  message: "删除成功消息",
                  type: "success"
                });
                listPage();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败"
                });
              }
            })
            .finally(() => {
              this.listPage();
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    handleAdd: function() {
      console.log("新增消息");
      this.$router.push({
        name: "addNotice",
        params: { articleCode: null }
      });
    },
    handleSearch: function() {
      console.log("查询消息。。。");
      this.currentPage4 = 1;
      this.listPage();
    },
    handleClear: function() {
      this.$refs["formRef"].resetFields(this.formInline);
      this.formInline.valueDate = "";
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
      this.pageCount = (this.total + this.pageSize - 1) / this.pageSize;
    },
    handleCurrentChange: function(val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.listPage();
    },
    handlePrev: function() {
      //上一页
      console.log(this.currentPage4 + ";" + this.pageSize);
    },
    handleNext: function() {
      //下一页
    },
    getArticleType: function() {
      findByGroupCode("article_notice_type")
        .then(data => {
          this.options = data.value;
        })
        .finally(() => {});
    },
    handleRecall: function(index, row) {
      //撤回
      console.log(index, row.articleCode);
      updateShowFlag(row.articleCode, 0, 1)
        .then(data => {
          if (data.value > 0) {
            this.$message.info("撤回成功");
            this.listPage();
          } else {
            this.$message.info("撤回失败");
          }
        })
        .finally(() => {});
    },
    handlePublish: function(index, row) {
      //
      console.log(index, row.articleCode);
      updateShowFlag(row.articleCode, 1, 2)
        .then(data => {
          if (data.value > 0) {
            this.$message.info("发布成功");
            this.listPage();
          } else {
            this.$message.info("发布失败");
          }
        })
        .finally(() => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.card-fix-height {
  position: relative;
  height: calc(100vh - 84px - 15px - 15px - 51px - 51px);
}

.search-item {
  width: 150px;
}
</style>
