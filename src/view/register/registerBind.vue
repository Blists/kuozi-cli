<template>
    <ui-layout no-home>
        <ui-container>
            <div class="form-logo">
                <ui-field v-model="phone" placeholder="请输入手机号" hr-bottom></ui-field>
                <ui-field v-model="vcode" placeholder="请输入验证码" hr-bottom>
                    <button slot="right" class="btn-code" @click="phsendCode" v-text="vtext"></button>
                </ui-field>
                <ui-field style="margin-top:100px;" type="slot">
                    <button class="form-item-btn" @click="phverifyVcode">绑定</button>
                </ui-field>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import forward from "../../mixin/forward";
import UiField from "../../components/UiField.vue";
import dtime from "../../mixin/dtime";
export default {
    mixins: [forward, dtime],
    components: { UiField },
    data() {
        return {
            openid: this.$route.query.openid,
            phone: "",
            vcode: ""
        };
    },
    methods: {
        phsendCode() {
            if (!this.canSend) return;
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            this.$post("phsendCode", {
                phone: this.phone,
                type: "bind"
            }).then(res => {
                this.dTime();
                this.$toast("发送短信验证码成功");
            });
        },
        phverifyVcode() {
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            if (!this.vcode) return this.$toast("请输入验证码");
            this.$post("wxRegister", {
                code: this.$getParam("code"),
                username: this.phone,
                inviter: this.$getParam("inviter"),
                vcode: this.vcode,
                OPEN_ID: this.openid
            }).then(res => {
                this.forward(res, res.extInfo["x-token"]);
            });
        }
    }
};
</script>

<style lang="less">
</style>
