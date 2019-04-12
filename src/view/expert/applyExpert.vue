<template>
    <ui-layout>
        <ui-head title="成为达人"></ui-head>
        <ui-container>
            <div class="from-warp">
                <div class="user-info">
                    <ui-img :src="preImg+photo"></ui-img>
                    <div class="user-name" v-text="name"></div>
                </div>
                <ui-field v-model="applyMaster.name" label="姓名 (必填）" placeholder="请填写姓名" hr-bottom></ui-field>
                <ui-field v-model="applyMaster.company" label="公司 (必填）" placeholder="请填写公司" hr-bottom></ui-field>
                <ui-field v-model="applyMaster.post" label="职位 (必填）" placeholder="请填写职位" hr-bottom></ui-field>
                <ui-field label="关注领域" no-input style="padding:10px 0;">
                    <div class="wh"></div>
                    <div class="select-domain">
                        <div class="select-domains">
                            <span v-for="domain in applyMaster.focusDomain" :key="domain" v-text="domain.name"></span>
                        </div>
                        <div class="select-domain-add" @click="selectDomain('关注领域','focusDomain')"></div>
                    </div>
                </ui-field>
                <ui-field label="所属领域" no-input style="padding:10px 0;">
                    <div class="wh bg" @click="layer.layer1=true"></div>
                    <div class="select-domain">
                        <div class="select-domains">
                            <span v-for="domain in applyMaster.myDomain" :key="domain" v-text="domain.name"></span>
                        </div>
                        <div class="select-domain-add" @click="selectDomain('所属领域','myDomain')"></div>
                    </div>
                </ui-field>
                <ui-field label="简介 (必填）" no-input no-flex>
                    <textarea v-model="applyMaster.description" class="jj-textarea" placeholder="请填写简介"></textarea>
                </ui-field>
                <!-- <ui-field label="名片附件 (选填）" no-input no-flex>
                    <div class="mpfj add">
                        <ui-img src=""></ui-img>
                        <input type="file">
                    </div>
                </ui-field> -->
                <ui-field no-input style="padding:30px 10px;">
                    <button class="btn1" @click="doApplyMaster">申请成为达人</button>
                </ui-field>
                <ui-field type="slot" style="padding-bottom:50px;">
                    <div class="register-read" :class="{active:read}" @click="read=!read">我已阅读同意
                        <ui-read text="《期望财经达人服务协议》" :id="1002"></ui-read>
                    </div>
                </ui-field>
            </div>
        </ui-container>
        <ui-layer :show.sync="layer.layer1">
            <div class="layer-content">
                <div class="info-more-content">
                    请选择与您公司、工作或职业相关的领域
                </div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import UiField from "../../components/UiField.vue";
import UiRead from "../../components/UiRead.vue";
import UiLayer from "../../components/UiLayer.vue";
export default {
    components: { UiField, UiRead, UiLayer },
    data() {
        return {
            preImg: preImg,
            name: this.$route.query.name,
            photo: this.$route.query.photo,
            applyMaster: {},
            layer: { layer1: false },
            read: false
        };
    },
    created() {
        this.applyMaster = this.Store.get("applyMaster");
        if (!this.applyMaster) {
            this.initApplyMaster();
        }
    },
    methods: {
        initApplyMaster() {
            this.applyMaster = {
                name: "",
                company: "",
                post: "",
                description: "",
                focusDomain: [],
                myDomain: []
            };
        },
        selectDomain(title, key) {
            this.Store.set("applyMaster", this.applyMaster);
            this.$to({ name: "selectDomain", query: { title: title, store: "applyMaster", key: key } });
        },
        doApplyMaster() {
            if (!this.applyMaster.name) return this.$toast("请填写姓名");
            if (!this.applyMaster.company) return this.$toast("请填写公司");
            if (!this.applyMaster.post) return this.$toast("请填写职位");
            if (this.applyMaster.focusDomain.length == 0) return this.$toast("关注领域不能为空");
            if (this.applyMaster.myDomain.length == 0) return this.$toast("所属领域不能为空");
            if (!this.read) return this.$toast("请先同意《期望财经达人服务协议》");
            this.$post("applyMaster", {
                nickName: this.applyMaster.name,
                company: this.applyMaster.company,
                post: this.applyMaster.post,
                description: this.applyMaster.description,
                focusDomain: this.applyMaster.focusDomain.map(v => v.id).join(","),
                myDomain: this.applyMaster.myDomain.map(v => v.id).join(",")
            }).then(res => {
                this.Store.remove("applyMaster");
                this.$toast("申请成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
.select-domain {
    display: flex;
    flex: 1;
    .select-domains {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 7px 0;
        flex: 1;
        > span {
            display: inline-block;
            padding: 6px 8px;
            margin: 7px 7px 0 0;
            border: 1px solid #999;
            border-radius: 4px;
            font-size: 14px;
            color: #666;
        }
    }
    .select-domain-add {
        width: 32px;
        height: 32px;
        margin: 7px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #eee url("../../assets/img/Group@2x 5.png") no-repeat center;
        background-size: 12px 12px;
    }
}
.wh {
    width: 40px;
    &.bg {
        background: url("../../assets/img/Group@2x 4.png") no-repeat 5px center;
        background-size: 15px 15px;
    }
}
.jj-textarea {
    width: 100%;
    height: 80px;
    font-size: 14px;
    padding: 10px;
    border: 1px solid #afafaf;
    border-radius: 6px;
    resize: none;
}
.mpfj {
    position: relative;
    width: 150px;
    height: 90px;
    margin: 10px auto 30px auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    &.add {
        background: url("../../assets/img/Group@2x 5.png") no-repeat center;
        background-size: 45px 45px;
    }
    > input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}
</style>
