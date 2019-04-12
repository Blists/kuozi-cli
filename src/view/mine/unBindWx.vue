<template>
    <ui-layout>
        <ui-head title="解除绑定"></ui-head>
        <ui-container class="bg-gray">
            <div class="ybdsj">
                已绑定手机：
                <span v-text="phone"></span>
            </div>
            <div>
                <mt-field v-model="vcode" placeholder="请输入验证码">
                    <div class="form-item">
                        <button class="btn-code" @click="phsendCode" v-text="vtext"></button>
                    </div>
                </mt-field>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="unBind">解除绑定</button>
        </div>
    </ui-layout>
</template>

<script>
import dtime from "../../mixin/dtime";
export default {
    mixins: [dtime],
    data() {
        return {
            phone: this.$route.query.phone,
            vcode: ""
        };
    },
    methods: {
        phsendCode() {
            this.dTime();
        },
        unBind() {}
    }
};
</script>

<style>
.ybdsj {
    padding: 22px 10px;
    font-size: 18px;
    color: #333;
}
</style>
