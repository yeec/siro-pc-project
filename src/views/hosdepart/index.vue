<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
      <el-button type="primary" @click="addHosDepart">新增科室</el-button>
    </el-row>
    <!--<el-tag style="margin-bottom:20px;">-->
    <!--<a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>-->
    <!--</el-tag>-->
    <tree-table :data="data" :eval-func="func" border v-loading="loading">
      <el-table-column label="科室名称" prop="node.departmentName">
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.event }}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="位置"
        prop="node.location"
        width="150"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="电话"
        prop="node.tel"
        width="150"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="上班时间"
        width="200"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.node.amStartTime !== null && scope.row.node.amEndTime
            "
          >
            <span v-if="scope.row.node.amStartTime !== 0">
              上午{{
                String(scope.row.node.amStartTime).substr(0, 1) +
                  ":" +
                  String(scope.row.node.amStartTime).substr(1, 3)
              }}
            </span>
            <span v-if="scope.row.node.amStartTime === 0">
              上午:00:00
            </span>
            —
            {{
              String(scope.row.node.amEndTime).substr(0, 2) +
                ":" +
                String(scope.row.node.amEndTime).substr(2, 4)
            }}
            <br />
          </span>
          <span
            v-if="
              scope.row.node.pmStartTime !== null && scope.row.node.pmEndTime
            "
          >
            <span v-if="scope.row.node.pmStartTime !== 0">
              下午:{{
                String(scope.row.node.pmStartTime).substr(0, 2) +
                  ":" +
                  String(scope.row.node.pmStartTime).substr(2, 4)
              }}
            </span>
            <span v-if="scope.row.node.pmStartTime === 0">
              下午:00:00
            </span>
            —
            {{
              String(scope.row.node.pmEndTime).substr(0, 2) +
                ":" +
                String(scope.row.node.pmEndTime).substr(2, 4)
            }}
          </span>
        </template>
      </el-table-column>
      <!--<el-table-column label="创建时间"-->
      <!--prop="createdTime"-->
      <!--width="150"-->
      <!--header-align="center" align="center">-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="modifyHosDepart(scope.row)"
            >基础信息修改</el-button
          >
          <el-button type="text" @click="deleteHosDepart(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import treeToArray from "@/components/TreeTable/eval";
import { findDepartmentTree, deleteHospitalDepartment } from "@/api/hospital";
export default {
  name: "index",
  components: {
    treeTable
  },
  created: function() {
    this.fetchData();
  },
  data() {
    return {
      func: treeToArray,
      loading: false,
      data: []
    };
  },
  methods: {
    fetchData: function() {
      this.loading = true;
      findDepartmentTree("", 1)
        .then(data => {
          this.data = data.value;
        })
        .finally(() => {});
      this.loading = false;
    },
    deleteHosDepart: function(row) {
      this.loading = true;
      if (row.nodeKey === null || row.nodeKey === "") {
        this.$message.warning("科室编号为空！");
        return;
      }
      this.$confirm("确认删除？")
        .then(() => {
          deleteHospitalDepartment(row.nodeKey)
            .then(data => {
              if (data.value > 0) {
                this.fetchData();
                this.$message.info("删除成功！");
              } else {
                this.$message.warning(data.message);
              }
            })
            .finally(() => {});
        })
        .catch(() => {});

      this.loading = false;
    },
    addHosDepart: function() {
      this.$router.push({ name: "addHosDepart", params: { code: "" } });
    },
    modifyHosDepart: function(row) {
      this.$router.push({
        name: "addHosDepart",
        params: { code: row.nodeKey }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
