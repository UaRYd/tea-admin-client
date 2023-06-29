<template>
  <div>
    <!-- 整个容器 -->
    <el-container>
      <!-- 上半部分：顶栏 -->
      <el-header class="layout-header">
        <!-- 顶栏右侧的当前用户信息及下拉菜单 -->
        <div class="login-user">
          <span>欢迎回来，<b>{{currentUserName}}</b>！</span>
          <el-dropdown @command="handleCommand">
            <el-avatar size="medium" :src="currentUserAvatar"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" command="openEditInfoDialog">修改资料</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" command="openEditAvatarDialog">修改头像</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" command="openEditPasswordDialog">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" command="openLogoutConfirm">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 左侧的标题文字 -->
        <h1>学茶商城后台管理平台</h1>
      </el-header>
      <!-- 下半部分 -->
      <el-container class="layout-body">
        <!-- 下半部分的左侧：侧边栏 -->
        <el-aside class="layout-aside">
          <el-menu
              router
              :default-active="$router.currentRoute.path"
              class="el-menu-vertical-demo"
              background-color="#222"
              text-color="#fff"
              active-text-color="#fff">
            <!-- 主页 -->
            <el-menu-item index="/admin/index">
              <i class="el-icon-s-home"></i>
              <span>主页</span>
            </el-menu-item>
            <!-- 临时菜单 -->
            <el-submenu index="temp">
              <template slot="title">
                <i class="el-icon-warning"></i>
                <span>临时菜单</span>
              </template>
              <el-menu-item index="/admin/content/tag/type/add-new">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">新增标签类别</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/tag/type/list">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">标签类别列表</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/tag/add-new">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">新增标签</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/tag/list">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">标签列表</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/user/add-new">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">新增用户</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/user/add-new">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">新增用户</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/user/list">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/category/add-new">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">添加类别</span>
              </el-menu-item>
              <el-menu-item index="/admin/content/category/list">
                <i class="el-icon-circle-plus"></i>
                <span slot="title">类别列表</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 下半部分的右侧：主体 -->
        <el-main class="layout-main">
          <!-- 将由其它视图组件来显示 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUserName: '',
      currentUserAvatar: ''
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "openEditInfoDialog": this.openEditInfoDialog();
          break;
        case "openEditAvatarDialog": this.openEditAvatarDialog();
          break;
        case "openEditPasswordDialog": this.openEditPasswordDialog();
          break;
        case "openLogoutConfirm": this.openLogoutConfirm();
          break;
      }
    },
    loadCurrentUserInfo() {
      this.currentUserName = localStorage.getItem('currentUserName');
      this.currentUserAvatar = localStorage.getItem('currentUserAvatar');
    },
    openEditInfoDialog() {
      console.log("修改资料");
    },
    openEditAvatarDialog() {
      console.log("修改头像");
    },
    openEditPasswordDialog() {
      console.log("修改密码");
    },
    openLogoutConfirm() {
      console.log("确认退出");
    }
  },
  mounted() {
    this.loadCurrentUserInfo();
  }
}
</script>

<style>
.layout-header .login-user {
  float: right;
}

.layout-header {
  background: #2c3e50;
}

.layout-header h1 {
  line-height: 20px;
  color: #fff;
}

.layout-header .login-user {
  float: right;
  display: flex;
  margin-top: 16px;
}

.layout-header .login-user .welcome {
  line-height: 28px;
  color: #fff;
}

.layout-body {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
}

.layout-aside {
  background: #222;
}

.layout-aside .el-menu {
  border: 0;
}

.layout-aside i {
  color: #fff !important;
}

.el-menu-item.is-active {
  background: #2c3e50 !important;
}

.layout-main {
  background-color: #fff;
}
</style>