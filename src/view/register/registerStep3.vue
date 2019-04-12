<template>
    <ui-layout no-home>
        <ui-container style="padding-top:50px;">
            <div class="from-warp">
                <div class="user-info">
                    <ui-img v-show="photo" :src="preImg+photo+v"></ui-img>
                    <div class="djxg">点击修改</div>
                    <ui-img-crop class="upd-img" @confirm="change"></ui-img-crop>
                </div>
                <ui-field v-model="info.nickName" label="姓名" placeholder="请填写姓名" hr-bottom></ui-field>
                <ui-field v-model="info.company" label="公司" placeholder="请填写公司" hr-bottom></ui-field>
                <ui-field v-model="info.post" label="职位" placeholder="请填写职位" hr-bottom></ui-field>
                <ui-field label="简介" no-input no-flex>
                    <textarea v-model="info.description" class="jj-textarea" placeholder="请填写简介"></textarea>
                </ui-field>
                <ui-field type="slot" style="margin-top:40px;">
                    <button class="form-item-btn" @click="sub">确定</button>
                </ui-field>
                <ui-field type="slot" style="margin-top:20px;">
                    <div class="more-btn">
                        <button @click="$to({name:'home'})">跳过</button>
                    </div>
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
import forward from "./../../mixin/forward.js";
export default {
    mixins: [forward, convertBase64UrlToBlob],
    components: { UiField, UiImgCrop },
    data() {
        return {
            preImg: preImg,
            v: "?v=" + new Date().getTime(),
            photo: "",
            info: {
                nickName: "",
                company: "",
                post: "",
                description: ""
            }
        };
    },
    created() {
        let user = this.Store.get("$user");
        this.photo = user.mobile;
    },
    methods: {
        change(data) {
            let formData = new FormData();
            formData.append("fileName", this.photo);
            formData.append("file", this.convertBase64UrlToBlob(data));
            this.$post("uploadHeadImg", formData).then(() => {
                this.v = "?v=" + new Date().getTime();
            });
        },
        sub() {
            if (!this.info.nickName) return this.$toast("请填写姓名");
            if (!this.info.company) return this.$toast("请填写公司");
            if (!this.info.post) return this.$toast("请填写职位");
            if (!this.info.description) return this.$toast("请填写简介");
            this.$post("completeMemberInfo", this.info).then(res => {
                let path = sessionStorage.getItem("$path") || false;
                if (path && path != "/" && !/^\/index/.test(path) && !/^\/login/.test(path)) {
                    this.$to({ path: path });
                } else {
                    this.$to({ name: "home" });
                }
                sessionStorage.removeItem("$path");
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