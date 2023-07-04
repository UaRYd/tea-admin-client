<template>
  <div>
    <!-- 顶部面包屑标识与导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/temp/category/list' }">类别管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加类别</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加数据的表单 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="父级类别" prop="parentId">
        <el-cascader
            style="width: 100%;"
            placeholder="请选择父级类别，如不选择，则表示无父级类别"
            :props="{ checkStrictly: true }"
            v-model="ruleForm.parentId"
            :options="parentCategoryOptions"></el-cascader>
        <span>如果父级类别列表不准确，请点击 <a class="simple-link" href="#" @click="loadCategoryTree">这里</a> 刷新。</span>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="关键词列表" prop="keywords">
        <el-input v-model="ruleForm.keywords"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="ruleForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
            v-model="ruleForm.enable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否显示在导航栏">
        <el-switch
            v-model="ruleForm.isDisplay"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="gotoList">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 父级类别的下拉菜单的选项数据
      parentCategoryOptions: [],
      // 表单
      ruleForm: {
        parentId: '0',
        name: '测试数据001',
        keywords: '测试关键词1,测试关键词2',
        icon: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        sort: '99',
        enable: 1,
        isDisplay: 1
      },
      // 表单规则
      rules: {
        parentId: [
          {required: true, message: '请输入父级类别ID', trigger: 'blur'},
          {pattern: /^\d+$/, message: '请选择有效的父级类别', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入类别名称', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '请输入类别关键词列表', trigger: 'blur'},
          {min: 2, max: 35, message: '长度在 2 到 35 个字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入类别图标的URL', trigger: 'blur'},
          {min: 20, max: 255, message: '长度在 20 到 255 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是 0~99 之间的数字', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    // 返回列表
    gotoList() {
      this.$router.push('/admin/content/category/list');
    },
    // 提交表单
    submitForm(formName) {
      console.log(this.ruleForm.parentId);
      if (Array.isArray(this.ruleForm.parentId)) {
        this.ruleForm.parentId = this.ruleForm.parentId.pop();
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9081/content/category/add-new';
          console.log('url = ' + url);

          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
              .post(url, formData).then((response) => {
            let jsonResult = response.data;
            console.log(jsonResult);
            if (jsonResult.state == 20000) {
              this.$message({
                showClose: true,
                message: '添加类别成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$message({
                showClose: true,
                message: jsonResult.message,
                type: 'error'
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 加载类别树的数据
    loadCategoryTree() {
      let url = 'http://localhost:9081/categories/tree';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('localJwt')}})
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.parentCategoryOptions = jsonResult.data;
          this.parentCategoryOptions.unshift({
            value: 0,
            label: '无父级类别'
          });
          this.ruleForm.parentId = "0";
        }
      });
    }
  },
  mounted() {
    this.loadCategoryTree();
  }
}
</script>

<style>
.simple-link {
  color: #409eff;
  text-decoration: underline;
}
</style>