<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        nickname: "",
        avatar: "",
        phone: "",
        email: "",
        description: "",
        enable: 1,
        roleIds: []
      },

      rules: {
        username:[
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 4, max: 15, message: "长度在 4 到 15 个字符", trigger: "blur"}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        avatar: [
          {required: true, message: '请输入头像的URL', trigger: 'blur'},
          {min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入电子邮箱', trigger: 'blur'},
          {min: 8, max: 35, message: '长度在 8 到 35 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入相册简介', trigger: 'blur'},
          {min: 2, max: 35, message: '长度在 4 到 35 个字符', trigger: 'blur'}
        ]
      }
    };
  },

  submitForm(formName) {
    this.$refs[formName].validate((valid) => {
      if (valid) {
        let url = 'http://localhost:9081/account/users/add-new';
        console.log('url = ' + url);
        let formData = this.qs.stringify(this.ruleForm);
        console.log('formData = ' + formData);

        this.axios.post(url, formData).then((response) => {
          let jsonResult = response.data;
          if (jsonResult.state == 20000) {
            this.$message({
              message: '新增用户成功！',
              type: 'success'
            });
            this.resetForm(formName);
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
    });
  },

  // 重置表单
  resetForm(formName) {
    this.$refs[formName].resetFields();
  },

  loadRoleList() {
    let url = localhost:9081/account/users
  },

  mounted: {
    this.loadRoleList();
  }
}
</script>

<template>
  <div>
    <!-- 顶部的面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 表单 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="ruleForm.avatar"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="相册简介" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>