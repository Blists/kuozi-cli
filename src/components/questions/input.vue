<template>
    <div class="q-input">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="qq-input">
            <input v-if="question.inpuType == 'text'||!question.inpuType" v-model="question.answer.value" type="text" :placeholder="question.placeholder" :readonly="readonly">
            <input v-if="question.inpuType == 'number'" v-model.number="question.answer.value" type="number" :placeholder="question.placeholder" :readonly="readonly">
            <input v-if="question.inpuType == 'password'" v-model.number="question.answer.value" type="password" :placeholder="question.placeholder" :readonly="readonly">
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
    > input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        font-size: 14px;
        color: #666;
        &::-webkit-input-placeholder {
            color: #999;
        }
    }
}
</style>
