<template>
    <ui-layout no-home>
        <ui-container>
            <div class="form-logo">
                <ui-field v-model="pwd" input-type="password" placeholder="请输入密码" hr-bottom></ui-field>
                <ui-field v-model="repwd" input-type="password" placeholder="请输入确认密码" hr-bottom></ui-field>
                <ui-field type="slot">
                    <div class="form-item-text" @click="$to({name:'login'})">已有账号？请登录</div>
                </ui-field>
                <ui-field type="slot">
                    <button class="form-item-btn" @click="register">注册</button>
                </ui-field>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
export default {
    components: { UiField },
    data() {
        return {
            username: this.$route.query.username,
            pwd: "",
            repwd: "",
            layer: false
        };
    },
    methods: {
        register() {
            if (!this.username) return this.$toast("违法进入");
            if (!this.pwd) return this.$toast("请输入密码");
            if (!this.repwd) return this.$toast("请输入确认密码");
            if (this.repwd != this.pwd) return this.$toast("两次密码不一样");
            this.$post("register", {
                username: this.username,
                password: this.pwd
            }).then(() => {
                this.$post("loginByPwd", {
                    phone: this.username,
                    password: this.pwd
                }).then(res => {
                    window.login = true;
                    this.Store.set("$token", res.extInfo["x-token"]);
                    this.$get("getWxInfo", null, null, true, true);
                    this.$post("memberDetail", { loginName: null }).then(r => {
                        r.name = r.nickName;
                        r.mobile = r.loginName;
                        this.Store.set("$user", r);
                    });
                    this.$to({ name: "registerStep3" });
                });
            });
        }
    }
};
</script>

<style lang="less">

</style>
