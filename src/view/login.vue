<template>
    <div>
        <div class="login">
            <div class="login-form">
                <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" type="text" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="form.pwd" type="password" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login('form')">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import forward from "./../mixin/forward";
export default {
    mixins: [forward],
    data() {
        return {
            form: {
                username: "",
                pwd: ""
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
            }
        };
    },
    created() {
        if (process.env.ENVJS === "env.dev.js") {
            this.form.username = "admin";
            this.form.pwd = "admin";
        }
    },
    methods: {
        login(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    window.login = true;
                    this.forward({}, "token");
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="less">
.login {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    background: #fff;
    .login-form {
        width: 500px;
        padding-top: 300px;
    }
}
</style>
