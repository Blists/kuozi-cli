<template>
    <ui-layout>
        <ui-head title="充值" no-bottom></ui-head>
        <ui-container class="bg-gray">
            <div>
                <mt-field v-model.number="amount" placeholder="输入充值金额"></mt-field>
                <mt-cell :title="`当前余额${wallet.withdrawMoney}元`"></mt-cell>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="recharge">确认充值</button>
        </div>
    </ui-layout>
</template>

<script>
import { PAY_TYPE } from "../../../utils/constants";
import { wxPay } from "../../../utils/wx";
import pay from "../../../mixin/pay";
export default {
    mixins: [pay],
    data() {
        return {
            amount: "",
            wallet: {}
        };
    },
    created() {
        this.myWallet();
    },
    methods: {
        myWallet() {
            this.$get("myWallet").then(res => {
                this.wallet = res;
            });
        },
        recharge() {
            if (this.amount <= 0) return this.$toast("充值金额有误");
            this.$pay("wx", { amount: this.amount }, PAY_TYPE.PAY_RECHARGE).then(res => {
                this.$toast("充值成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
