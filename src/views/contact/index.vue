<template>
  <div>
    <el-container>
      <el-header>
        <el-form :inline="true" v-model="searchForm" class="demo-form-inline">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新增</el-button
          >
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
          <el-table-column prop="contactName" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="contactTel" label="联系方式" align="center">
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button>
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
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            prev-text="上一页"
            next-text="下一页"
            :total="total"
            align="center"
          >
          </el-pagination>
        </el-row>
      </el-footer>
    </el-container>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :rules="rules"
        size="small"
      >
        <el-form-item label="名称" prop="contactName">
          <el-input v-model="editForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactTel">
          <el-input v-model="editForm.contactTel"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="dataFormSubmit()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteContact, listPage, add, modify } from "@/api/contact";
import { defaultPageConfig } from "@/config/pagination";

export default {
  data() {
    return {
      title: "",
      loading: false,
      currentPage: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      total: null,
      tableData: [],
      searchForm: {},
      dialogFormVisible: false,
      editForm: {
        id: null,
        contactCode: "",
        contactName: "",
        contactTel: ""
      },
      rules: {
        contactName: [{ required: true, message: "请输名称", trigger: "blur" }],
        contactTel: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.loading = true;
      let pageNum = this.currentPage;
      let pageSize = this.pageSize;
      listPage(pageNum, pageSize)
        .then(data => {
          this.tableData = data.value.list;
          this.total = data.value.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleAdd() {
      this.title = "新增";
      this.dialogFormVisible = true;
      this.editForm.contactCode = "";
      this.editForm.contactName = "";
      this.editForm.contactTel = "";
    },
    handleEdit(index, row) {
      this.title = "修改";
      this.editForm = row;
      this.dialogFormVisible = true;
    },
    dataFormSubmit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let self = this;
          if (self.editForm.id) {
            //更新
            //新增表单提交
            modify(self.editForm).then(function(data) {
              if ("200" === data.code) {
                self.$message({
                  message: "更新成功！",
                  type: "success"
                });
                self.dialogFormVisible = false;
                self.getDataList();
              }
            });
          } else {
            //新增表单提交
            add(this.editForm).then(function(data) {
              if ("200" === data.code) {
                self.$message({
                  message: "新增成功！",
                  type: "success"
                });
                self.dialogFormVisible = false;
                self.getDataList();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    handleDelete(index, row) {
      let self = this;
      deleteContact(row.contactCode)
        .then(function() {
          self.$message({
            message: "删除成功！",
            type: "success"
          });
        })
        .finally(function() {
          self.getDataList();
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getDataList();
    },

    handleSearch() {
      this.getDataList();
    },
    handlePrev: function() {
      console.log(this.currentPage4 + ";" + this.pageSize);
    },
    handleNext: function() {
      //下一页
    }
  }
};
</script>
