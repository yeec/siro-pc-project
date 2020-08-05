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
          <com-button type="primary" @click="onSearchUser" icon="el-icon-search">查询</com-button>
        </com-form-item>
        <com-form-item>
          <com-button type="primary" @click="addBranch" icon="el-icon-plus">新增</com-button>
        </com-form-item>
      </com-form>
    </com-row>

    <com-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <com-table-column prop="date" label="机构名称" width="180"></com-table-column>
      <com-table-column prop="name" label="机构代码" width="180"></com-table-column>
      <com-table-column prop="address" label="机构级别" width="180"></com-table-column>
      <com-table-column prop="type" label="启用状态" width="180"></com-table-column>
      <com-table-column prop="customer" label="有无用户" width="180"></com-table-column>
      <com-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <com-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</com-button>
          <com-popconfirm
            style="margin-left:0.6rem"
            @onConfirm="handleDelete(scope.$index, scope.row)"
            title="确定删除吗？"
          >
            <com-button slot="reference" size="mini" type="danger">删除</com-button>
          </com-popconfirm>
        </template>
      </com-table-column>
    </com-table>
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
      tableData: [
        {
          id: 1,
          date: "齐鲁银行总行",
          name: "866000001",
          address: "总行",
          type: "启用",
          customer: "有",
        },
        {
          id: 2,
          date: "银行总行",
          name: "866000000",
          address: "总行",
          type: "启用",
          customer: "有",
          children: [
            {
              id: 33,
              date: "分行",
              name: "866000000",
              address: "分行",
              type: "启用",
              customer: "有",
            },
            {
              id: 34,
              date: "分行",
              name: "866000000",
              address: "分行",
              type: "启用",
              customer: "有",
              children: [
                {
                  id: 99,
                  date: "支行",
                  name: "866000000",
                  address: "支行",
                  type: "启用",
                  customer: "有",
                },
                {
                  id: 111,
                  date: "支行",
                  name: "866000000",
                  address: "支行",
                  type: "启用",
                  customer: "有",
                },
              ],
            },
          ],
        },
        {
          id: 3,
          date: "总行",
          name: "866000000",
          address: "总行",
          type: "暂停",
          customer: "无",
          children: [
            {
              id: 31,
              date: "分行",
              name: "866000000",
              address: "分行",
              type: "暂停",
              customer: "无",
            },
            {
              id: 32,
              date: "分行",
              name: "866000000",
              address: "分行",
              type: "暂停",
              customer: "无",
            },
          ],
        },
        {
          id: 4,
          date: "总行",
          name: "866000000",
          address: "总行",
          type: "启用",
          customer: "有",
        },
      ],
    };
  },
  computed: {},
  methods: {
    //点击树节点
    handleNodeClick(data) {
      alert("点击机构树");
      console.log(data);
    },
    //查询法人下有哪些机构
    onSearchUser() {
      alert(this.searchForm.searchType);
    },
    //新增
    addBranch() {
      alert("新增机构");
    },
    //查看
    handleClick(row) {
      alert(JSON.stringify(row.address));
      console.log(row);
    },
    //修改
    handleEdit(index, row) {
      console.log(index, row);
      alert(JSON.stringify(row));
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      alert(JSON.stringify(row));
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