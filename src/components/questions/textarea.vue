<template>
    <div class="q-input">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="qq-input">
            <textarea v-model="question.answer.value" type="text" :rows="question.row||8" :placeholder="question.placeholder" :readonly="readonly"></textarea>
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
.qq-input {
    margin-top: 10px;
    > textarea {
        width: 100%;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 14px;
        color: #666;
        resize: none;
        &::-webkit-input-placeholder {
            color: #999;
        }
    }
}
</style>
