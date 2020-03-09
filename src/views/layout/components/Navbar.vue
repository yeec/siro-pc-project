<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <div class="right-menu">
      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item" />
      </el-tooltip>
      <el-dropdown
        class="userinfo-container right-menu-item"
        trigger="click"
        @command="handleCommand"
      >
        <div class="username-wrapper">
          <span class="">{{ username }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="dashboard">主页</el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <span style="display:block;">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import { logout } from "../../../api/auth";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters(["sidebar", "username"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    handleCommand(command) {
      if (command === "dashboard") {
        var currentPath = this.$router.currentRoute.path.replace("/", "");
        if (currentPath === "dashboard") {
          console.log("visitedViews", this.$store.state.tagsView.visitedViews);
          var visitedViews = this.$store.state.tagsView.visitedViews;
          if (!visitedViews || visitedViews.length === 0) {
            this.$router.go(0);
          } else {
            this.$router.push({ path: "/dashboard" });
          }
        } else {
          this.$router.push({ path: "/dashboard" });
        }
      } else if (command === "logout") {
        this.logoutHandler();
      }
    },
    logoutHandler() {
      let self = this;
      let store = this.$store;
      logout()
        .then()
        .finally(() => {
          this.$store.dispatch("clearAccessInfo").then(() => {
            store.dispatch("clearRoutes").then(() => {
              self.$router.push("/login");
            });
          });
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0 !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
    }
    .userinfo-container {
      height: 50px;
      margin-right: 30px;
      .username-wrapper {
        cursor: pointer;
        font-weight: normal;
        color: #303133;
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
