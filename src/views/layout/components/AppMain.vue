<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--<keep-alive>-->
      <!--<router-view v-if="$route.meta.noCache == true" :key="key" />-->
      <keep-alive><router-view :key="key"/></keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  /*width: 100%;*/
  padding-top: 15px;
  padding-right: 15px;
  padding-left: 15px;
  position: relative;
  overflow: hidden;
}
</style>
