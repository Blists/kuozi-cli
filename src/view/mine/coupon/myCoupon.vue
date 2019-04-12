<template>
    <ui-layout>
        <ui-head title="我的优惠券"></ui-head>
        <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="tab.activeTab=t.key"></span>
            </div>
        </div>
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.nouse.key" :bottom-method="loadmore1" :bottom-all-loaded="coupons1.allLoaded" ref="loadmore1">
                <div class="coupons">
                    <!-- <div class="coupon" v-for="(coupon,i) in coupons" :key="coupon.id" :class="['coupon'+(i-1)%4,{outdated:tab.activeTab==tab.tabs.outdated.key}]" @click="$to({name:'couponDetail'})"> -->
                    <div class="coupon" v-for="(coupon,i) in coupons1.list" :key="coupon.id" :class="['coupon'+(i-1)%4,{outdated:tab.activeTab==tab.tabs.outdated.key}]">
                        <div class="coupon-info">
                            <div class="coupon-name" v-text='coupon.name'></div>
                            <div class="coupon-time">{{coupon.createtime|dateFmt('yyyy.MM.dd')}}—{{coupon.outtime|dateFmt('yyyy.MM.dd')}}</div>
                        </div>
                        <div class="coupon-money">¥
                            <span v-text="coupon.value"></span>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.outdated.key" :bottom-method="loadmore2" :bottom-all-loaded="coupons2.allLoaded" ref="loadmore2">
                <div class="coupons">
                    <!-- <div class="coupon" v-for="(coupon,i) in coupons2" :key="coupon.id" :class="['coupon'+(i-1)%4,'outdated']" @click="$to({name:'couponDetail'})"> -->
                    <div class="coupon" v-for="(coupon,i) in coupons2.list" :key="coupon.id" :class="['coupon'+(i-1)%4,'outdated']">
                        <div class="coupon-info">
                            <div class="coupon-name" v-text='coupon.name'></div>
                            <div class="coupon-time">{{coupon.createtime|dateFmt('yyyy.MM.dd')}}—{{coupon.outtime|dateFmt('yyyy.MM.dd')}}</div>
                        </div>
                        <div class="coupon-money">¥
                            <span v-text="coupon.value"></span>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            tab: {
                activeTab: "nouse",
                tabs: {
                    nouse: {
                        name: "未使用",
                        key: "nouse"
                    },
                    outdated: {
                        name: "已过期",
                        key: "outdated"
                    }
                }
            },
            coupons1: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                state: "0"
            },
            coupons2: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                state: "2"
            }
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryCoupon", "coupons1");
        },
        loadmore2() {
            this.LoadMore("queryCoupon", "coupons2");
        },
        queryCoupon(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryCoupon", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        state: obj.state //0：未使用 1：已使用 2：失效',
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
.coupons {
    .coupon {
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        margin: 20px 10px;
        .coupon-info {
            display: flex;
            flex-direction: column;
            padding: 19px 0;
            flex: 1;
            font-size: 14px;
            background: white;
            padding-left: 10px;
            .coupon-name {
                color: #4a4a4a;
            }
            .coupon-time {
                color: #9b9b9b;
            }
        }
        .coupon-money {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            margin-left: 10px;
            background: #fa9d9d;
            font-size: 20px;
            color: white;
            &::before {
                content: "";
                position: absolute;
                width: 26px;
                height: 26px;
                top: -13px;
                left: -18px;
                border-radius: 100%;
                background: @gray;
            }
            &::after {
                content: "";
                position: absolute;
                width: 26px;
                height: 26px;
                bottom: -13px;
                left: -18px;
                border-radius: 100%;
                background: @gray;
            }
        }
        &.coupon0 {
            .coupon-money {
                background: #fa9d9d;
            }
        }
        &.coupon1 {
            .coupon-money {
                background: #fb7d75;
            }
        }
        &.coupon2 {
            .coupon-money {
                background: #6597ef;
            }
        }
        &.coupon3 {
            .coupon-money {
                background: #fccb6c;
            }
        }
        &.outdated {
            position: relative;
            &::after {
                content: "";
                position: absolute;
                top: 0;
                right: 65px;
                width: 75px;
                height: 100%;
                background: url(../../../assets/img/outdated.png) no-repeat center;
                background-size: auto 75px;
            }

            .coupon-money {
                background: #ccc;
            }
        }
    }
}
</style>
