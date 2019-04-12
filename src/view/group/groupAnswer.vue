<template>
    <ui-layout>
        <ui-head title="详情"></ui-head>
        <ui-container class="bg-gray">
            <answer-item v-if="show" :answer="answer" detail></answer-item>
        </ui-container>
    </ui-layout>
</template>

<script>
import AnswerItem from "../../components/module/AnswerItem.vue";
import { preImg } from "../../../config/project/project.env";
export default {
    components: { AnswerItem },
    data() {
        return {
            preImg: preImg,
            groupId: this.$route.query.groupId,
            id: this.$route.query.id,
            show: false,
            answer: {}
        };
    },
    created() {
        this.qaDetail();
    },
    methods: {
        qaDetail() {
            this.$post("qaDetail", {
                groupId: this.groupId,
                id: this.id
            }).then(res => {
                this.answer = res;
                this.show = true;
            });
        }
    }
};
</script>

<style lang="less">

</style>
