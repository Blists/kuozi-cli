<template>
    <ui-layout>
        <ui-head>
            <div slot="title">
                <div class="head-title-line1">回复</div>
                <div class="head-title-line2" v-text="name"></div>
            </div>
            <div @click="sub" class="btn-text" slot="right">提交</div>
        </ui-head>
        <div class="reply-question">
            提问：
            <span v-text="question"></span>
        </div>
        <ui-container>
            <ui-input v-model="reply" placeholder="回答" :limit="1500"></ui-input>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiInput from "../../components/UiInput.vue";
export default {
    components: { UiInput },
    data() {
        return {
            id: this.$route.query.id,
            name: this.$route.query.name,
            question: this.$route.query.question,
            reply: {}
        };
    },
    created() {},
    methods: {
        sub() {
            if (!this.reply.content) return this.$toast("回答不能为空");
            this.$post("answer", {
                topicId: this.id,
                answer: this.reply.content
            }).then(res => {
                this.$toast("回答成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
.reply-question {
    padding: 15px;
    font-size: 16px;
    color: #666;
}
</style>
