<template>
    <ui-layout full>
        <ui-head title="相关问答"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="searchMore" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                <div class="search-wds" style="padding:0 10px">
                    <div class="search-wd hr-top" v-for="i in list" @click="$to({name:'groupAnswer',query:{id:i.id,groupId:i.groupId}})" :key="i.id" v-html="highlight(keyword,i.targetNickName+'回答了'+i.sponsorNickName+'的问题：'+i.question)"></div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import highlight from "../../mixin/highlight";
import loadmore from "../../mixin/loadmore";
import { preImg } from "../../../config/project/project.env";
export default {
    mixins: [highlight, loadmore],
    data() {
        return {
            preImg: preImg,
            keyword: this.$route.query.keyword,
            list: [],
            pageNo: 0,
            loading: false,
            allLoaded: false
        };
    },
    created() {
        this.searchMore();
    },
    methods: {
        searchMore() {
            this.loading = true;
            this.$post("searchMore", {
                keywords: this.keyword,
                pageNo: ++this.pageNo,
                pageSize: this.PageSize,
                type: "question"
            }).then(res => {
                this.list.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
</style>
