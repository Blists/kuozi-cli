<template>
    <ui-layout>
        <ui-head>
            <div slot="title">
                <div class="head-title-line1">提问</div>
                <div class="head-title-line2" v-text="name"></div>
            </div>
            <div @click="postsSave" class="btn-text" slot="right">提交</div>
        </ui-head>
        <ui-container v-show="show">
            <ui-input v-model="question" :placeholder="placeholder" :limit="300" no-photo>
                <div class="flex-1 text-info" v-if="money>0" slot="bottom">每个问题：￥{{money}}</div>
            </ui-input>
        </ui-container>
        <ui-layer :show.sync="layer">
            <div class="layer-content overflow-hidden">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{money}}
                        <span>元</span>
                    </div>
                </div>
                <div v-if="money>wallet.withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                <div class="cell-btn" @click="pay('wx')">微信支付</div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import UiInput from "../../components/UiInput.vue";
import UiLayer from "../../components/UiLayer.vue";
import pay from "../../mixin/pay";
export default {
    components: { UiInput, UiLayer },
    mixins: [pay],
    data() {
        return {
            show: false,
            preImg: preImg,
            groupId: this.$route.query.groupId,
            name: this.$route.query.name,
            user: this.$route.query.user,
            money: this.$route.query.money || 0,
            placeholder: this.$route.query.placeholder || "提问被回答后，将公开在圈子内",
            question: {},
            wallet: {},
            layer: false
        };
    },
    created() {
        this.myWallet();
        if (this.groupId) {
            this.show = true;
        } else {
            this.memberDetail();
        }
    },
    methods: {
        memberDetail() {
            this.$post("memberDetail", {loginName: this.user}).then(res => {
                this.show = true;
                this.money = res.money || 0;
            });
        },
        myWallet() {
            this.$get("myWallet").then(res => {
                this.wallet = res;
            });
        },
        postsSave() {
            if (!this.question.content) return this.$toast("提问内容不能为空");
            if (this.money > 0) {
                this.layer = true;
            } else {
                let param = {
                    type: 3,
                    target: this.user,
                    question: this.question.content,
                    imgs: this.question.imgs.join(",")
                };
                // 圈内提问type3  达人提问1
                if (this.groupId) {
                    param.groupId = this.groupId;
                    param.type = 1;
                }
                this.$post("postsSave", param).then(res => {
                    this.$toast("提问成功");
                    this.$back();
                });
            }
        },
        pay(flag) {
            let param = {
                amount: this.money,
                type: 3,
                target: this.user,
                question: this.question.content,
                imgs: this.question.imgs.join(",")
            };
            // 圈内提问type3  达人提问1
            if (this.groupId) {
                param.groupId = this.groupId;
                param.type = 1;
            }
            this.$pay(flag, param, "PAY_ASK_QUESTION").then(() => {
                this.$toast("提问成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
