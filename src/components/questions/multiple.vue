<template>
    <div class="q-multiple">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="q-answers" v-for="(answer,i) in question.answers" :key="i">
            <div v-if="answer.type =='text'" class="q-answer text" :class="{active:answer.choose}" v-text="answer.text" @click="choose(i)"></div>
            <div v-if="answer.type =='img'" class="q-answer img" :class="{active:answer.choose}" @click="choose(i)">
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
        choose(i) {
            if (this.readonly) return;
            if (this.question.answers[i].choose) {
                this.question.answers[i].choose = false;
            } else {
                this.$set(this.question.answers[i], "choose", true);
            }
        }
    },
    computed: {
        showRequired() {
            let flag = false;
            if (this.question.required) {
                for (let a of this.question.answers) {
                    if (a.choose) {
                        flag = true;
                        break;
                    }
                }
            } else {
                flag = true;
            }
            this.question.cansub = flag;
            return !flag && this.check;
        }
    },
    watch: {
        showRequired() {
            if (this.showRequired) {
            }
        }
    }
};
</script>

<style lang="less">
.q-multiple {
    .q-answers {
        padding: 5px 0;
        .q-answer {
            padding: 5px 0 5px 25px;
            min-height: 20px;
            font-size: 15px;
            color: #666;
            background: url("../../assets/img/question/Group 5@2x.png") no-repeat 0 8px;
            background-size: 16px auto;
            &.active {
                background-image: url("../../assets/img/question/Group 2@2x.png");
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
