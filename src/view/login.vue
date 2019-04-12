<template>
    <ui-layout no-home>
        <ui-container>
            <div class="form-logo">
                <ui-field v-model="phone" placeholder="请输入手机号" hr-bottom></ui-field>
                <ui-field v-if="loginStyle=='pwd'" v-model="password" placeholder="请输入密码" input-type="password" hr-bottom></ui-field>
                <ui-field v-if="loginStyle=='code'" v-model="vcode" placeholder="请输入验证码" hr-bottom>
                    <button slot="right" class="btn-code" @click="phsendCode" v-text="vtext"></button>
                </ui-field>
                <ui-field type="slot">
                    <div v-if="loginStyle=='pwd'" class="form-item-text" @click="loginStyle='code'">手机验证码登录</div>
                    <div v-if="loginStyle=='code'" class="form-item-text" @click="loginStyle='pwd'">密码登录</div>
                </ui-field>
                <ui-field type="slot">
                    <button class="form-item-btn" @click="phoneLogin">登录</button>
                </ui-field>
                <ui-field type="slot">
                    <div class="more-btn split">
                        <button @click="$to({name:'registerStep1'})">注册</button>
                    </div>
                    <div class="more-btn">
                        <button @click="$to({name:'backPwd1'})">忘记密码</button>
                    </div>
                </ui-field>
                <ui-field type="slot" v-if="isWx">
                    <div class="three-login">
                        <div class="three-login-text">第三方登录</div>
                        <div class="three-login-btns">
                            <button class="wx" @click="toWx"></button>
                        </div>
                    </div>
                </ui-field>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiField from "../components/UiField.vue";
import forward from "../mixin/forward";
import dtime from "../mixin/dtime";
import { STRING } from "../utils/constants";
export default {
    mixins: [forward, dtime],
    components: { UiField },
    data() {
        return {
            from: this.$route.query.from,
            loginStyle: "pwd", // pwd：密码登录 code：验证码登录
            phone: "",
            password: "",
            vcode: ""
        };
    },
    created() {
        if (process.env.NODE_ENV == "dev") {
            this.phone = "18016371782";
            this.password = "123123";
        }
    },
    methods: {
        phsendCode() {
            if (!this.canSend) return;
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            this.$post("phsendCode", {
                phone: this.phone,
                type: "login"
            }).then(res => {
                this.dTime();
                this.$toast("发送短信验证码成功");
            });
        },
        phoneLogin() {
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            if (this.loginStyle == "pwd") {
                if (!this.password) return this.$toast("请输入密码");
                this.loginByPwd();
            }
            if (this.loginStyle == "code") {
                if (!this.vcode) return this.$toast("请输入验证码");
                this.loginByPhone();
            }
        },
        loginByPwd() {
            this.$post("loginByPwd", {
                phone: this.phone,
                password: this.password
            }).then(res => {
                this.forward(res, res.extInfo && res.extInfo["x-token"], this.from == this.phone);
            });
        },
        loginByPhone() {
            this.$post("loginByPhone", {
                phone: this.phone,
                vcode: this.vcode
            }).then(res => {
                this.forward(res, res.extInfo && res.extInfo["x-token"], this.from == this.phone);
            });
        },
        toWx() {
            window.location.href = "redirect.html?v=" + new Date().getTime() + "&action=" + STRING.WXLOGIN;
        }
    }
};
</script>

<style lang="less">
</style>
