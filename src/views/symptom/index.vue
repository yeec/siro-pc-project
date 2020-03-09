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
        <el-form-item label="编码" prop="symptomCode">
          <el-input placeholder="编码" v-model="formInline.symptomCode">
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="symptomName">
          <el-input v-model="formInline.symptomName" placeholder="名称">
          </el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formInline.gender" placeholder="请选择">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询 </el-button>
          <el-button type="primary" @click="handleClear()">清空 </el-button>
          <el-button type="primary" @click="handleAdd()">新增症状 </el-button>
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
          prop="symptomCode"
          label="编码"
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="symptomName"
          label="名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gender === 1">男</span>
            <span v-if="scope.row.gender === 2">女</span>
            <span v-if="scope.row.gender === 3">通用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleModify(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
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

    <el-dialog title="症状信息" :visible.sync="replyFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item label="编码:" prop="symptomCode">
          <el-input
            v-model="form.symptomCode"
            :disabled="symptomCodeInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="symptomName">
          <el-input v-model="form.symptomName"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyInfo()">确 定</el-button>
        <el-button @click="replayConcel">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  symptomListPage,
  modifySymptomsInfo,
  addSymptomsInfo,
  deleteSymptomsInfo
} from "@/api/hospital";
import { defaultPageConfig } from "@/config/pagination";
export default {
  name: "index",
  data() {
    return {
      formInline: {
        symptomCode: "",
        symptomName: "",
        gender: ""
      },
      options: [],
      loading: false,
      currentPage4: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: 100,
      tableData: [],
      replyFormVisible: false,
      form: {
        id: "",
        symptomCode: "",
        symptomName: "",
        gender: ""
      },
      symptomCodeInput: false,
      genderOptions: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        },
        {
          value: 3,
          label: "通用"
        }
      ]
    };
  },
  created: function() {
    this.fetechData();
  },
  methods: {
    fetechData: function() {
      let symptomCode = this.formInline.symptomCode;
      let symptomName = this.formInline.symptomName;
      let gender = this.formInline.gender;
      this.loading = true;
      symptomListPage(
        this.currentPage4,
        this.pageSize,
        1,
        symptomName,
        symptomCode,
        gender
      )
        .then(data => {
          this.tableData = data.value.list;
          this.total = data.value.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleModify: function(index, row) {
      console.log(index, row.id);
      this.form.id = row.id;
      this.form.symptomCode = row.symptomCode;
      this.form.symptomName = row.symptomName;
      this.form.gender = Number(row.gender);
      this.replyFormVisible = true;
      this.symptomCodeInput = true;
    },
    handleClear: function() {
      this.$refs["formRef"].resetFields(this.formInline);
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange: function(val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetechData();
    },
    handlePrev: function() {
      //上一页
    },
    handleNext: function() {
      //下一页
    },
    modifyInfo: function() {
      if (this.form.symptomCode === null || this.form.symptomCode === "") {
        this.$message.info("填写编码");
        return;
      }
      debugger;
      if (
        this.form.id === null ||
        this.form.id === "" ||
        this.form.id === undefined
      ) {
        addSymptomsInfo(
          this.form.symptomCode,
          this.form.symptomName,
          "",
          this.form.gender
        )
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning("提交出错！请重新提交");
              return;
            }
            if (data.code === "200" && data.value !== "") {
              this.$message.info("添加成功");
              this.replyFormVisible = false;
              this.fetechData();
              this.$refs["form"].resetFields(this.form);
            }
          })
          .finally(() => {});
      } else {
        modifySymptomsInfo(
          this.form.symptomCode,
          this.form.symptomName,
          "",
          this.form.gender
        )
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning("提交出错！请重新提交");
              return;
            }
            if (data.code === "200" && data.value >= 0) {
              this.$message.info("修改成功");
              this.replyFormVisible = false;
              this.fetechData();
              this.$refs["form"].resetFields(this.form);
            }
          })
          .finally(() => {});
      }
    },
    replayConcel: function() {
      this.replyFormVisible = false;
      this.$refs["form"].resetFields(this.form);
    },
    handleSearch: function() {
      this.currentPage4 = 1;
      this.fetechData();
    },
    handleDelete: function(index, row) {
      console.log(index);
      this.$confirm("确认删除？")
        .then(() => {
          this.loading = true;
          deleteSymptomsInfo(row.symptomCode)
            .then(data => {
              if (data.code !== "200") {
                this.$message.warning("提交出错！请重新提交");
                return;
              }
              if (data.code === "200" && data.value > 0) {
                this.$message.info("删除成功");
                this.fetechData();
              }
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    handleAdd: function() {
      this.replyFormVisible = true;
      this.$refs["form"].resetFields(this.form);
    }
  }
};
</script>

<style scoped></style>
