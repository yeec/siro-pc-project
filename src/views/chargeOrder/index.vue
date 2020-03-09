<template>
  <div>
    <el-row class="chargeOrder-par">
      <el-form
        :model="searchForm"
        :inline="true"
        class="demo-form-inline"
        size="small"
        label-width="100px"
      >
        <el-form-item label="卡号：">
          <el-input
            v-model="searchForm.cardNumber"
            type="text"
            placeholder="水卡卡号"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费时间：">
          <el-date-picker
            v-model="searchForm.payTimeBegin"
            formate="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
          到
          <el-date-picker
            v-model="searchForm.payTimeEnd"
            formate="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缴费状态：">
          <el-select v-model="searchForm.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatus"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否处理：">
          <el-select v-model="searchForm.handleStatus" placeholder="请选择">
            <el-option
              v-for="item in handleStatus"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch"
            >查询
          </el-button>
          <el-button type="primary" @click="reSet" icon="el-icon-delete"
            >清空</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-card shadow="never" class=" scrollable">
      <el-table v-loading="loading" :data="orderList" border width="100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cardNumber"
          label="卡号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="payTime"
          label="缴费时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="amount" label="缴费金额" align="right">
          <template scope="scope">
            {{ scope.row.amount | yuanToCent }}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          align="center"
        ></el-table-column>
        <el-table-column prop="payStatus" label="缴费状态" align="center">
          <template scope="scope">
            <div v-if="scope.row.payStatus === 0">未缴费</div>
            <div v-else-if="scope.row.payStatus === 1">缴费中</div>
            <div v-else-if="scope.row.payStatus === 2">已缴费</div>
            <div
              v-else-if="
                scope.row.payStatus === 8 ||
                  scope.row.payStatus === 9 ||
                  scope.row.payStatus === 603
              "
            >
              支付失败
            </div>
            <div
              v-else-if="
                scope.row.payStatus === 7 || scope.row.payStatus === 601
              "
            >
              未支付
            </div>
            <div v-else-if="scope.row.payStatus === 602">已关闭</div>
            <div v-else>缴费失败</div>
          </template>
        </el-table-column>
        <el-table-column prop="esLinkStatus" label="易联云缴费状态" align="center" width="200">
          <template scope="scope">
            <div v-if="scope.row.esLinkStatus == 90">成功</div>
            <div v-else-if="scope.row.esLinkStatus == 91">失败</div>
            <div v-else-if="scope.row.esLinkStatus == 92">等待微信通知成功</div>
            <div v-else-if="scope.row.esLinkStatus == 93">微信通知支付失败</div>
            <div v-else-if="scope.row.esLinkStatus == 50">处理中</div>
            <div v-else-if="scope.row.esLinkStatus == 51">待查证</div>
            <div v-else>其他</div>
          </template>
        </el-table-column>
        <el-table-column prop="handleStatus" label="是否处理" align="center">
          <template scope="scope">
            <div v-if="scope.row.handleStatus === 0">未处理</div>
            <div v-if="scope.row.handleStatus === 1">已处理</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="handleTime"
          label="处理时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="处理人"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-model="handleButton"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleClick(scope.row)"
              v-if="scope.row.handleStatus === 0"
              >处理
            </el-button>
            <el-button
              v-model="viewButton"
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="viewClick(scope.row)"
              v-if="scope.row.handleStatus === 1"
              >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-footer>
      <el-row>
        <el-pagination
          background
          class="footer"
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
        >
        </el-pagination>
      </el-row>
    </el-footer>

    <el-dialog
      :visible.sync="infoDialog"
      :title="this.dialogTitle"
      width="700px"
    >
      <el-form
        v-model="infoForm"
        ref="editForm"
        label-width="100px"
        class="demo-form-inline"
        size="small"
      >
        <el-row>
          <el-form-item
            label="标题："
            style="display: inline-block;width: 300px"
          >
            <el-input v-model="infoForm.title" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item
            label="订单编号："
            style="display: inline-block;width: 300px"
          >
            <el-input
              v-model="infoForm.orderOpenCode"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="卡号："
            style="display: inline-block;width: 300px"
          >
            <el-input
              v-model="infoForm.cardNumber"
              readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="缴费时间："
            style="display: inline-block;width: 300px"
          >
            <el-date-picker
              v-model="infoForm.payTime"
              type="date"
              style="width: 200px"
              readonly="readonly"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="缴费金额："
            style="display: inline-block;width: 300px"
          >
            <el-input v-model="infoForm.amount" readonly="readonly"> </el-input>
          </el-form-item>
          <el-form-item
            label="电话："
            style="display: inline-block;width: 300px"
          >
            <el-input v-model="infoForm.phone" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item
            label="处理时间："
            v-show="handleShow"
            style="display: inline-block;width: 300px"
          >
            <el-date-picker
              v-model="infoForm.handleTime"
              type="date"
              style="width: 200px"
              readonly="readonly"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="处理人："
            v-show="handleShow"
            style="display: inline-block;width: 300px"
          >
            <el-input v-model="infoForm.operator" readonly></el-input>
          </el-form-item>
          <el-form-item label="备注" style="width: 600px">
            <el-input
              v-model="infoForm.remark"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="handle"
            v-show="submitShow"
            >处理</el-button
          >
          <el-button size="mini" @click="closeDialog">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//import { apiConfig } from "@/config/api";
import { defaultPageConfig } from "@/config/pagination";
import { selectByCondition, handle } from "@/api/chargeOrder";

export default {
  data() {
    return {
      searchForm: {
        cardNumber: "",
        payTimeBegin: "",
        payTimeEnd: "",
        payStatus: "",
        handleStatus: ""
      },
      payStatus: [
        {
          value: 1,
          label: "缴费中"
        },
        {
          value: 2,
          label: "已缴费"
        },
        {
          value: 3,
          label: "未支付"
        },
        {
          value: 4,
          label: "缴费失败"
        }
      ],
      handleStatus: [
        {
          value: 0,
          label: "未处理"
        },
        {
          value: 1,
          label: "已处理"
        }
      ],
      loading: false,
      handleButton: false,
      viewButton: false,
      handleShow: false,
      submitShow: false,
      currentPage: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: null,
      infoDialog: false,
      dialogTitle: "",
      infoForm: {
        title: "",
        orderCode: "",
        orderOpenCode: "",
        cardNumber: "",
        payTime: "",
        amount: "",
        phone: "",
        handleTime: "",
        operator: "",
        remark: ""
      },
      orderList: []
    };
  },
  computed: {},
  activated: function() {
    this.reSet();
    this.searchForm.payStatus = 2;
    this.currentPage = 1;
    this.search();
  },
  created: function() {},
  filters: {
    yuanToCent(value) {
      let returnStr = value / 100 + "";
      let len = returnStr.split(".")[1];
      if (len) {
        len = len.length;
      } else {
        len = 0;
      }
      returnStr += [".00", "0", ""][len];
      return returnStr;
    }
  },
  methods: {
    handleClick: function(row) {
      if (row.handleStatus == 0) {
        this.openDialog(row);
      } else {
        this.$message({
          message: "此缴费已被处理过",
          type: "warning"
        });
      }
    },
    viewClick: function(row) {
      if (row.handleStatus == 1) {
        this.openDialog(row);
      } else {
        this.$message({
          message: "此缴费还未被处理",
          type: "warning"
        });
      }
    },
    openDialog: function(row) {
      if (row.handleStatus == 0) {
        //未处理
        this.handleShow = false;
        this.submitShow = true;
        this.dialogTitle = "处理";
        this.infoForm.title = row.title;
        this.infoForm.orderOpenCode = row.orderOpenCode;
        this.infoForm.cardNumber = row.cardNumber;
        this.infoForm.payTime = row.payTime;
        this.infoForm.amount = this.centToYuan(row.amount);
        this.infoForm.remark = row.remark;
        this.infoForm.phone = row.phone;
        this.infoForm.orderCode = row.orderCode;
      } else {
        //已处理
        this.handleShow = true;
        this.submitShow = false;
        this.dialogTitle = "查看";
        this.infoForm.title = row.title;
        this.infoForm.orderOpenCode = row.orderOpenCode;
        this.infoForm.cardNumber = row.cardNumber;
        this.infoForm.payTime = row.payTime;
        this.infoForm.amount = this.centToYuan(row.amount);
        this.infoForm.remark = row.remark;
        this.infoForm.phone = row.phone;
        this.infoForm.handleTime = row.handleTime;
        this.infoForm.operator = row.operator;
        this.infoForm.orderCode = row.orderCode;
      }
      this.infoDialog = true;
    },
    closeDialog: function() {
      this.infoDialog = false;
    },
    clickSearch: function() {
      this.currentPage = 1;
      this.search();
    },
    search: function() {
      let searchCondition = this.searchForm;
      let pageNum = this.currentPage;
      let pageSize = this.pageSize;
      selectByCondition(searchCondition, pageNum, pageSize).then(data => {
        // data.value.list.forEach((item)=>{
        //   item.amount = (item.amount/100).toFixed(2);
        // })
        this.orderList = data.value.list;
        this.total = data.value.total;
      });
    },
    handle: function() {
      let self = this;
      handle(this.infoForm).then(function(data) {
        if ("200" == data.code) {
          self.$message({
            message: "处理成功",
            type: "success"
          });
          self.closeDialog();
          self.search();
        }
      });
    },
    reSet: function() {
      this.searchForm.cardNumber = "";
      this.searchForm.payTimeBegin = "";
      this.searchForm.payTimeEnd = "";
      this.searchForm.payStatus = "";
      this.searchForm.handleStatus = "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.search();
    },
    handleSearch() {
      this.currentPage = 1;
      this.search();
    },
    handlePrev: function() {
      console.log(this.currentPage + ";" + this.pageSize);
    },
    handleNext: function() {
      //下一页
    },
    centToYuan(value) {
      let returnStr = value / 100 + "";
      let len = returnStr.split(".")[1];
      if (len) {
        len = len.length;
      } else {
        len = 0;
      }
      returnStr += [".00", "0", ""][len];
      return returnStr;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-fix-height {
  position: relative;
  height: calc(100vh - 84px - 15px - 15px - 51px - 51px);
}

.config-input-width {
  width: 150px;
}

.form-item {
  width: 300px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-input__inner {
  width: 180px;
}
</style>
<style lang="scss">
.chargeOrder-par {
  .el-input__inner {
    width: 180px;
  }
}
</style>
