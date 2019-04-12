<template>
    <ui-layout>
        <ui-head title="提现" no-bottom></ui-head>
        <ui-container class="bg-gray">
            <div>
                <mt-field v-model.number="amount" placeholder="输入提现金额"></mt-field>
                <mt-cell :title="`可提现金额${wallet.withdrawMoney}元`"></mt-cell>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="withdrawal">确认申请提现</button>
        </div>
    </ui-layout>
</template>

<script>
export default {
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
        withdrawal() {
            if (this.amount <= 0) return this.$toast("提现金额有误");
            if (this.amount > this.wallet.withdrawMoney) return this.$toast("提现金额不能大于可提现金额");
            this.$post("withdrawal", {
                money: this.amount
            }).then(res => {
                this.$toast("提现申请成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
