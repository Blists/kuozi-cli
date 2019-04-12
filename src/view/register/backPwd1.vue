<template>
    <ui-layout no-home>
        <ui-head title="找回密码"></ui-head>
        <ui-container class="bg-gray">
            <div class="hr-10"></div>
            <div>
                <mt-field v-model="phone" placeholder="请输入手机号"></mt-field>
            </div>
            <ui-field style="margin:50px 20px" type="slot">
                <button class="form-item-btn" @click="next">下一步</button>
            </ui-field>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
export default {
    components: { UiField },
    data() {
        return { phone: "" };
    },
    methods: {
        next() {
            if (!this.phone) return this.$toast("请输入手机号");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的手机号");
            this.$to({ name: "backPwd2", query: { phone: this.phone } });
        }
    }
};
</script>

<style>

</style>
