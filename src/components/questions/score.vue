<template>
    <div class="q-score">
        <div class="q-title" v-text="question.text" :class="{required:question.required}"></div>
        <div class="q-required" v-if="showRequired">请填写此项</div>
        <div class="qq-scores">
            <template v-for="i in question.max">
                <div v-if="i<question.min" class="qq-score active disabled" :key="i"></div>
                <div v-if="i==question.min" class="qq-score active" :key="i" @click="choose(i)"></div>
                <div v-if="i>question.min" class="qq-score" :class="{active:i<=question.answer.value}" :key="i" @click="choose(i)"></div>
            </template>
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
    created() {
        if (!this.question.answer.value) {
            if (this.question.answer.value) {
                this.question.answer.value = this.question.min;
            } else {
                this.$set(this.question.answer, "value", this.question.min);
            }
        }
    },
    methods: {
        choose(i) {
            if (this.readonly) return;
            if (i == this.question.answer.value) {
                this.question.answer.value = this.question.min;
            } else {
                this.question.answer.value = i;
            }
        }
    },
    computed: {
        showRequired() {
            let flag = false;
            if (this.question.required) {
                flag = this.question.answer.value > 0;
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
.q-score {
    .qq-scores {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .qq-score {
            width: 26px;
            height: 26px;
            margin: 0 10px;
            background: url("../../assets/img/question/Star Copy 4@2x.png") no-repeat center;
            background-size: 26px auto;
            &.active {
                background-image: url("../../assets/img/question/Star@2x.png");
            }
            &.disabled {
                opacity: 0.8;
                cursor: no-drop;
            }
        }
    }
}
</style>
