<template>
  <el-container>
    <el-main style="margin-top: 0">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-row>
              <el-form
                :inline="true"
                ref="formRef"
                :model="formInline"
                class="demo-form-inline"
                size="small"
              >
                <el-form-item label="编码" prop="diseaseCode">
                  <el-input
                    placeholder="编码"
                    v-model="formInline.diseaseCode"
                    style="width: 110px"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="名称" prop="diseaseName">
                  <el-input
                    v-model="formInline.diseaseName"
                    placeholder="名称"
                    style="width: 110px"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch()"
                    >查询
                  </el-button>
                  <el-button type="primary" @click="handleAdd()"
                    >新增疾病
                  </el-button>
                  <el-button type="primary" @click="handleClear()"
                    >清空
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-table
              ref="tableDistases"
              v-loading="loading"
              :data="tableData"
              border
              style="width: 100%"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="diseaseCode"
                label="编码"
                width="80"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="diseaseName"
                label="名称"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleModify(scope.$index, scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    size="mini"
                    @click="handledelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    @click="handleRelated(scope.$index, scope.row)"
                    >关联项</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-pagination
                background
                @size-change="handleSizeChangeD"
                @current-change="handleCurrentChangeD"
                @prev-click="handlePrevD"
                @next-click="handleNextD"
                :current-page="currentPageD"
                :page-sizes="pageSizesD"
                :page-size="pageSizeD"
                :layout="layout"
                prev-text="上一页"
                next-text="下一页"
                :total="totalD"
                align="center"
              >
              </el-pagination>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-row>
              <el-form
                :inline="true"
                ref="formSymptom"
                :model="formSymptom"
                class="demo-form-inline"
                size="small"
              >
                <el-form-item label="症状" prop="symptomName">
                  <el-input
                    v-model="formSymptom.symptomName"
                    placeholder="症状"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchSymptom()"
                    >查询症状
                  </el-button>
                  <el-button type="primary" @click="updateRelated()"
                    >修改关联
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-table
                v-loading="loadingSymptom"
                :data="tableDataSymptom"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="symptomCode"
                  label="编码"
                  header-align="center"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="symptomName"
                  label="症状"
                  header-align="center"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="gender"
                  label="性别"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.gender === 1">男</span>
                    <span v-if="scope.row.gender === 2">女</span>
                    <span v-if="scope.row.gender === 3">通用</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
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
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog title="症状关联" :visible.sync="relatedFormVisible">
      <div>
        <el-checkbox-group
          v-model="checkedSymptoms"
          @change="handleCheckedChange"
          v-loading="checkedLoading"
        >
          <el-checkbox
            v-for="symptom in allSymptoms"
            :label="symptom.symptomCode"
            :key="symptom.symptomCode"
            >{{ symptom.symptomName }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="saveRelated">确 定</el-button>
        <el-button @click="relatedConcel">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { defaultPageConfig } from "@/config/pagination";
import {
  diseaseListPage,
  symptomListPage,
  symptomListPageByDiseaseCode,
  setDiseaseSymptomsRel,
  symptomList,
  symptomListByDiseaseCode,
  deleteDiseaseInfo
} from "@/api/hospital";
export default {
  name: "index",
  data() {
    return {
      formInline: {
        diseaseCode: "",
        diseaseName: ""
      },
      formSymptom: {
        symptomCode: "",
        symptomName: ""
      },
      tableData: [],
      loading: false,
      loadingSymptom: false,
      tableDataSymptom: [],
      currentPage4: 1,
      pageSize: defaultPageConfig.pageSize,
      pageSizes: defaultPageConfig.pageSizes,
      layout: defaultPageConfig.layout,
      total: 100,
      pageCount: "",
      currentPageD: 1,
      pageSizeD: defaultPageConfig.pageSize,
      pageSizesD: defaultPageConfig.pageSizes,
      totalD: 100,
      pageCountD: "",
      selectDiseaseCode: "",
      multipleSelection: [],
      relatedFormVisible: false,
      allSymptoms: [],
      checkedSymptoms: [],
      checkedLoading: false
    };
  },
  computed: {},
  created: function() {
    this.fetechData();
    this.handleSearchSymptom();
  },
  methods: {
    fetechData: function() {
      this.loading = true;
      diseaseListPage(
        this.currentPageD,
        this.pageSizeD,
        1,
        this.formInline.diseaseName,
        this.formInline.diseaseCode
      )
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.code === "200" && data.value.list.length >= 0) {
            this.tableData = data.value.list;
            this.totalD = data.value.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
      symptomList()
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          this.allSymptoms = data.value;
        })
        .finally(() => {});
    },
    handleSearch: function() {
      this.currentPageD = 1;
      this.fetechData();
    },
    handleAdd: function() {
      this.$router.push({ name: "addDisease", params: { code: "" } });
    },
    handleModify: function(index, row) {
      console.log(index, row.diseaseCode);
      this.$router.push({
        name: "addDisease",
        params: { code: row.diseaseCode }
      });
    },
    handledelete: function(index, row) {
      console.log(index, row.diseaseCode);
      this.loading = true;
      deleteDiseaseInfo(row.diseaseCode)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.code === "200" && data.value > 0) {
            this.$message.info("删除成功");
            this.fetechData();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleClear: function() {
      this.$refs["formRef"].resetFields(this.formInline);
    },
    handleSearchSymptom: function() {
      this.loadingSymptom = true;
      if (this.selectDiseaseCode === null || this.selectDiseaseCode === "") {
        symptomListPage(
          this.currentPage4,
          this.pageSize,
          1,
          this.formSymptom.symptomName,
          null,
          null
        )
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            }
            if (data.code === "200" && data.value.list.length >= 0) {
              this.tableDataSymptom = data.value.list;
              this.total = data.value.total;
            }
          })
          .finally(() => {
            this.loadingSymptom = false;
          });
      } else {
        symptomListPageByDiseaseCode(
          this.currentPage4,
          defaultPageConfig.pageSize,
          this.selectDiseaseCode,
          this.formSymptom.symptomName
        )
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            }
            if (data.code === "200") {
              this.tableDataSymptom = data.value.list;
              this.total = data.value.total;
            }
          })
          .finally(() => {
            this.loadingSymptom = false;
          });
      }
    },
    searchSymptom: function() {
      this.currentPage4 = 1;
      this.handleSearchSymptom();
    },
    handleRelated: function(index, row) {
      this.$refs.tableDistases.setCurrentRow(
        this.$refs.tableDistases.data[row.index]
      );
      this.selectDiseaseCode = row.diseaseCode;
      this.loadingSymptom = true;
      symptomListPageByDiseaseCode(
        1,
        defaultPageConfig.pageSize,
        row.diseaseCode,
        this.formSymptom.symptomName
      )
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.code === "200") {
            this.tableDataSymptom = data.value.list;
          }
        })
        .finally(() => {
          this.loadingSymptom = false;
        });
    },
    saveRelated: function() {
      if (this.selectDiseaseCode === null || this.selectDiseaseCode === "") {
        this.$message.warning("请选择身体部位");
        return;
      }
      let bodySymptomsRequest = {
        bodyCode: this.selectDiseaseCode,
        symptoms: this.checkedSymptoms
      };
      setDiseaseSymptomsRel(bodySymptomsRequest)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.code === "200" && data.value > 0) {
            this.$message.info("保存成功");
          }
        })
        .finally(() => {
          this.relatedFormVisible = false;
          this.formSymptom.symptomName = "";
          this.currentPage4 = 1;
          this.pageSize = defaultPageConfig.pageSize;
          this.handleSearchSymptom();
        });
    },
    updateRelated: function() {
      if (this.selectDiseaseCode === null || this.selectDiseaseCode === "") {
        this.$message.warning("请选择身体部位");
        return;
      }
      this.relatedFormVisible = true;
      this.checkedLoading = true;
      console.log(this.checkedSymptoms);
      symptomListByDiseaseCode(this.selectDiseaseCode)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.code === "200" && data.value.length > 0) {
            data.value.forEach(one => {
              this.checkedSymptoms.splice(0, 0, one.symptomCode);
            });
          }
        })
        .finally(() => {
          this.checkedLoading = false;
        });
    },
    handleSizeChangeD: function(val) {
      console.log(`每页 ${val} 条`);
      this.pageCountD = (this.total + this.pageSizeD - 1) / this.pageSizeD;
    },
    handleCurrentChangeD: function(val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPageD = val;
      this.fetechData();
    },
    handlePrevD: function() {
      //上一页
      console.log(this.currentPageD + ";" + this.pageSizeD);
    },
    handleNextD: function() {
      //下一页
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
      this.pageCount = (this.total + this.pageSize - 1) / this.pageSize;
    },
    handleCurrentChange: function(val) {
      //页数变化时自动
      console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.handleSearchSymptom();
    },
    handlePrev: function() {
      //上一页
      console.log(this.currentPage4 + ";" + this.pageSize);
    },
    handleNext: function() {
      //下一页
    },
    handleSelectionChange(val) {
      console.log(this.multipleSelection);
      this.multipleSelection = val;
    },
    relatedConcel: function() {
      this.relatedFormVisible = false;
      this.checkedSymptoms = [];
    },
    handleCheckedChange: function() {
      console.log(this.checkedSymptoms.length + "---" + this.checkedSymptoms);
    }
  }
};
</script>
<style scoped></style>
