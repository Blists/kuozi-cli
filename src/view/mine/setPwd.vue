<template>
    <ui-layout>
        <ui-head title="设置密码"></ui-head>
        <ui-container class="bg-gray">
            <div class="user-info">
                <ui-img :src="preImg+user.mobile"></ui-img>
            </div>
            <div class="from-warp">
                <ui-field v-model="newPwd" placeholder="请输入密码" inputType="password" hr-bottom></ui-field>
                <ui-field v-model="rePwd" placeholder="请再输入一遍密码" inputType="password"></ui-field>
            </div>
            <div style="padding:60px 30px">
                <button class="btn1" @click="modifyPwd">确认</button>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import UiField from "../../components/UiField.vue";
export default {
    components: { UiField },
    data() {
        return {
            preImg: preImg,
            user: {},
            newPwd: "",
            rePwd: ""
        };
    },
    created() {
        this.user = this.Store.get("$user");
    },
    methods: {
        modifyPwd() {
            if (!this.newPwd) return this.$toast("请输入密码");
            if (this.newPwd != this.rePwd) return this.$toast("两次输入密码不一样");
            this.$post("initPwd", {
                newPwd: this.newPwd
            }).then(res => {
                this.$toast("密码设置成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
