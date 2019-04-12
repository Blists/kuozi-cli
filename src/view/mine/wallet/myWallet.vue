<template>
    <ui-layout>
        <ui-head title="我的钱包">
            <div slot="right" class="btn-text" @click="$to({name:'walletDetail'})">明细</div>
        </ui-head>
        <ui-container class="bg-gray">
            <div class="wallet-warp">
                <div class="wallet">
                    <div class="wallet-lq">
                        <span>我的零钱</span>
                        <span class="wallet-no">
                            ￥{{wallet.withdrawMoney|numFmtUnit(0,2)}}
                        </span>
                    </div>
                    <div class="wallet-cz">
                        <button @click="to('walletRecharge','充值')">充值</button>
                    </div>
                </div>
            </div>
            <div>
                <mt-cell>
                    <div slot="title">
                        <span>可提现金额</span>
                        <span class="info-more" @click="layer.layer2=true"></span>
                    </div>
                    <span>￥{{wallet.withdrawMoney|numFmtUnit(0,2)}}</span>
                </mt-cell>
                <mt-cell>
                    <div slot="title">
                        <span>待结算金额</span>
                        <span class="info-more" @click="layer.layer3=true"></span>
                    </div>
                    <span>￥{{wallet.waitSettlement|numFmtUnit(0,2)}}</span>
                </mt-cell>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="to('walletWithdrawal','提现')">提现</button>
        </div>
        <ui-root>
            <ui-layer :show.sync="layer.layer1">
                <div class="layer-content">
                    <div class="bd-text">需要先绑定微信才能
                        <span v-text="text"></span>
                    </div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn text-info" @click="bindWx">去绑定</button>
                        <button class="layer-btn" @click="layer=false">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer2">
                <div class="layer-content">
                    <div class="info-more-content">
                        此显示金额可提现至微信零钱包，平台将收取10%的服务费
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer3">
                <div class="layer-content">
                    <div class="info-more-content">
                        待结算金额为提现进行中的金额，请耐心等待提现到账
                    </div>
                </div>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>

<script>
import UiRoot from "../../../components/UiRoot.vue";
import UiLayer from "../../../components/UiLayer.vue";
import bindWx from "../../../mixin/bindWx";
export default {
    mixins: [bindWx],
    components: { UiRoot, UiLayer },
    data() {
        return {
            wallet: {},
            layer: { layer1: false, layer2: false, layer3: false },
            text: ""
        };
    },
    async created() {
        await this.DoBind();
        this.myWallet();
    },
    methods: {
        myWallet() {
            this.$get("myWallet").then(res => {
                this.wallet = res;
            });
        },
        to(name, text) {
            if (this.wallet.wxAccount) {
                this.$to({ name: name });
            } else {
                this.text = text;
                this.layer.layer1 = true;
            }
        },
        async bindWx() {
            try {
                await this.BindWx();
                this.$toast("绑定成功");
            } catch (error) {
                this.wallet.wxAccount = true;
                this.layer.layer1 = false;
            }
        }
    }
};
</script>

<style lang="less">
.wallet-warp {
    background: white;
    padding: 20px 10px;
    .wallet {
        position: relative;
        height: 140px;
        border-radius: 8px;
        background: linear-gradient(to right, #eb79ee, #f5cb73) no-repeat;
        background-size: 100% 100%;
        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("../../../assets/img/红包@2x.png") no-repeat 0 100%;
            background-size: auto 110px;
        }
        .wallet-lq {
            padding-left: 10px;
            line-height: 140px;
            font-size: 18px;
            color: white;
            .wallet-no {
                font-size: 28px;
            }
        }
        .wallet-cz {
            position: absolute;
            right: 10px;
            bottom: 15px;
            > button {
                width: 70px;
                height: 30px;
                border: 1px solid white;
                border-radius: 4px;
                font-size: 16px;
                color: white;
            }
        }
    }
}
.bd-text {
    padding: 40px 0;
    text-align: center;
    font-size: 16px;
    color: #f45574;
}
</style>
