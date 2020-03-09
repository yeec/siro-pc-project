<template>
  <el-container>
    <el-header>
      <el-row style="text-align: right">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click="modifyInfo"
          >编辑信息</el-button
        >
      </el-row>
      <h2>{{ title }}</h2>
    </el-header>
    <el-main>
      <div id="hosContent" v-html="content"></div>
    </el-main>
  </el-container>
</template>

<script>
import { oneHospitalInfo } from "@/api/hospital";
export default {
  name: "Hospital",
  data() {
    return {
      loading: false,
      title: "",
      content: "",
      code: ""
    };
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.loading = false;
      oneHospitalInfo()
        .then(data => {
          this.title = data.value.hospitalName;
          this.content = data.value.hospitalIntro;
          this.code = data.value.hospitalCode;
        })
        .finally(() => {});
    },
    modifyInfo: function() {
      this.$router.push({ name: "addHospital", params: { code: this.code } });
    }
  }
};
</script>
<style lang="scss" scoped></style>
