<template>
    <ui-layout>
        <ui-head title="意见反馈"></ui-head>
        <ui-container class="bg-gray">
            <div class="form-vertical">
                <div class="form-label">问题和意见</div>
                <div class="form-field hr-top hr-bottom">
                    <textarea v-model="content" placeholder="简要描述您要反馈的问题和意见" rows="5"></textarea>
                </div>
            </div>
            <div class="form-vertical">
                <div class="form-label">图片（选填）</div>
                <div class="form-field hr-top hr-bottom">
                    <div class="form-file">
                        <ui-img v-if="images" :src="preImg+images"></ui-img>
                        <div v-else class="form-file-add"></div>
                        <input type="file" @change="change">
                    </div>
                </div>
            </div>
            <div class="form-vertical">
                <div class="form-label">联系方式</div>
                <div class="form-field hr-top hr-bottom">
                    <input v-model="mobile" type="text" placeholder="手机号/微信">
                </div>
                <div class="form-tip">您的联系方式有助于我们沟通和解决问题，仅工作人员可见</div>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1" @click="optionSave">提交反馈</button>
        </div>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            content: "",
            images: "",
            mobile: ""
        };
    },
    methods: {
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.images = res;
            });
        },
        optionSave() {
            if (!this.content) return this.$toast("问题和意见不能为空");
            if (!this.mobile) return this.$toast("联系方式不能为空");
            this.$post("optionSave", {
                content: this.content,
                images: this.images,
                mobile: this.mobile
            }).then(res => {
                this.$toast("平台已接受用户反馈，尽快处理");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
.form-vertical {
    .form-label {
        padding: 15px;
        font-size: 14px;
        color: #666;
    }
    .form-field {
        background: white;
        padding: 15px;
        .form-file {
            position: relative;
            .form-file-add,
            img {
                display: block;
                width: 60px;
                height: 60px;
                border-radius: 4px;
            }
            .form-file-add {
                background: url("../../assets/img/Group@2x 5.png") no-repeat center;
                background-size: 20px auto;
                border: 1px solid #ccc;
            }
            input {
                position: absolute;
                width: 60px;
                height: 60px;
                top: 0;
                left: 0;
                opacity: 0;
            }
        }
        > textarea,
        input {
            width: 100%;
            resize: none;
            font-size: 16px;
            color: #333;
            &::-webkit-input-placeholder {
                font-size: 16px;
                color: #999999;
            }
        }
    }
    .form-tip {
        padding: 10px 15px;
        font-size: 12px;
        color: #9b9b9b;
    }
}
</style>
