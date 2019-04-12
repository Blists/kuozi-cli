<template>
    <ui-layout>
        <ui-head :title="`TA的回答(${count})`"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :bottom-method="loadmore" :bottom-all-loaded="qa.allLoaded" ref="loadmore">
                <answer-item class="hr-bottom" v-for="answer in qa.list" :key="answer.id" :answer="answer" @click.native="$to({name:'groupAnswer',query:{id:answer.id,groupId:groupId}})"></answer-item>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import AnswerItem from "../../components/module/AnswerItem.vue";
import { preImg } from "../../../config/project/project.env";
import { ROLE } from "../../utils/constants";
import loadmore from "../../mixin/loadmore";
export default {
    mixins: [loadmore],
    components: { AnswerItem },
    data() {
        return {
            preImg: preImg,
            ROLE: ROLE,
            count: this.$route.query.count,
            groupId: this.$route.query.groupId,
            phone: this.$route.query.phone,
            qa: {
                ref: "loadmore",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            }
        };
    },
    created() {
        this.loadmore();
    },
    methods: {
        loadmore() {
            this.LoadMore("listQaByPage", "qa");
        },
        listQaByPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("listQaByPage", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        groupId: this.groupId,
                        phone: this.phone
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        }
    }
};
</script>

<style lang="less">
</style>
