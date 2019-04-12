<template>
    <ui-layout no-home>
        <ui-head title="找回密码"></ui-head>
        <ui-container class="bg-gray">
            <div class="hr-10"></div>
            <div>
                <mt-field v-model="vcode" placeholder="请输入验证码">
                    <div class="form-item">
                        <button class="btn-code" @click="phsendCode" v-text="vtext"></button>
                    </div>
                </mt-field>
                <mt-field v-model="pwd" type="password" placeholder="请输入新密码"></mt-field>
                <mt-field v-model="repwd" type="password" placeholder="请重新输入新密码"></mt-field>
            </div>
            <ui-field style="margin:50px 20px" type="slot">
                <button class="form-item-btn" @click="changePwd">提交</button>
            </ui-field>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
import dtime from "../../mixin/dtime";
export default {
    mixins: [dtime],
    components: { UiField },
    data() {
        return {
            phone: this.$route.query.phone,
            vcode: "",
            pwd: "",
            repwd: ""
        };
    },
    methods: {
        phsendCode() {
            if (!this.canSend) return;
            if (!this.phone) return this.$toast("违法进入");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            this.dTime();
            this.$post("phsendCode", {
                phone: this.phone,
                type: "pwd"
            }).then(res => {
                this.$toast("发送短信验证码成功");
            });
        },
        changePwd() {
            if (!this.phone) return this.$toast("违法进入");
            if (!this.vcode) return this.$toast("请输入验证码");
            if (!this.pwd) return this.$toast("请输入密码");
            if (!this.repwd) return this.$toast("请输入确认密码");
            if (this.repwd != this.pwd) return this.$toast("两次密码不一样");
            this.$post("changePwd", {
                phone: this.phone,
                vcode: this.vcode,
                newPWD: this.pwd
            }).then(res => {
                this.$toast("密码修改成功");
                setTimeout(() => {
                    this.$to({ name: "login" });
                }, 500);
            });
        }
    }
};
</script>

<style>
</style>
