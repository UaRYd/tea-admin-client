<template>
  <div>
    <!-- 顶部的面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签类别列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="100" align="center"></el-table-column>
      <el-table-column label="启用状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="toggleEnable(scope.row)"
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div style="margin: 10px 0;text-align: right;">
      <el-pagination
          @current-change="changePage"
          layout="total, prev, pager, next"
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 分页相关数据
      currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    // 切换分页
    changePage(page) {
      this.$router.replace('?page=' + page);
      this.loadTagTypeList();
    },
    // 切换启用状态
    toggleEnable(tableItem) {
      let enableText = ["禁用", "启用"];
      let url = 'http://localhost:9081/content/tags/type/' + tableItem.id;
      if (tableItem.enable == 0) {
        url += "/disable";
      } else {
        url += "/enable";
      }
      console.log("url = " + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: enableText[tableItem.enable] + "标签成功",
            type: "success"
          });
        } else {
          let title = "操作失败";
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
              if (jsonResult.state == 40400) {
                this.loadTagList();
              }
            }
          })
        }
      })
    },
    // 弹出修改对话框
    openEditDialog(tableItem) {
      alert('即将编辑【' + tableItem.id + " - " + tableItem.name + '】，还没做！');
    },
    // 弹出删除确认框
    openDeleteConfirm(tableItem) {
      alert('即将删除【' + tableItem.id + " - " + tableItem.name + '】，还没做！');
    },
    // 加载标签类别列表
    loadTagTypeList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9081/content/tags/type/list?page=' + page;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.tableData = jsonResult.data.list;
          this.currentPage = jsonResult.data.currentPage;
          this.pageSize = jsonResult.data.pageSize;
          this.total = jsonResult.data.total;
        } else {
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    }
  },
  mounted() {
    this.loadTagTypeList();
  }
}
</script>