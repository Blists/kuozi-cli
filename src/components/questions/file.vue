<template>
    <div class="q-file">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="qq-file">
            <div class="qq-file-input" :class="{bgno:question.answer.value&&Object.keys(question.answer.value).length>0}">
                <img class="qq-file-img" v-if="question.answer.value" :src="preImg+question.answer.value">
                <input v-if="!readonly" type="file" :accept="question.accept" :multiple="question.multiple" @change="change" :readonly="readonly">
            </div>
        </div>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    props: {
        question: {},
        check: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
    },
    data() {
        return {
            preImg: preImg
        };
    },
    methods: {
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                if (this.question.answer.value) {
                    this.question.answer.value = res;
                } else {
                    this.$set(this.question.answer, "value", res);
                }
            });
        }
    },
    computed: {
        showRequired() {
            let flag = false;
            if (this.question.required) {
                if (this.question.answer.value) {
                    flag = Object.values(this.question.answer.value).length > 0;
                }
            } else {
                flag = true;
            }
            this.question.cansub = flag;
            return !flag && this.check;
        }
    }
};
</script>

<style lang="less">
.q-file {
    .qq-file {
        margin-top: 10px;
        .qq-file-input {
            position: relative;
            width: 160px;
            height: 160px;
            margin: 0 auto;
            background: url("../../assets/img/question/Group@2x.png") no-repeat center;
            background-size: 60px auto;
            border: 1px solid #dedede;
            border-radius: 4px;
            overflow: hidden;
            > input {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            &.bgno {
                background: none;
            }
        }
        .qq-file-img {
            display: block;
            width: 160px;
            height: 160px;
        }
    }
}
</style>
