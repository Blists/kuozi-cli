<template>
    <ui-layout>
        <ui-head title="我的文章"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :bottom-method="loadmore" :bottom-all-loaded="articles.allLoaded" ref="loadmore">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article" no-user bottom-time show-status></article-item>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import ArticleItem from "../../../components/module/ArticleItem.vue";
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    components: { ArticleItem },
    data() {
        return {
            articles: {
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
            this.LoadMore("queryMyArticles", "articles");
        },
        queryMyArticles(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyArticles", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        status: 1
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
