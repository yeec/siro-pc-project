<template>
  <div class="resource-edit" v-permission="['add', 'update']">
    <el-form
      v-loading="formLoading"
      :model="resourceForm"
      status-icon
      :rules="resourceRules"
      ref="resourceForm"
    >
      <el-form-item prop="resourceName">
        <el-input
          v-model="resourceForm.resourceName"
          placeholder="请输入资源名称"
          class="form-item"
        ></el-input>
      </el-form-item>
      <el-form-item prop="resourceDesc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="resourceForm.resourceDesc"
          placeholder="请输入资源描述"
          class="form-item"
        ></el-input>
      </el-form-item>
      <el-form-item prop="parentCode">
        <el-cascader
          v-model="resourceForm.currentNodeCodeSequence"
          placeholder="请选择父资源"
          :options="resourceMenuData"
          :props="defaultCasProps"
          change-on-select
          class="form-item"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="resourceTypeCode">
        <el-select
          v-model="resourceForm.resourceTypeCode"
          placeholder="请选择资源类型"
          class="form-item"
        >
          <el-option
            v-for="item in resourceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="idx">
        <span class="text-color-label" style="font-size: 0.9em">排序</span>
        <el-input-number
          v-model="resourceForm.idx"
          :min="0"
          :max="1000"
          label="排序"
          style="margin-bottom: 15px;margin-left: 10px;width: 260px;"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="icon">
        <el-input type="hidden" v-model="resourceForm.icon"></el-input>
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <span class="text-color-label">图标：</span
              ><svg-icon
                v-if="resourceForm.icon"
                style="margin: 8px;width: 1.6em;height: 1.6em;"
                :icon-class="resourceForm.icon"
              /><span v-else class="text-color-label">未设置</span
              ><span class="text-color-label">【点击选择】</span>
            </template>
            <template v-for="icon in $icons">
              <a
                :key="icon"
                href="javascript:void(0);"
                @click="onIconSelect(icon)"
              >
                <svg-icon
                  style="margin: 8px;width: 1.6em;height: 1.6em;"
                  :icon-class="icon"
                />
              </a>
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-form-item
        prop="path"
        v-if="this.resourceForm.resourceTypeCode === 'menu_item'"
      >
        <el-select
          v-model="resourceForm.path"
          placeholder="请选择功能实例"
          class="form-item"
        >
          <el-option
            v-for="item in menuResourceOptions"
            :key="item.operatorCode"
            :label="item.operatorName"
            :value="item.operatorCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="path"
        v-if="this.resourceForm.resourceTypeCode === 'menu'"
      >
        <el-input
          v-model="resourceForm.path"
          placeholder="请输入资源相对路径(如system)"
          class="form-item"
        ></el-input>
      </el-form-item>
      <el-table
        v-if="
          resourceForm.resourceTypeCode === 'menu_item' &&
            resourceForm.operators
        "
        :data="resourceForm.operators"
        style="width: 100%"
      >
        <el-table-column prop="operatorCode" label="权限编号" width="150">
        </el-table-column>
        <el-table-column prop="operatorName" label="权限名称">
        </el-table-column>
      </el-table>
      <el-form-item style="margin-top: 15px;">
        <el-button type="primary" @click="onSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addResource, updateResource } from "@/api/resource";
import permission from "@/directive/permission"; // 权限判断指令

export default {
  name: "ResourceEdit",
  directives: { permission },
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    resourceMenuData: {
      type: Array,
      required: true
    },
    menuResourceOptions: {
      type: Array,
      required: false
    },
    resourceTreeData: {
      type: Array,
      required: true
    }
  },
  data: function() {
    const validateResourceName = (rule, value, callback) => {
      if (!value || value === "" || value.trim() === "") {
        callback(new Error("资源名称不能为空"));
      } else {
        callback();
      }
    };

    const validateResourcePath = (rule, value, callback) => {
      if (
        this.resourceForm.resourceTypeCode === "menu_item" &&
        (!value || value === "" || value.trim() === "")
      ) {
        callback(new Error("请选择功能实例"));
      } else if (
        this.resourceForm.resourceTypeCode === "menu" &&
        (!value || value === "" || value.trim() === "")
      ) {
        callback(new Error("请输入资源相对路径"));
      } else {
        callback();
      }
    };

    const validateIcon = (rule, value, callback) => {
      if (
        this.resourceForm.parentCode === "0" &&
        (!value || value === "" || value.trim() === "")
      ) {
        callback(new Error("请选择图标"));
      } else {
        callback();
      }
    };

    return {
      formLoading: false,
      resourceForm: initFormData(),
      resourceRules: {
        resourceName: [{ validator: validateResourceName, trigger: "blur" }],
        parentCode: [
          { required: true, message: "请选择父资源", trigger: "blur" }
        ],
        resourceTypeCode: [
          { required: true, message: "请选择资源类型", trigger: "blur" }
        ],
        path: [{ validator: validateResourcePath, trigger: "blur" }],
        icon: [{ validator: validateIcon, trigger: "blur" }]
      },
      defaultCasProps: {
        children: "children",
        label: "nodeName",
        value: "nodeKey"
      },
      resourceTypeOptions: [
        {
          label: "菜单组",
          value: "menu"
        },
        {
          label: "功能页",
          value: "menu_item"
        }
      ]
    };
  },
  watch: {
    currentNode: {
      handler: function() {
        this.flushFormData();
      },
      deep: true
    },
    "resourceForm.currentNodeCodeSequence": {
      handler: function(val) {
        this.resourceForm.parentCode = "0";
        if (val && val.length > 0) {
          this.resourceForm.parentCode = val[val.length - 1];
        }
      },
      deep: true
    },
    "resourceForm.path": {
      handler: function(val) {
        this.resourceForm.operators = [];
        if (val && this.resourceForm.resourceTypeCode === "menu_item") {
          //如不为空，则查询现有资源的明细，填充到表中
          var obj;
          this.menuResourceOptions.forEach(function(item) {
            if (item && item.operatorCode === val) {
              obj = item;
              return;
            }
          });
          if (obj && obj.operators) {
            this.resourceForm.operators = obj.operators;
          }
        }
      },
      deep: true
    }
  },
  computed: {
    currentNode: function() {
      return this.value;
    }
  },
  created: function() {
    this.flushFormData();
  },
  methods: {
    flushFormData: function() {
      //设置当前节点及所关联的所有父节点编号的array列表
      let nodeCodeSequence = [];
      getNodeCodeSequence(
        nodeCodeSequence,
        this.currentNode,
        this.resourceTreeData[0]
      );

      if (this.isEdit) {
        var modifyCodeSequence = ["0"];
        if (nodeCodeSequence && nodeCodeSequence.length > 1) {
          modifyCodeSequence = nodeCodeSequence.slice(
            0,
            nodeCodeSequence.length - 1
          );
        }
        this.resourceForm.currentNodeCodeSequence = modifyCodeSequence;
      } else {
        this.resourceForm.currentNodeCodeSequence = nodeCodeSequence;
      }
      //如果当前值发生变化，那么同样改变modifyForm内的值(仅当menu和menu_item类型的时候才设置)
      if (this.isEdit && this.currentNode && this.currentNode) {
        this.resourceForm.resourceCode = this.currentNode.node.resourceCode;
        this.resourceForm.resourceName = this.currentNode.node.resourceName;
        this.resourceForm.resourceDesc = this.currentNode.node.resourceDesc;
        this.resourceForm.resourceTypeCode = this.currentNode.node.resourceTypeCode;
        this.resourceForm.path = this.currentNode.node.path;
        this.resourceForm.icon = this.currentNode.node.icon;
        this.resourceForm.parentCode = this.currentNode.node.parentCode;
      }
    },
    onIconSelect: function(icon) {
      //点击选择图标
      this.resourceForm.icon = icon;
    },
    onSave: function() {
      this.$refs["resourceForm"].validate(valid => {
        if (valid) {
          let self = this;
          this.formLoading = true;
          if (this.isEdit) {
            //更新
            //新增表单提交
            updateResource(this.resourceForm)
              .then(function() {
                self.$message({
                  message: "更新成功！",
                  type: "success"
                });
                self.$emit("on-updated", self.currentNode.nodeKey);
              })
              .finally(function() {
                self.formLoading = false;
              });
          } else {
            //新增表单提交
            addResource(this.resourceForm)
              .then(function() {
                self.$message({
                  message: "新增成功！",
                  type: "success"
                });
                self.$emit("on-created", self.currentNode.nodeKey);
                self.$refs["resourceForm"].resetFields();
                self.resourceForm = initFormData();
              })
              .finally(function() {
                self.formLoading = false;
              });
          }
        } else {
          console.log("保存失败，请校验表单数据");
          return false;
        }
      });
    }
  }
};

//初始化form数据
function initFormData() {
  return {
    resourceCode: null,
    resourceName: null,
    resourceDesc: null,
    resourceTypeCode: null,
    path: null,
    icon: null,
    authUrls: null,
    parentCode: "0",
    idx: 0,
    currentNodeCodeSequence: ["0"],
    operators: []
  };
}

//获取当前节点及所有以上节点的编号序列
function getNodeCodeSequence(result, node, treeData) {
  if (node && node.node && node.node.resourceCode) {
    result.splice(0, 0, node.node.resourceCode);
  }

  if (
    node &&
    node.node &&
    !(node.node.parentCode === "0" && node.node.resourceCode === "0")
  ) {
    var parentNodeObj = getParentNode(node.node.parentCode, treeData);
    getNodeCodeSequence(result, parentNodeObj, treeData);
  }
}

function getParentNode(parentCode, treeData) {
  var result = null;
  if (treeData && treeData.nodeKey === parentCode) {
    result = treeData;
    return result;
  }
  if (treeData && treeData.children && treeData.children.length > 0) {
    if (treeData.children && treeData.children.length > 0) {
      treeData.children.forEach(function(value) {
        var node = getParentNode(parentCode, value);
        if (node) {
          result = node;
        }
      });
    }
  }
  return result;
}
</script>
