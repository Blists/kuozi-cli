<template>
    <ui-layout>
        <ui-head title="明细"></ui-head>
        <ui-container class="bg-gray">
            <div class="wallet-details">
                <div class="wallet-detail">
                    <!-- <div class="wallet-time">2018年1月</div> -->
                    <div class="wallet-items">
                        <div class="wallet-item" v-for="i in items" :key="i.id">
                            <div class="wallet-item-left process">
                                <div class="process-bg"></div>
                            </div>
                            <div class="wallet-item-right">
                                <div class="flex">
                                    <div class="wallet-item-type">
                                        <span v-if="WALLET_TYPE[i.type]" v-text="WALLET_TYPE[i.type].name"></span>
                                    </div>
                                    <div class="wallet-item-money">{{i.paymentType?'+':'-'}}{{i.money|numFmtUnit(0,2)}}元</div>
                                </div>
                                <div class="wallet-item-time">{{i.startTime|dateFmt('MM-dd hh:mm:ss')}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ui-nomore :value="items" type="center"></ui-nomore>
        </ui-container>
    </ui-layout>
</template>

<script>
import { WALLET_TYPE } from "../../../utils/constants";
export default {
    data() {
        return {
            items: [],
            WALLET_TYPE: WALLET_TYPE
        };
    },
    created() {
        this.walletDetail();
    },
    methods: {
        walletDetail() {
            this.$post("walletDetail", {}).then(res => {
                this.items = res.results;
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
.wallet-details {
    .wallet-detail {
        margin: 15px;
        .wallet-time {
            padding: 5px 0;
            font-size: 18px;
            color: #999;
        }
        .wallet-items {
            background: white;
            border-radius: 8px;
            .wallet-item {
                display: flex;
                &:first-child {
                    .process {
                        &::before {
                            background: none;
                        }
                    }
                }
                &:last-child {
                    .process {
                        &::after {
                            background: none;
                        }
                    }
                }
                .wallet-item-right {
                    flex: 1;
                    padding: 18px 10px 18px 0;
                    .wallet-item-type {
                        flex: 1;
                        font-size: 16px;
                        color: #333;
                    }
                    .wallet-item-money {
                        font-size: 16px;
                        color: #333;
                    }
                    .wallet-item-time {
                        font-size: 14px;
                        color: #999;
                    }
                }
            }
        }
    }
}
</style>
