<template>
    <ui-layout>
        <ui-head title="报名信息"></ui-head>
        <ui-container class="bg-gray">
            <div class="from-warp">
                <ui-field v-model="name" label="姓名" placeholder="请输入姓名" hr-bottom></ui-field>
                <ui-field v-model="company" label="公司" placeholder="请输入公司" hr-bottom></ui-field>
                <ui-field v-model="post" label="职位" placeholder="请输入职位" hr-bottom></ui-field>
                <ui-field v-model="phone" label="电话" placeholder="请输入电话" input-type="number"></ui-field>
            </div>
        </ui-container>
        <div class="bottom-btns hr-top">
            <div class="bottom-btns-text">
                活动费用：
                <span v-text="money>0?'￥'+money:'免费'"></span>
            </div>
            <button class="info" @click="sub">立即报名</button>
        </div>
        <ui-layer :show.sync="layer">
            <div class="layer-content" @click="showSelectCoupon=false">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{math.sub(money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)}}
                        <span>元</span>
                    </div>
                </div>
                <div v-if="canUseCoupons.length>0" class="use-coupon">
                    <div v-if="selectCouponIndex==-1" class="use-coupon-selected" :class="{active:showSelectCoupon}" @click.stop="showSelectCoupon=!showSelectCoupon">
                        <span class="use-coupon-selected-text" v-text="noUseText"></span>
                    </div>
                    <div v-else class="use-coupon-selected" :class="{active:showSelectCoupon}" @click.stop="showSelectCoupon=!showSelectCoupon">
                        <span class="use-coupon-selected-text active" v-text="canUseCoupons[selectCouponIndex].name"></span>
                        <span class="use-coupon-selected-money">{{canUseCoupons[selectCouponIndex].value|jMoney}}</span>
                    </div>
                    <div class="use-coupon-options" v-show="showSelectCoupon">
                        <div class="use-coupon-option" @click="selectCoupon(-1)">
                            <span class="use-coupon-option-text" :class="{active:selectCouponIndex==-1}" v-text="noUseText"></span>
                        </div>
                        <div class="use-coupon-option hr-top" v-for="(v,i) in canUseCoupons" :key="i" @click="selectCoupon(i)">
                            <span class="use-coupon-option-text" :class="{active:selectCouponIndex==i}" v-text="v.name"></span>
                            <span class="use-coupon-option-money">{{v.value|jMoney}}</span>
                        </div>
                    </div>
                </div>
                <div v-if="math.sub(money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)>withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                <div class="cell-btn" @click="pay('wx')">微信支付</div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
import UiLayer from "../../components/UiLayer.vue";
import pay from "../../mixin/pay";
export default {
    mixins: [pay],
    components: { UiField, UiLayer },
    data() {
        return {
            activityId: this.$route.query.activityId,
            type: this.$route.query.type,
            money: this.$route.query.money,
            layer: false,
            name: "",
            company: "",
            post: "",
            phone: ""
        };
    },
    methods: {
        sub() {
            if (!this.name) return this.$toast("请输入姓名");
            if (!this.company) return this.$toast("请输入公司");
            if (!this.post) return this.$toast("请输入职位");
            if (!this.phone) return this.$toast("请输入电话");
            if (!/^1[3|4|5|7|8]\d{9}$/.test(this.phone)) return this.$toast("请输入正确的电话");
            if (this.money > 0) {
                this.queryCanUseCoupon("Activity", this.activityId, this.money).then(() => {
                    this.layer = true;
                });
            } else {
                this.$post("enroolActivity", {
                    activityId: this.activityId,
                    name: this.name,
                    company: this.company,
                    post: this.post,
                    phone: this.phone,
                    type: this.type
                }).then(res => {
                    this.$toast("报名成功");
                    this.$back();
                });
            }
        },
        pay(flag) {
            this.$pay(
                flag,
                {
                    activityId: this.activityId,
                    name: this.name,
                    company: this.company,
                    post: this.post,
                    phone: this.phone,
                    type: this.type
                },
                "PAY_ACTIVITY_SIGNUP"
            ).then(() => {
                this.layer = false;
                this.$toast("报名成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
</style>
