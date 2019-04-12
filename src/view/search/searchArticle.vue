<template>
    <ui-layout full>
        <ui-head title="相关文章"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="searchMore" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                <div class="search-articles" style="padding:0 10px">
                    <div class="search-article hr-bottom" v-for="i in list" :key="i" @click="$to({name:'articleDetail',params:{id:i.id},query:{title:i.title,id:i.id}})">
                        <div class="search-article-title" v-html="highlight(keyword,i.title)"></div>
                        <div class="search-article-desc" v-html="highlight(keyword,i.desc||'--')"></div>
                        <div class="flex">
                            <div class="search-article-at">{{i.nickName}} {{i.publishTime|dateFmt('yyyy-MM-dd')}}</div>
                            <div class="article-infos">
                                <span class="article-info zan">{{i.likes}}</span>
                                <span class="article-info ly">{{i.comments}}</span>
                                <span class="article-info ds">{{i.arewards}}</span>
                                <span class="article-info see">{{i.pageviewNum}}</span>
                            </div>
                        </div>
                    </div>
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
                type: "article"
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
