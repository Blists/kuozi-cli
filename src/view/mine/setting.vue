<template>
    <ui-layout>
        <ui-head title="设置"></ui-head>
        <ui-container class="bg-gray">
            <div>
                <mt-cell title="修改信息" is-link @click.native="personalInfoUpd"></mt-cell>
                <mt-cell v-if="pwdIsEmpty==true||pwdIsEmpty=='true'" title="设置密码" is-link @click.native="$to({name:'setPwd'})"></mt-cell>
                <mt-cell v-else title="修改密码" is-link @click.native="$to({name:'updPwd'})"></mt-cell>
                <mt-cell v-if="wallet.wxAccount" title="绑定微信" value="已绑定" is-link></mt-cell>
                <mt-cell v-else title="绑定微信" value="未绑定" is-link @click.native="bindWx"></mt-cell>
                <!-- <mt-cell title="绑定微信" value="未绑定" is-link @click.native="bindWx"></mt-cell> -->
                <mt-cell title="意见反馈" is-link @click.native="$to({name:'contactUs'})"></mt-cell>
                <mt-cell v-if="expert===true||expert=='true'" title="提问价格" is-link :value="showPrice/1==0?'免费':'￥'+showPrice" @click.native="layer=true"></mt-cell>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="logout">退出登录</button>
        </div>
        <ui-layer :show.sync="layer" @close="close">
            <div class="layer-content">
                <div class="twjg">
                    <div class="twjg-title">提问价格</div>
                    <div class="twjg-btns">
                        <div class="twjg-btn" v-for="i in prices" :key="i">
                            <button :class="{active:price==i}" @click="price=i">
                                <span v-text="i"></span>元</button>
                        </div>
                        <div class="twjg-btn">
                            <button :class="{active:price==0}" @click="price=0">免费</button>
                        </div>
                        <div class="twjg-btn">
                            <button @click="show=true">自定义</button>
                        </div>
                    </div>
                    <div v-if="show" class="twjg-input">
                        <input v-model='price' type="number" placeholder="请输入提问价格">
                    </div>
                </div>
                <div class="layer-btns hr-top">
                    <button class="layer-btn text-info" @click="askQuestionMoney">确定</button>
                    <button class="layer-btn" @click="close">取消</button>
                </div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import UiField from "../../components/UiField.vue";
import UiLayer from "../../components/UiLayer.vue";
import bindWx from "../../mixin/bindWx";
export default {
    mixins: [bindWx],
    components: { UiField, UiLayer },
    data() {
        return {
            expert: this.$route.query.expert,
            nickName: this.$route.query.nickName,
            loginName: this.$route.query.loginName,
            pwdIsEmpty: this.$route.query.pwdIsEmpty,
            showPrice: this.$route.query.price || 0,
            price: this.$route.query.price,
            show: false,
            prices: [10, 20, 50, 100, 200, 500, 1000],
            layer: false,
            wallet: {},
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
        personalInfoUpd() {
            this.Store.remove("personalInfo");
            this.$to({ name: "personalInfoUpd", query: { expert: this.expert, name: this.nickName, photo: this.loginName } });
        },
        logout() {
            this.Store.remove("$token");
            this.Store.remove("$user");
            window.login = false;
            this.$to({ name: "home" });
        },
        askQuestionMoney() {
            this.$post("askQuestionMoney", { money: this.price }).then(() => {
                this.showPrice = this.price;
                this.close();
            });
        },
        close() {
            this.price = this.showPrice;
            this.show = false;
            this.layer = false;
        },
        async bindWx() {
            let res = await this.$messagebox({
                title: "提示",
                message: "是否绑定微信?",
                showCancelButton: true
            });
            if (res == "confirm") {
                try {
                    await this.BindWx();
                    this.$toast("绑定成功");
                } catch (error) {
                    this.wallet.wxAccount = true;
                }
            }

        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
</style>
