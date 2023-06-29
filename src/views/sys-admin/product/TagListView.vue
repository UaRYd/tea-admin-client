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
    <tr style="font-size: large; font-weight: bold">标签类别列表</tr>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="180">
      </el-table-column>
      <el-table-column label="类别" align="center" width="150">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="sort"
          label="序号"
          width="180">
      </el-table-column>
      <el-table-column
          label="状态"
          width="180">
        <template slot-scope="scope">
          <el-switch
              @change="toggleEnable(scope.row)"
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditForm(scope.row)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="openDeleteForm(scope.row)"
                     circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: left">
      <el-pagination
          small
          @current-change="handleCurrentChange"
          :current-page=currentPage
          :page-size=pageSize
          :total=total
          layout="prev, pager, next">
      </el-pagination>
    </div>

    <!-- 修改数据的表单 -->
    <el-dialog title="编辑标签数据" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="标签类别" prop="typeId">
          <el-select v-model="editForm.typeId" placeholder="请选择">
            <el-option
                v-for="item in tagTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
      pageSize: 0,
      total: 0,

      // 标签类别的下拉菜单的选择列表
      tagTypeOptions: [],
      // 编辑对话框相关数据
      editFormVisible: false,
      editForm: {
        typeId: '',
        name: '',
        sort: ''
      },
      // 编辑表单规则
      editRules: {
        typeId: [
          {required: true, message: '请选择标签类别', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入标签名称', trigger: 'blur'},
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/,
            message: '标签必须是2~10长度的字符组成，且不允许使用标点符号',
            trigger: 'blur'
          }
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序号必须是0~99之间的值', trigger: 'blur'}
        ]
      }
    }
  },

  methods: {
    // 加载标签类别列表
    loadTagTypeList() {
      let url = 'http://localhost:9081/content/tags/type/list?queryType=all';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.tagTypeOptions = jsonResult.data.list;
          if (this.tagTypeOptions && this.tagTypeOptions[0]) {
            this.editForm.typeId = this.tagTypeOptions[0].id;
          }
        } else {
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },

    // 切换分页
    handleCurrentChange(page) {
      this.$router.replace('?page=' + page);
      this.loadTagList();
    },

    // 切换启用状态
    toggleEnable(tableItem) {
      // let enableText = ['禁用', '启用'];
      // let url = 'http://localhost:9081/content/tags/' + tableItem.id;
      // if (tableItem.enable == 0) {
      //   url += '/disable';
      // } else {
      //   url += '/enable';
      // }
      // console.log('url = ' + url);
      //
      // this.axios.post(url).then((response) => {
      //   let jsonResult = response.data;
      //   if (jsonResult.state == 20000) {
      //     this.$message({
      //       message: enableText[tableItem.enable] + '标签成功！',
      //       type: 'success'
      //     });
      //   } else {
      //     let title = '操作失败';
      //     this.$alert(jsonResult.message, title, {
      //       confirmButtonText: '确定',
      //       callback: action => {
      //         if (jsonResult.state == 40400) {
      //           this.loadTagList();
      //         }
      //       }
      //     });
      //   }
      // });
      let enableText = ["禁用", "启用"];
      let url = 'http://localhost:9081/content/tags/' + tableItem.id;
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

    openEditForm(item) {
      let url = 'http://localhost:9081/content/tags/' + item.id;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.editForm = jsonResult.data;
          this.editForm.typeId = jsonResult.data.parentId;
          this.editFormVisible = true;
        } else {
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
              this.loadTagList();
            }
          });
        }
      });
    },

    openDeleteForm(item) {
      alert('待做' + item.id);
    },

    handleEdit() {
      let url = 'http://localhost:9081/content/tags/' + this.editForm.id + '/update/info';
      console.log('url = ' + url);
      let formData = this.qs.stringify(this.editForm);
      console.log('formData = ' + formData);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url, formData).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: '修改标签成功！',
            type: 'success'
          });
          this.editFormVisible = false;
          this.loadTagList();
        } else if (jsonResult.state == 40400) {
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
              this.editFormVisible = false;
              this.loadTagList();
            }
          });
        } else {
          let title = '操作失败';
          this.$alert(jsonResult.message, title, {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },

    loadTagList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9081/content/tags?page=' + page;
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
    this.loadTagList();
  }
}
</script>

<style scoped>

</style>