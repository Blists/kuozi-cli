<template>
    <ui-layout>
        <ui-head title="资料修改">
            <div slot="right" class="btn-text" @click="modifyMember">完成</div>
        </ui-head>
        <ui-container>
            <!-- <img :src="data" v-if="data" style="width:50%"> -->
            <div class="from-warp">
                <div class="user-info">
                    <ui-img :src="preImg+photo+v"></ui-img>
                    <!-- <ui-img :src="srcImg"></ui-img> -->
                    <div class="djxg">点击修改</div>
                    <ui-img-crop class="upd-img" @confirm="change"></ui-img-crop>
                    <!-- <div class="user-name" v-text="name"></div> -->
                </div>
                <ui-field v-model="personalInfo.nickName" label="昵称" placeholder="请填写姓名" hr-bottom :disabled="expert"></ui-field>
                <ui-field v-model="personalInfo.company" label="公司" placeholder="请填写公司" hr-bottom :disabled="expert"></ui-field>
                <ui-field v-model="personalInfo.post" label="职位" placeholder="请填写职位" hr-bottom :disabled="expert"></ui-field>
                <ui-field v-model="personalInfo.sex" label="性别" inputType="select" placeholder="请选择性别" hr-bottom>
                    <option slot="options">男</option>
                    <option slot="options">女</option>
                </ui-field>
                <ui-field v-model="personalInfo.birthday" label="生日" inputType="date"  placeholder="请选择生日" hr-bottom></ui-field>
                <ui-field v-model="personalInfo.area" label="地区" placeholder="请填写地区" hr-bottom></ui-field>
                <ui-field label="关注领域" no-input style="padding:10px 0;">
                    <div class="wh"></div>
                    <div class="select-domain">
                        <div class="select-domains">
                            <span v-for="domain in personalInfo.focusDomain" :key="domain" v-text="domain.name"></span>
                        </div>
                        <div class="select-domain-add" @click="selectDomain('关注领域','focusDomain')"></div>
                    </div>
                </ui-field>
                <ui-field label="简介" no-input no-flex>
                    <textarea v-model="personalInfo.description" class="jj-textarea" placeholder="请填写简介"></textarea>
                </ui-field>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import Vue from "vue";
import convertBase64UrlToBlob from "../../mixin/convertBase64UrlToBlob";
import { preImg } from "../../../config/project/project.env";
import UiField from "../../components/UiField.vue";
import UiImgCrop from "../../components/UiImgCrop";
export default {
    mixins: [convertBase64UrlToBlob],
    components: { UiField, UiImgCrop },
    data() {
        return {
            v: "?v=" + new Date().getTime(),
            preImg: preImg,
            expert: this.$route.query.expert === "true" || this.$route.query.expert == true,
            name: this.$route.query.name,
            photo: this.$route.query.photo,
            personalInfo: {},
            srcImg: "",
            data: ""
        };
    },
    created() {
        this.personalInfo = this.Store.get("personalInfo");
        if (!this.personalInfo) {
            this.initPersonalInfo();
            this.memberDetail();
        }
    },
    methods: {
        change(data) {
            // this.data = data;
            let formData = new FormData();
            formData.append("fileName", this.photo);
            formData.append("file", this.convertBase64UrlToBlob(data));
            this.$post("uploadHeadImg", formData).then(() => {
                this.v = "?v=" + new Date().getTime();
            });
        },
        memberDetail() {
            this.$post("memberDetail", { loginName: null }).then(res => {
                this.personalInfo = {
                    nickName: res.nickName,
                    company: res.company,
                    post: res.post,
                    sex: res.sex,
                    birthday: "",
                    focusDomain: res.focusDomain || [],
                    description: res.description,
                    area: res.area
                };
                this.expert = res.type != "11000";
                let dateFmt = Vue.filter("dateFmt");
                this.personalInfo.birthday = dateFmt(res.birthday, "yyyy-MM-dd");
            });
        },
        initPersonalInfo() {
            this.personalInfo = {
                nickName: "",
                company: "",
                post: "",
                sex: "",
                birthday: "",
                focusDomain: [],
                description: "",
                area: ""
            };
        },
        selectDomain(title, key) {
            this.Store.set("personalInfo", this.personalInfo);
            this.$to({ name: "selectDomain", query: { title: title, store: "personalInfo", key: key } });
        },
        modifyMember() {
            if (!this.personalInfo.company) return this.$toast("请填写公司");
            if (!this.personalInfo.post) return this.$toast("请填写职位");
            if (this.personalInfo.focusDomain.length == 0) return this.$toast("关注领域不能为空");
            this.$post("modifyMember", {
                nickName: this.personalInfo.nickName,
                company: this.personalInfo.company,
                post: this.personalInfo.post,
                sex: this.personalInfo.sex,
                birthday: this.personalInfo.birthday,
                focusDomain: this.personalInfo.focusDomain.map(v => v.id).join(","),
                description: this.personalInfo.description,
                area: this.personalInfo.area
            }).then(res => {
                this.Store.remove("personalInfo");
                this.$toast("修改成功");
                this.$post("memberDetail", { loginName: null }).then(r => {
                    r.name = r.nickName;
                    r.mobile = r.loginName;
                    this.Store.set("$user", r);
                    this.$back();
                });
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