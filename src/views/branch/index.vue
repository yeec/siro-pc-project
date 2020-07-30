<template>
  <div>
    <com-row>
      <com-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
        <com-form-item>
          <com-select
            v-model="searchForm.searchType"
            placeholder="请选择查询法人"
            :default-first-option="true"
          >
            <com-option
              v-for="item in searchTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></com-option>
          </com-select>
        </com-form-item>
        <com-form-item>
          <com-button
            type="primary"
            @click="onSearchUser"
            icon="el-icon-search"
          >查询</com-button>
        </com-form-item>
         <com-form-item>
          <com-button
            type="primary"
            @click="addBranch"
            icon="el-icon-plus"
            >新增</com-button
          >
        </com-form-item>
      </com-form>
    </com-row>
    <com-container style="height: 500px; border: 1px solid #eee">
      <com-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <com-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          style="width: 100%"
        ></com-tree>
      </com-aside>
      <com-container>
        <com-header style="text-align: right; font-size: 12px">
            <i class="el-icon-sunset"  style="margin-right: 15px"></i>
          <span>机构名称</span>
        </com-header>
        <com-main>
          <com-table :data="tableData">
            <com-table-column prop="date" label="日期" width="140"></com-table-column>
            <com-table-column prop="name" label="姓名" width="120"></com-table-column>
            <com-table-column prop="address" label="地址"></com-table-column>
            <com-table-column fixed="right" label="操作" width="240">
              <template slot-scope="scope">
                <com-button @click="handleClick(scope.row)" type="text" size="small">查看</com-button>
                <com-button @click="modifyBranch(scope.row)" type="text" size="small">修改</com-button>
                <com-popconfirm
                  style="margin-left:0.6rem"
                  @onConfirm="delBranch(scope.row)"
                  title="确定删除吗？"
                >
                  <com-button type="text" slot="reference" size="small">删除</com-button>
                </com-popconfirm>
              </template>
            </com-table-column>
          </com-table>
        </com-main>
      </com-container>
    </com-container>
  </div>
</template>
<script>
import {
  ComButton,
  ComPopconfirm,
  ComRow,
  ComInput,
  ComForm,
  ComFormItem,
  ComSelect,
  ComOption,
  ComCard,
  ComTable,
  ComTableColumn,
  ComPagination,
  ComDialog,
  ComTree,
  ComMain,
  ComContainer,
  ComAside,
  ComHeader,
  ComDropdown,
  ComDropdownMenu,
  ComDropdownItem,
} from "@com";
export default {
  name: "branch",
  components: {
    ComButton,
    ComPopconfirm,
    ComRow,
    ComInput,
    ComForm,
    ComFormItem,
    ComSelect,
    ComOption,
    ComCard,
    ComTable,
    ComTableColumn,
    ComPagination,
    ComDialog,
    ComTree,
    ComMain,
    ComContainer,
    ComAside,
    ComHeader,
    ComDropdown,
    ComDropdownMenu,
    ComDropdownItem,
  },
  data: function () {
    return {
      searchForm: {
        searchType: null,
        searchValue: null,
      },
      searchTypeOptions: [
        { label: "法人1", value: "loginName" },
        { label: "法人2", value: "userName" },
        { label: "法人3", value: "phone" },
        { label: "法人4", value: "email" },
      ],
      data: [
        {
          label: "一机构 1",
          children: [
            {
              label: "二机构 1-1",
              children: [
                {
                  label: "三机构 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一机构 2",
          children: [
            {
              label: "二机构 2-1",
              children: [
                {
                  label: "三机构 2-1-1",
                },
              ],
            },
            {
              label: "二机构 2-2",
              children: [
                {
                  label: "三机构 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一机构 3",
          children: [
            {
              label: "二机构 3-1",
              children: [
                {
                  label: "三机构 3-1-1",
                },
              ],
            },
            {
              label: "二机构 3-2",
              children: [
                {
                  label: "三机构 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
    };
  },
  computed: {},
  methods: {
    //点击树节点
    handleNodeClick(data) {
      console.log(data);
    },
    //查询法人下有哪些机构
    onSearchUser() {
      alert(this.searchForm.searchType);
    },
    //新增
    addBranch(){
      alert('新增机构')
    },
    //查看
    handleClick(row) {
      alert(JSON.stringify(row.address));
      console.log(row);
    },
    //修改
    modifyBranch(row) {
      alert(JSON.stringify(row));
    },
    //删除
    delBranch(row) {
      alert(JSON.stringify(row.date));
    },
  },
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>