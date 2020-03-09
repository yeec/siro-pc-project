<template>
  <div>
    <el-row>
      <el-form class="demo-form-inline" :model="searchForm" :inline="true" size="small">
        <el-form-item label="卡号：">
          <el-input v-model="searchForm.cardNumber" placeholder="水卡卡号"></el-input>
        </el-form-item>
        <el-form-item label="持卡人电话：">
          <el-input v-model="searchForm.phone" placeholder="绑定手机号"></el-input>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-input v-model="searchForm.dutyUserName" placeholder="负责人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch">查询</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="reSet">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="openDialog">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-card shadow="never" class="scrollable">
      <el-table v-loading="loading" :data="waterCardList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="cardNumber" label="卡号" align="center" width="180"></el-table-column>
        <el-table-column prop="ownerName" label="微信昵称" align="center" width="180"></el-table-column>
        <el-table-column prop="phone" label="持卡人电话" align="center" width="180"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" align="center" width="180"></el-table-column>
        <el-table-column prop="dutyUserName" label="负责人" align="center" width="180"></el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openDialog(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteCard(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="unbindCar(scope.row)"
            >解绑</el-button>
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
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          align="center"
        ></el-pagination>
      </el-row>
    </el-footer>

    <el-dialog :visible.sync="infoDialog" :title="this.dialogTitle" width="35%">
      <el-form
        :model="infoForm"
        class="demo-form-inline"
        ref="editForm"
        size="small"
        label-width="100px"
        :rules="rules"
      >
        <el-row>
          <el-form-item label="卡号：" prop="cardNumber">
            <el-input v-model="infoForm.cardNumber" placeholder="水卡卡号"></el-input>
          </el-form-item>
          <el-form-item label="持卡人电话：">
            <el-input v-model="infoForm.phone" placeholder="绑定手机号"></el-input>
          </el-form-item>
          <el-form-item label="负责人：">
            <el-select v-model="infoForm.dutyUserCode" placeholder="请选择">
              <el-option
                v-for="item in dutyUserList"
                :key="item.uid"
                :value="item.uid"
                :label="item.userName"
                data="item.phone"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-form-item>
          <el-button size="mini" type="primary" @click="addOrUpdate">保存</el-button>
          <el-button size="mini" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { defaultPageConfig } from "@/config/pagination";
import {
  addCard,
  deleteCard,
  updateCard,
  selectByCondition,
  selectDutyUser,
  selectCard,
  unbind
} from "@/api/waterCard";

export default {
  data() {
    return {
      searchForm: {
        cardNumber: "",
        phone: "",
        dutyUserName: ""
      },
      waterCardList: [],
      loading: false,
      idEdit: false,
      isReadOnly: false,
      currentPage: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      total: null,
      infoDialog: false,
      dialogTitle: "",
      infoForm: {
        cardNumber: "",
        phone: "",
        dutyUserCode: []
      },
      dutyUserList: [],
      rules: {
        cardNumber: [{ required: true, message: "请输入卡号", trigger: "blur" }]
      },
      addFlag: false
    };
  },
  computed: {},
  activated: function () {
    this.reSet();
    this.currentPage = 1;
    this.search();
  },
  created: function () { },
  methods: {
    openDialog: function (row) {
      this.selectDutyUser();
      if (row.cardCode) {
        //修改
        this.idEdit = true;
        this.dialogTitle = "修改水卡";
        this.infoForm.cardCode = row.cardCode;
        this.infoForm.cardNumber = row.cardNumber;
        this.infoForm.phone = row.phone;
        this.infoForm.dutyUserCode = row.dutyUserCode;
      } else {
        //添加
        this.idEdit = false;
        this.dialogTitle = "添加水卡";
        this.infoForm.cardNumber = "";
        this.infoForm.phone = "";
        this.infoForm.dutyUserCode = "";
      }
      this.infoDialog = true;
    },
    closeDialog: function () {
      this.infoDialog = false;
    },
    clickSearch: function () {
      this.currentPage = 1;
      this.search();
    },
    reSet: function () {
      this.searchForm.cardNumber = "";
      this.searchForm.dutyUserName = "";
      this.searchForm.phone = "";
    },
    search: function () {
      let searchCondition = this.searchForm;
      let pageNum = this.currentPage;
      let pageSize = this.pageSize;
      selectByCondition(searchCondition, pageNum, pageSize).then(data => {
        this.waterCardList = data.value.list;
        this.total = data.value.total;
      });
    },
    addOrUpdate: function () {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let self = this;
          if (this.idEdit) {
            updateCard(this.infoForm).then(function (data) {
              if ("200" == data.code) {
                self.$message({
                  message: "修改成功",
                  type: "success"
                });
                self.closeDialog();
                self.search();
              }
            });
          } else {
            selectCard("", this.infoForm.cardNumber).then(data => {
              if (data.value.length > 0) {
                self.$message({
                  message: "此卡号已存在",
                  type: "warning"
                });
              } else {
                addCard(this.infoForm).then(function (data) {
                  if ("200" == data.code) {
                    self.$message({
                      message: "添加成功",
                      type: "success"
                    });
                    self.closeDialog();
                    self.search();
                  }
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    deleteCard: function (row) {
      let cardCode = row.cardCode;
      let self = this;
      selectCard(cardCode, "").then(data => {
        if (data.value[0].uid) {
          self.$message({
            message: "此卡已绑定用户",
            type: "warning"
          });
        } else {
          deleteCard(cardCode).then(function (data) {
            if ("200" == data.code) {
              self.$message({
                message: "删除成功",
                type: "success"
              });
              self.search();
            }
          });
        }
      });
    },
    // 解除绑定
    unbindCar: function (row) {
      let uid = row.uid;
      let cardCode = row.cardCode;
      let self = this;
      unbind(uid, cardCode).then(data => {
        if ("200" == data.code) {
          self.$message({
            message: "用户解绑成功",
            type: "success"
          });
          self.search();
        }
      });
    },
    selectDutyUser: function () {
      selectDutyUser().then(data => {
        this.dutyUserList = data.value;
      });
    },
    changeDutyUser: function () {
      this.dutyUserList.forEach(value => {
        if (value.uid == this.infoForm.dutyUserCode) {
          this.infoForm.phone = value.phone;
        }
      });
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
      this.search();
    },
    handlePrev: function () {
      console.log(this.currentPage4 + ";" + this.pageSize);
    },
    handleNext: function () {
      //下一页
    }
  }
};
</script>

<style>
.card-fix-height {
  position: relative;
  height: calc(100vh - 84px - 15px - 15px - 51px - 51px);
}

.form-item {
  width: 300px;
}
</style>
