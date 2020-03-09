<template>
  <el-container>
    <el-header style="height: 40px;">
      <el-button type="primary" @click="addDoctor">新增医生</el-button>
    </el-header>
    <el-main style="margin-top: 0">
      <el-row :gutter="15">
        <el-col :span="7">
          <el-card class="box-card" :body-style="bodyStyle">
            <div slot="header" class="clearfix">
              <span>部门科室</span>
            </div>
            <div class="block">
              <el-tree
                :data="data5"
                :props="defaultProps"
                node-key="nodeKey"
                accordion
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                v-loading="treeLoading"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-table
            :data="tableData2"
            style="width: 100%"
            ref="doctorTable"
            border
            v-loading="tableLoading"
            highlight-current-row
          >
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="name" label="医生名称" width="100">
            </el-table-column>
            <el-table-column prop="positionName" label="职称" width="120">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="handlerRow(scope.row)"
                  type="text"
                  size="small"
                >
                  修改医生信息
                </el-button>
                <el-button
                  @click.native.prevent="handlerTime(scope.row)"
                  type="text"
                  size="small"
                >
                  坐诊时间设置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <div class="clearfix">
            <span style="size: 20px">坐诊时间设置</span>
            <el-button
              style="float: right; padding: 5px 10px"
              type="text"
              @click="saveTime"
              >保存</el-button
            >
          </div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-radio v-model="timeSelect" label="1">固定日期</el-radio>
            </div>
            <el-form ref="form" v-model="form" v-loading="timeLoading">
              <el-form-item>
                <el-checkbox v-model="weekDay1" style="float: left"
                  >周一</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio1"
                  size="mini"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay2" style="float: left"
                  >周二</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio2"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay3" style="float: left"
                  >周三</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio3"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay4" style="float: left"
                  >周四</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio4"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay5" style="float: left"
                  >周五</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio5"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay6" style="float: left"
                  >周六</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio6"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="weekDay7" style="float: left"
                  >周日</el-checkbox
                >
                <el-checkbox-group
                  v-model="radio7"
                  size="small"
                  :max="1"
                  style="margin-left: 15px; float: left;"
                >
                  <el-checkbox :label="1">上午</el-checkbox>
                  <el-checkbox :label="2">下午</el-checkbox>
                  <el-checkbox :label="3">全天</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card" :body-style="bodyStyle">
            <div slot="header" class="clearfix">
              <el-radio v-model="timeSelect" label="2">随机时间</el-radio>
            </div>
            <table width="100%" id="randomTable" v-loading="timeLoading">
              <tr style="border-bottom: 1px solid darkgrey;">
                <td width="30%" style="padding-left: 10px">
                  <el-date-picker
                    v-model="valueDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 140px"
                  >
                  </el-date-picker>
                </td>
                <td width="50%">
                  <el-radio-group v-model="radioR" size="small">
                    <el-radio :label="1">上午</el-radio>
                    <el-radio :label="2">下午</el-radio>
                    <el-radio :label="3">全天</el-radio>
                  </el-radio-group>
                </td>
                <td width="10%">
                  <el-button style="" type="text" @click="addTime"
                    >新增</el-button
                  >
                </td>
              </tr>
              <tr
                v-for="(item, index) in items"
                v-bind:key="index"
                class="randomTr"
                border
              >
                <td width="30%" style="padding-left: 10px">
                  <span>{{ item.time }}</span>
                </td>
                <td width="50%">
                  <span>{{ item.dayStr }}</span>
                </td>
                <td width="10%">
                  <el-button
                    style=""
                    type="text"
                    @click="deleteTime(item.code, index)"
                    >删除</el-button
                  >
                </td>
              </tr>
            </table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {
  findDepartmentTree,
  hospitalDoctorsList,
  findAllRulesFlag,
  findAllDoctorJobScheduling,
  deleteLogicDoctorJobScheduling,
  addDoctorJobSchedulingRule,
  addDoctorJobSchedulingList
} from "@/api/hospital";
export default {
  name: "index",
  data() {
    return {
      treeLoading: false,
      doctorCode: "",
      data5: [],
      tableLoading: false,
      timeLoading: false,
      timeSelect: "",
      tableData2: [],
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      form: {},
      valueDate: "",
      radioR: "",
      weekDay1: false,
      weekDay2: false,
      weekDay3: false,
      weekDay4: false,
      weekDay5: false,
      weekDay6: false,
      weekDay7: false,
      radio1: [],
      radio2: [],
      radio3: [],
      radio4: [],
      radio5: [],
      radio6: [],
      radio7: [],
      bodyStyle: { padding: "0" },
      items: [
        // { time: "2019-09-02", day: "3", code: "", dayStr: "全天" },
        // { time: "2019-09-03", day: "3", code: "", dayStr: "" },
        // { time: "2019-09-04", day: "3", code: "", dayStr: "" }
      ],
      randomTimeArrays: []
    };
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.treeLoading = true;
      findDepartmentTree("", 1)
        .then(data => {
          this.data5 = data.value;
        })
        .finally(() => {});
      this.treeLoading = false;
    },
    handleNodeClick: function(data) {
      let expertFlag = 2;
      let department = data.nodeKey;
      this.tableLoading = true;
      hospitalDoctorsList(expertFlag, department)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          this.tableData2 = data.value;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlerRow: function(row) {
      this.$router.push({
        name: "addDoctor",
        params: { code: row.doctorCode }
      });
    },
    handlerTime: function(row) {
      this.$refs.doctorTable.setCurrentRow(
        this.$refs.doctorTable.data[row.index]
      );
      console.log(row.doctorCode);
      this.doctorCode = row.doctorCode;
      this.timeLoading = true;
      this.refreshData();
      findAllRulesFlag(row.doctorCode)
        .then(data => {
          if (data.code !== "200") {
            this.$message.warning(data.message);
          }
          if (data.value !== "" && data.value.length > 0) {
            this.timeSelect = "1";
            var rules = data.value;
            rules.forEach(value => {
              switch (value.weekday) {
                case 1: {
                  this.weekDay1 = true;
                  this.radio1 = [value.weekdayMoment];
                  break;
                }
                case 2: {
                  this.weekDay2 = true;
                  this.radio2 = [value.weekdayMoment];
                  break;
                }
                case 3: {
                  this.weekDay3 = true;
                  this.radio3 = [value.weekdayMoment];
                  break;
                }

                case 4: {
                  this.weekDay4 = true;
                  this.radio4 = [value.weekdayMoment];
                  break;
                }
                case 5: {
                  this.weekDay5 = true;
                  this.radio5 = [value.weekdayMoment];
                  break;
                }
                case 6: {
                  this.weekDay6 = true;
                  this.radio6 = [value.weekdayMoment];
                  break;
                }
                case 7: {
                  this.weekDay7 = true;
                  this.radio7 = [value.weekdayMoment];
                  break;
                }
              }
            });
          } else {
            var beginDate = this.dateFormat();
            findAllDoctorJobScheduling(1, row.doctorCode, beginDate)
              .then(data => {
                if (data.code !== "200") {
                  this.$message.warning(data.message);
                }
                if (data.value !== "" && data.value.length > 0) {
                  this.timeSelect = "2";
                  var values = data.value;
                  values.forEach(value => {
                    var schedulingCode = value.schedulingCode;
                    var schedulingDay = value.schedulingDay.substring(0, 10);
                    var schedulingDayMoment = "";
                    switch (value.schedulingDayMoment) {
                      case 1:
                        schedulingDayMoment = "上午";
                        break;
                      case 2:
                        schedulingDayMoment = "下午";
                        break;
                      case 3:
                        schedulingDayMoment = "全天";
                        break;
                    }
                    var item = {
                      time: schedulingDay,
                      dayStr: schedulingDayMoment,
                      code: schedulingCode,
                      day: value.schedulingDayMoment
                    };
                    this.items.push(item);
                  });
                }
              })
              .finally(() => {});
          }
        })
        .finally(() => {});
      this.timeLoading = false;
    },
    saveTime: function() {
      if (this.doctorCode === "") {
        this.$message.warning("请先选择医生!");
        return;
      }
      if (this.timeSelect === "") {
        this.$message.warning("请先选择设置方式!");
        return;
      }
      debugger;
      if (this.timeSelect === "1") {
        let ruleList = [];
        if (this.weekDay1) {
          if (this.radio1.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule1 = {
            doctorCode: this.doctorCode,
            generateRate: 1,
            weekday: 1,
            weekdayMoment: this.radio1[0]
          };
          ruleList.push(rule1);
        }
        if (this.weekDay2) {
          if (this.radio2.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule2 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 2,
            weekdayMoment: this.radio2[0]
          };
          ruleList.push(rule2);
        }
        if (this.weekDay3) {
          if (this.radio3.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule3 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 3,
            weekdayMoment: this.radio3[0]
          };
          ruleList.push(rule3);
        }
        if (this.weekDay4) {
          if (this.radio4.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule4 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 4,
            weekdayMoment: this.radio4[0]
          };
          ruleList.push(rule4);
        }
        if (this.weekDay5) {
          if (this.radio5.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule5 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 5,
            weekdayMoment: this.radio5[0]
          };
          ruleList.push(rule5);
        }
        if (this.weekDay6) {
          if (this.radio6.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule6 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 6,
            weekdayMoment: this.radio6[0]
          };
          ruleList.push(rule6);
        }
        if (this.weekDay7) {
          if (this.radio7.length <= 0) {
            this.$message.warning("请设置具体上班时间！");
            return;
          }
          var rule7 = {
            doctorCode: this.doctorCode,
            generateRate: 2,
            weekday: 7,
            weekdayMoment: this.radio7[0]
          };
          ruleList.push(rule7);
        }
        console.log(ruleList);
        addDoctorJobSchedulingRule(ruleList)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            } else {
              this.$message.info("保存成功！");
            }
          })
          .finally(() => {});
      } else if (this.timeSelect === "2") {
        if (this.items.length > 0) {
          let timeList = [];
          this.items.forEach(value => {
            if (value.code === "") {
              let time = {
                doctorCode: this.doctorCode,
                schedulingDay: value.time,
                schedulingDayMoment: value.day
              };
              timeList.push(time);
            }
          });
          console.log("timeList:" + timeList);
          addDoctorJobSchedulingList(timeList)
            .then(data => {
              if (data.code !== "200") {
                this.$message.warning(data.message);
              } else {
                this.$message.info("保存成功！");
              }
            })
            .finally(() => {});
        }
      }
    },
    deleteTime: function(id, index) {
      console.log(id);
      if (id !== null || id !== "") {
        this.randomTimeArrays.push(id);
        deleteLogicDoctorJobScheduling(this.randomTimeArrays)
          .then(data => {
            if (data.code !== "200") {
              this.$message.warning(data.message);
            } else {
              this.items.splice(index, 1);
              this.$message.info("删除成功");
            }
          })
          .finally(() => {});
      } else {
        this.items.splice(index, 1);
        this.$message.info("删除成功");
      }
    },
    dateFormat: function() {
      var date = new Date();
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var hours =
      //   date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      // var minutes =
      //   date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      // var seconds =
      //   date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return String(year) + String(month) + String(day);
    },
    addDoctor: function() {
      console.log("新增医生" + this.dateFormat());
      this.$router.push({ name: "addDoctor", params: { code: "" } });
    },
    addTime: function() {
      console.log(this.radioR + ";" + this.valueDate);
      var schedulingCode = "";
      var schedulingDay = this.valueDate;
      var schedulingDayMoment = "";
      switch (this.radioR) {
        case 1:
          schedulingDayMoment = "上午";
          break;
        case 2:
          schedulingDayMoment = "下午";
          break;
        case 3:
          schedulingDayMoment = "全天";
          break;
      }
      var item = {
        time: schedulingDay,
        dayStr: schedulingDayMoment,
        code: schedulingCode,
        day: this.radioR
      };
      this.items.push(item);
    },
    refreshData: function() {
      this.timeSelect = "";
      this.weekDay1 = false;
      this.weekDay2 = false;
      this.weekDay3 = false;
      this.weekDay4 = false;
      this.weekDay5 = false;
      this.weekDay6 = false;
      this.weekDay7 = false;
      this.radio1 = [];
      this.radio2 = [];
      this.radio3 = [];
      this.radio4 = [];
      this.radio5 = [];
      this.radio6 = [];
      this.radio7 = [];
      this.items = [];
    }
  }
};
</script>

<style lang="scss">
.el-header {
  color: #333;
  margin: 0;
}
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.el-form-item__content {
  line-height: 30px;
}
.el-form-item {
  margin: 0;
}
.box-card .el-card__body {
  padding: 0 20px;
}
.box-card .el-card__header {
  background: #d3dce6;
}
.el-table__body tr.current-row > td {
  background: #20a0ff;
  color: #ffffff;
}
</style>
