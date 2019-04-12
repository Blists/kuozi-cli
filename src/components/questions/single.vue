<template>
    <div class="q-single">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="q-answers" v-for="(answer,i) in question.answers" :key="i">
            <div v-if="answer.type =='text'" class="q-answer text" :class="{active:question.answer.value&&question.answer.value.text==answer.text}" v-text="answer.text" @click="choose(answer)"></div>
            <div v-if="answer.type =='img'" class="q-answer img" :class="{active:question.answer.value&&question.answer.value.text==answer.text}" @click="choose(answer)">
                <img :src="preImg+answer.text">
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
        readonly: { type: Boolean, default: false }
    },
    data() {
        return {
            preImg: preImg
        };
    },
    methods: {
        choose(answer) {
            if (this.readonly) return;
            if (this.question.answer.value) {
                this.question.answer.value = answer;
            } else {
                this.$set(this.question.answer, "value", answer);
            }
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
.q-single {
    .q-answers {
        padding: 5px 0;
        .q-answer {
            padding: 5px 0 5px 25px;
            min-height: 20px;
            font-size: 15px;
            color: #666;
            background: url("../../assets/img/question/Oval 4 Copy@2x.png") no-repeat 0 8px;
            background-size: 16px auto;
            &.active {
                background-image: url("../../assets/img/Oval 4@2x.png");
            }
            &.img {
                background-position: 0 center;
                > img {
                    display: block;
                    max-width: 50%;
                }
            }
        }
    }
}
</style>
