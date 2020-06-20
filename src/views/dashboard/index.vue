<template>
  <div class="dashboard-container">
    <div class="title">移动管理平台</div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  computed: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    min-height: calc(100vh - 114px);
    background: url("~@/assets/dashboard-bg.jpg") no-repeat;
    background-size: 100% 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.title {
  width: 500px;
  height: 40px;
  font-size: 20px;
  color: rgba(17, 17, 17, 1);
  line-height: 40px;
  text-align: center;
  margin: 207px 364px;
  position: fixed;
}
</style>
