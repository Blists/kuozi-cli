<template>
    <ui-layout>
        <ui-head>
            <div slot="title">
                <div class="head-title-line1">发送至</div>
                <div class="head-title-line2" v-text="groupName"></div>
            </div>
            <div @click="postsSave" class="btn-text" slot="right">发送</div>
        </ui-head>
        <ui-container>
            <ui-input v-model="post" placeholder="说点什么"></ui-input>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiInput from "../../components/UiInput.vue";
export default {
    components: { UiInput },
    data() {
        return {
            groupId: this.$route.query.groupId,
            groupName: this.$route.query.groupName,
            post: {}
        };
    },
    methods: {
        postsSave() {
            this.$post("postsSave", {
                type: 2,
                sponsor: "",
                target: "",
                money: "",
                question: this.post.content,
                imgs: this.post.imgs.join(","),
                groupId: this.groupId
            }).then(res => {
                this.$toast("发送成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
</style>
