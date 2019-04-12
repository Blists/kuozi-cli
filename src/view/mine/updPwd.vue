<template>
    <ui-layout>
        <ui-head title="修改密码"></ui-head>
        <ui-container class="bg-gray">
            <div class="user-info">
                <ui-img :src="preImg+user.mobile"></ui-img>
                <!-- <div class="user-name" v-text='nickName'></div> -->
            </div>
            <div class="from-warp">
                <ui-field v-model="oldPwd" placeholder="请输入原来密码" inputType="password" hr-bottom></ui-field>
                <ui-field v-model="newPwd" placeholder="请输入新密码" inputType="password" hr-bottom></ui-field>
                <ui-field v-model="rePwd" placeholder="请再输入一遍新密码" inputType="password"></ui-field>
            </div>
            <div style="padding:60px 30px">
                <button class="btn1" @click="modifyPwd">确认修改</button>
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
            oldPwd: "",
            newPwd: "",
            rePwd: ""
        };
    },
    created() {
        this.user = this.Store.get("$user");
    },
    methods: {
        modifyPwd() {
            if (!this.oldPwd) return this.$toast("请输入原来密码");
            if (!this.newPwd) return this.$toast("请输入新密码");
            if (this.newPwd != this.rePwd) return this.$toast("两次输入密码不一样");
            this.$post("modifyPwd", {
                oldPwd: this.oldPwd,
                newPwd: this.newPwd
            }).then(res => {
                this.$toast("密码修改成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
