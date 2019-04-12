<template>
    <div class="q-select">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="qq-select">
            <div class="qq-select-value" :class="{value:question.answer.value&&question.answer.value.text,'show-options':showOptions}" v-text="question.answer.value.text?question.answer.value.text:question.placeholder" @click="showOptions = !showOptions"></div>
            <div v-show="showOptions" class="qq-select-options">
                <div class="qq-select-option" :class="{active:question.answer.value&&question.answer.value.text==answer.text}" v-for="(answer,i) in question.answers" :key="i" v-text="answer.text" @click="choose(answer)"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        question: {},
        check: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false }
    },
    data() {
        return {
            showOptions: false
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
            this.showOptions = false;
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
.qq-select {
    margin-top: 10px;
    position: relative;
    .qq-select-value {
        position: relative;
        min-height: 34px;
        padding: 6px 10px;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        font-size: 14px;
        color: #999;
        &::after {
            content: "";
            position: absolute;
            top: 12px;
            right: 10px;
            border: solid 8px;
            border-color: #acacac transparent transparent;
        }
        &.value {
            font-size: 14px;
            color: #666;
            &.show-options {
                border-radius: 4px 4px 0 0;
            }
        }
    }
    .qq-select-options {
        position: absolute;
        z-index: 99;
        width: 100%;
        padding: 6px 0;
        border: 1px solid #bcbcbc;
        border-top: none;
        border-radius: 0 0 4px 4px;
        background: white;
        max-height: 200px;
        overflow: auto;
        .qq-select-option {
            padding: 6px 10px;
            font-size: 14px;
            color: #666;
            &.active {
                color: #6597ef;
            }
        }
    }
}
</style>
