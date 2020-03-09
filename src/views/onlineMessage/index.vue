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
      
        <el-form-item label="客户姓名" prop="userName">
          <el-input placeholder="请输入客户姓名" v-model="formInline.userName"></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="userPhone">
          <el-input placeholder="请输入客户电话" v-model="formInline.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="问题时间" prop="valueDate">
          <el-date-picker
            v-model="formInline.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          ></el-date-picker>-
          <el-date-picker
            v-model="formInline.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleSearch()">搜索</el-button>
          <el-button icon="el-icon-delete" type="primary" @click="handleClear()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-card shadow="never" class="scrollable">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="userName" label="客户姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="message" label="问题描述" header-align="center" align="center"></el-table-column>
        <el-table-column prop="submit_time" label="问题提交时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'" style="margin-left: 10px">待解决</span>
            <span v-if="scope.row.status === '1'" style="margin-left: 10px">已解决</span>
            <span v-if="scope.row.status === '2'" style="margin-left: 10px">已忽略</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="openDialog(scope.row,'1')">处理</el-button>
            <el-button size="mini" type="text" @click="openDialog(scope.row,'2')">查看</el-button>
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
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="layout"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          align="center"
        ></el-pagination>
      </el-row>
    </el-footer>

    <!--处理-->
    <el-dialog :visible.sync="infoDialog" :title="this.dialogTitle" width="700px">
      <el-form
        :model="infoForm"
        ref="infoForm"
        label-width="100px"
        class="demo-form-inline"
        :rules="rules"
        size="small"
      >
        <el-row v-loading="loadingDalag">
          <el-form-item label="状态" style="width: 600px" prop="status">
            <el-select v-model="infoForm.status" placeholder="请选择">
              <el-option
                v-for="item in onlineStatus"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" style="width: 600px" prop="message">
            <el-input v-model="infoForm.message" readonly="readonly" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="处理结果" style="width: 600px" prop="reply">
            <el-input v-model="infoForm.reply" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-row>

        <el-form-item header-align="center" align="center">
          <el-button size="mini" type="primary" @click="handleOlmessageUpdate" v-if="closeDialogBack">处理</el-button>
          <el-button size="mini" @click="closeDialog" >返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { olmessageList, olmessageUpdate} from "@/api/onlineMessage";
import { defaultPageConfig } from "@/config/pagination";
export default {
  name: "onlineMessage",
  computed: {
    ...mapGetters(["username"]),
  },
  data() {
    return {
      formInline: {
        userName: "",
        userPhone: "",
        startDate: "",
        endDate: "",
      },
      currentPage: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: 100,
      loading: false,
      loadingDalag: false,
      tableData: [],
      infoDialog: false,
      dialogTitle: "",
      infoForm: {
        title: "",
        status: "",
        message: "",
        reply: "",
        id:""
      },
      handleShow: false,
      submitShow: false,
      closeDialogBack:true,
      onlineStatus: [
        {
          value: '0',
          label: "待解决"
        },
        {
          value: '1',
          label: "已解决"
        },
        {
          value: '2',
          label: "已忽略"
        }
      ],

      rules: {
        status: [{ required: true, message: "请输选择状态", trigger: "blur" }],
        message: [{ required: true, message: "请输入问题描述", trigger: "blur" }],
        reply: [{ required: true, message: "请输处理结果", trigger: "blur" }]
      }
    }
  },
  created: function () { },
  activated: function () {
    // 留言列表查询 
    this.handleSearch()
  },
  methods: {
    // 留言列表查询 
    handleSearch() {
      let self = this;
      this.loading = true;
      // 上送参数
      let params = {
        userName: this.formInline.userName,
        userPhone: this.formInline.userPhone,
        startDate: this.formInline.startDate,
        endDate: this.formInline.endDate,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      // 接口请求
      olmessageList(params).then(data => {
        if (data) {
          // 留言列表数据
          self.tableData = data.value.list;
          // 总条数
          self.total = data.value.total;
        } else {
          self.loading = false
        }
      }).finally(() => {
        self.loading = false
      });
    },


    // 重置
    handleClear() {
      this.$refs["formRef"].resetFields(this.formInline);
      this.formInline.userName = "";
      this.formInline.userPhone = "";
      this.formInline.startDate = "";
      this.formInline.endDate = "";
      this.currentPage = 1;
      this.pageSize = defaultPageConfig.pageSize;
      this.handleSearch()
    },
    handleSizeChange: function (val) {
      console.log(`每页 ${val} 条`);
      this.pageCount = (this.total + this.pageSize - 1) / this.pageSize;
    },
    handleCurrentChange: function (val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.handleSearch();
    },
    handlePrev: function () {
    },
    handleNext: function () {
    },

    // 打开处理子窗口
    openDialog(row, flag) {
      if (flag == "1") { // 处理
        this.infoDialog = true
        this.dialogTitle = "留言处理"
        this.infoForm.status = row.status;
        this.infoForm.message = row.message;
        this.infoForm.reply = row.replyMessage;
        this.infoForm.id = row.id;
        this.closeDialogBack = true;
      } else if (flag == "2") { // 查看
         this.infoDialog = true
        this.dialogTitle = "查看处理"
        this.infoForm.status = row.status;
        this.infoForm.message = row.message;
        this.infoForm.reply = row.replyMessage;
        this.infoForm.id = row.id;
        this.closeDialogBack = false;
      }
    },

    // 处理
    handleOlmessageUpdate: function () {
      this.$refs["infoForm"].validate(valid => {
        if (valid) {
          let self = this;
          self.loadingDalag = true
          let params = {
            status:  this.infoForm.status,
            tellerId: this.username,
            reply: this.infoForm.reply,
            id: this.infoForm.id
          }
          olmessageUpdate(params).then(data => {
            if (data) {
              self.$message({message: "问题处理完成",type: "success"});
              self.infoDialog = false;
              this.handleSearch()
            } else {
              self.loadingDalag = false
            }
          }).finally(() => {
            self.loadingDalag = false
          });
        }
      })
    },

    // 返回
    closeDialog() {
      this.infoDialog = false;
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
