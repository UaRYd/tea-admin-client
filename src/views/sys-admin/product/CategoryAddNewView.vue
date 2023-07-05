<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/content/category' }">类别管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加类别</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-form ref="form" :model="form" :rules="rules" label-width="124px">

      <el-form-item label="父级类别">
        <el-cascader
            :options="options"
            :props="{ checkStrictly: true }"
            :v-model="form.parentId"
            clearable></el-cascader>
      </el-form-item>
      <span>
        如果父级类别不准确，请点击<a href="">这里</a>刷新
      </span>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="关键词列表" prop="keywords">
        <el-input v-model="form.keywords"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="form.enable"></el-switch>
      </el-form-item>
      <el-form-item label="是否显示在导航栏" prop="navigator">
        <el-switch v-model="form.navigator"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="warning" @click="goBack">返回上级</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 级联选择器 */
      options: [{}],
      /* 级联选择器 */
      form: {

        /* 级联选择器 */
        parentId: "",
        value: [],
        children: [{}],
        /* 级联选择器 */

        name: "",
        keywords: "",
        icon: "",
        sort: "",
        enable: true,
        navigator: true
      },
      rules: {
        name: [
          {required: true, message: '请输入类别名称', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '请输入关键字', trigger: 'blur'},
          {min: 1, message: '请输入关键字', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入图片地址', trigger: 'blur'},
          {min: 1, message: '请输入图片地址', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '请输入排序序号', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goBack() {
      this.$router.push("/");
    },
    loadCategoryTree() {
      let url = "http://localhost:9081/content/category/tree"
      this.axios.
          create({"headers": {"Authorization": localStorage.getItem("localJwt")}}).
          get(url).
          then((response) => {
            let jsonResult = response.data;
            if (jsonResult.state = 20000) {
              this.options = jsonResult.data;
              this.options.unshift({
                value: 0,
                label: "无父级类别"
              })
            }
          }
      );
    }
  },
  mounted() {
    this.loadCategoryTree();
  }
}
</script>

<style>

</style>