<template>
    <ui-layout no-home>
        <ui-container>
            <div class="form-logo">
                <ui-field v-model="phone" placeholder="请输入手机号" hr-bottom></ui-field>
                <ui-field v-model="vcode" placeholder="请输入验证码" hr-bottom>
                    <button slot="right" class="btn-code" @click="phsendCode" v-text="vtext"></button>
                </ui-field>
                <ui-field type="slot">
                    <div class="form-item-text" @click="$to({name:'login'})">已有账号？请登录</div>
                </ui-field>
                <ui-field type="slot">
                    <button class="form-item-btn" @click="phverifyVcode">下一步</button>
                </ui-field>
                <ui-field type="slot">
                    <div class="register-read" :class="{active:read}" @click="read=!read">我已阅读同意
                        <ui-read text="《用户注册协议》" :id="1000"></ui-read>和<ui-read text="《期望财经发布规则》" :id="1001"></ui-read>
                    </div>
                </ui-field>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
import UiRead from "../../components/UiRead.vue";
import dtime from "../../mixin/dtime";
export default {
    mixins: [dtime],
    components: { UiField, UiRead },
    data() {
        return {
            phone: "",
            vcode: "",
            read: false
        };
    },
    methods: {
        phsendCode() {
            if (!this.canSend) return;
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            this.$post("phsendCode", {
                phone: this.phone,
                type: "register"
            }).then(() => {
                this.dTime();
                this.$toast("发送短信验证码成功");
            });
        },
        phverifyVcode() {
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            if (!this.vcode) return this.$toast("请输入验证码");
            if (!this.read) return this.$toast("请先同意《用户注册协议》和《期望财经发布规则》");
            this.$post("phverifyVcode", {
                phone: this.phone,
                vcode: this.vcode
            }).then(res => {
                this.$to({ name: "registerStep2", query: { username: this.phone } });
            });
        }
    }
};
</script>

<style lang="less">

</style>
