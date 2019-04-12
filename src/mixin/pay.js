import Vue from "vue";
import PayEwm from "../components/module/PayEwm.vue";
import { wxPay } from "../utils/wx";
import math from "../utils/math";
import { MTS, PAY_TYPE } from "../utils/constants";
export default {
    data() {
        return {
            math: math,
            PayEwm: null,
            withdrawMoney: 0,
            noUseText: "不使用优惠券",
            showSelectCoupon: false,
            selectCouponIndex: -1,
            canUseCoupons: []
        };
    },
    created() {
        if (this.login) {
            this.queryWithdrawMoney();
        }
    },
    mounted() {
        var PayEwmConstructor = Vue.extend(PayEwm);
        this.PayEwm = new PayEwmConstructor({ el: document.createElement("div") });
        document.body.appendChild(this.PayEwm.$el);
    },
    methods: {
        queryCanUseCoupon(type, businessId, money) {
            return new Promise((reslove, reject) => {
                this.$post("queryCanUseCoupon", { type: MTS[type].mt, businessId, money }).then(res => {
                    this.canUseCoupons = res;
                    if (res.length > 0) {
                        this.selectCouponIndex = 0;
                    }
                    reslove();
                });
            }).catch(() => {
                reject();
            });
        },
        selectCoupon(index) {
            this.selectCouponIndex = index;
            this.showSelectCoupon = false;
        },
        // 查询钱包余额
        queryWithdrawMoney() {
            return new Promise((reslove, reject) => {
                this.$get("myWallet").then(res => {
                    this.withdrawMoney = res.withdrawMoney;
                    reslove(this.withdrawMoney);
                });
            });
        },
        // 打赏
        $pay(flag, params, payType) {
            return new Promise((reslove, reject) => {
                if (PAY_TYPE[payType]) {
                    params.payType = PAY_TYPE[payType];
                }
                if (this.selectCouponIndex != -1) {
                    params.couponId = this.canUseCoupons[this.selectCouponIndex].id;
                }
                if (flag == "qb") {
                    this.$post("toPayForWallet", params).then(res => {
                        reslove(res);
                    });
                }
                // 微信打赏
                if (flag == "wx") {
                    if (this.isWx && this.$getParam("code")) {
                        params.payment = "PAYMENT_WX_NORMAL";
                        this.$post("toPayForWx", params).then(res => {
                            if (res.appid) {
                                wxPay({
                                    appid: res.appid,
                                    timeStamp: res.timeStamp,
                                    nonceStr: res.nonceStr,
                                    package: res.package1,
                                    signType: res.signType,
                                    sign: res.sign
                                }).then(r => {
                                    if (r) {
                                        reslove(res);
                                    } else {
                                        this.$toast("支付失败");
                                        reject();
                                    }
                                });
                            } else {
                                reslove(res);
                            }
                        });
                    } else {
                        params.payment = "PAYMENT_WX_SCAN";
                        this.$post("toPayForWx", params).then(res => {
                            this.PayEwm.src = res;
                            this.PayEwm.show = true;
                        });
                    }
                }
            });
        }
    },
    filters: {
        jMoney(money) {
            return `-￥${money}`;
        }
    }
};
