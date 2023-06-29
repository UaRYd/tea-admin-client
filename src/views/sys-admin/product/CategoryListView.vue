<template>
  <div>
    <!-- 顶部面包屑标识与导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>类别管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in history" :key="item.id"><span v-text="item.name"></span></el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 操作区域 -->
    <div style="margin: 0 0 20px 0;">
      <el-button type="primary" size="medium" @click="$router.push('/admin/content/category/add-new')">添加类别</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column label="图标" width="70" align="center">
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.icon" fit="contain"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="keywords" label="关键词列表" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="100" align="center"></el-table-column>
      <el-table-column label="是否启用" width="120" align="center">
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
      <el-table-column label="显示在导航栏" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="toggleDisplay(scope.row)"
              v-model="scope.row.isDisplay"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="子级类别" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.isParent == 0"
                     @click="showSubCategoryList(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     :disabled="scope.row.isParent == 1"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 返回上层 -->
    <div v-if="currentParentId != 0" style="margin-top: 10px; text-align: right;">
      <el-button size="small" @click="goBack()">返回</el-button>
    </div>

    <!-- 修改类别的弹出表单Dialog -->
    <el-dialog title="修改类别" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="editRules" :label-width="formLabelWidth">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="关键词列表" prop="keywords">
          <el-input v-model="editForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 当前类别列表的父级类别ID
      currentParentId: 0,
      // 浏览历史，此数据主要用于返回功能
      history: [],
      // 编辑对话框的可见性
      dialogFormVisible: false,
      // 编辑表单
      editForm: {
        id: '',
        name: '',
        keywords: '',
        sort: '',
        icon: ''
      },
      // 编辑表单的验证规则
      editRules: {
        name: [
          {required: true, message: '请输入类别名称', trigger: 'blur'},
          {min: 2, max: 15, message: '类别名称长度必须在 2 到 15 个字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '请输入关键词列表', trigger: 'blur'},
          {min: 2, max: 50, message: '关键词列表长度必须在 2 到 50 个字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入图标图片的URL', trigger: 'blur'},
          {min: 20, max: 200, message: '图标图片的URL长度必须在 20 到 200 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^([0-9]{1}|[1-9]{1}[0-9]{1})$/, message: '排序序号必须是 0~99 之间的数字', trigger: 'blur'}
        ]
      },
      // 编辑表单的label宽度
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 返回
    goBack() {
      console.log('goBack, start...');
      for(let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')

      let parentCategory = this.history[this.history.length - 1];
      this.currentParentId = parentCategory.parentId;
      this.loadCategoryList();
      this.history.pop();

      console.log('goBack, done.');
      for(let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')
    },
    // 显示子级类别列表
    showSubCategoryList(category) {
      this.history[category.depth - 1] = category;

      console.log('showSubCategoryList');
      for(let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].id + ' ' + this.history[i].name);
      }
      console.log('---------------')

      this.currentParentId = category.id;
      this.loadCategoryList();
    },
    // 切换启用状态
    toggleEnable(category) {
      let enableText = ['禁用', '启用'];
      let url = 'http://localhost:9080/categories/' + category.id;
      let enable = category.enable;
      if (enable == 1) {
        url += '/enable';
      } else {
        url += '/disable';
      }
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: '将【' + category.name + '】的启用状态修改为【' + enableText[enable] + '】成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    // 切换显示状态
    toggleDisplay(category) {
      let displayText = ['不显示在导航栏', '显示在导航栏'];
      let url = 'http://localhost:9080/categories/' + category.id;
      let isDisplay = category.isDisplay;
      if (isDisplay == 1) {
        url += '/display';
      } else {
        url += '/hidden';
      }
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: '将【' + category.name + '】的显示状态修改为【' + displayText[isDisplay] + '】成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    // 打开编辑对话框
    openEditDialog(category) {
      let url = 'http://localhost:9080/categories/' + category.id;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.editForm = jsonResult.data;
          this.dialogFormVisible = true;
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    // 提交编辑表单
    submitEditForm() {
      let url = 'http://localhost:9080/categories/' + this.editForm.id + '/update';
      console.log('url = ' + url);

      let formData = this.qs.stringify(this.editForm);
      console.log('formData = ' + formData);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url, formData).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: '修改类别成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.loadCategoryList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadCategoryList();
            }
          });
        } else if (jsonResult.state == 40900) {
          this.$message.error(jsonResult.message);
        } else {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
            }
          });
        }
      });
    },
    // 打开删除确认框
    openDeleteConfirm(category) {
      let message = '此操作将永久删除【' + category.name + '】类别，是否继续？';
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(category);
      }).catch(() => {
      });
    },
    // 处理删除
    handleDelete(category) {
      let url = 'http://localhost:9080/categories/' + category.id + '/delete';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.$message({
            message: '删除【' + category.name + '】类别成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$alert(jsonResult.message, '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    // 加载类别列表
    loadCategoryList() {
      let url = 'http://localhost:9080/categories/list-by-parent?queryType=all&parentId=' + this.currentParentId;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.tableData = jsonResult.data.list;
        }
      });
    }
  },
  mounted() {
    this.loadCategoryList();
  }
}
</script>