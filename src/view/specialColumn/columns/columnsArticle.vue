<template>
    <ui-layout full>
        <ui-head title="添加文章"></ui-head>
        <ui-container>
            <ui-loadmore ref="loadmore" :bottom-method="loadMore" :bottom-all-loaded="allArticle.allLoaded">
                <div class="article-selects">
                    <div class="article-select hr-bottom" v-for="(article,i) in articles" :key="article.id">
                        <div class="article-select-info">
                            <div class="article-select-title" v-text="article.title"></div>
                            <div v-if="article.selected" class="article-select-state"><span>已添加</span></div>
                        </div>
                        <div class="opt-btns">
                            <button v-if="article.selected" class="yc" @click="unSelectArt(article.id)">移除</button>
                            <button v-else class="tj" @click="selectArt(article.id)">添加</button>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "./../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            columnId: this.$route.query.columnId,
            allArticle: { ref: "loadmore", pageNo: 0, list: [], loading: false, allLoaded: true },
            selectedArticleIds: []
        };
    },
    created() {
        this.queryNormalArticleIdsAllByColumn();
        this.loadMore();
    },
    methods: {
        loadMore() {
            this.LoadMore("queryMyArticles", "allArticle");
        },
        async queryNormalArticleIdsAllByColumn() {
            this.selectedArticleIds = await this.$get("queryNormalArticleIdsAllByColumn", this.columnId);
        },
        queryMyArticles(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyArticles", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        async selectArt(id) {
            await this.$post("addArticle", {
                columnId: this.columnId,
                articles: [{ id }]
            });
            if (this.selectedArticleIds.findIndex(a=>a == id) < 0) {
                this.selectedArticleIds.push(id);
            }
        },
        async unSelectArt(id) {
            await this.$post("delArticle", {
                columnId: this.columnId,
                articles: [{ id }]
            });
            let index = this.selectedArticleIds.findIndex(a=>a == id);
            this.selectedArticleIds.splice(index, 1);
        }
    },
    computed: {
        articles() {
            return this.allArticle.list.map(v=>{
                this.$set(v, "selected", this.selectedArticleIds.findIndex(a=>a == v.id) >= 0);
                return v;
            });
        }
    }
};
</script>

<style lang="less">
.article-selects {
    padding: 10px;
    .article-select {
        display: flex;
        padding: 15px 0;
        .article-select-info {
            flex: 1;
            .article-select-title {
                font-size: 16px;
                color: #333;
            }
            .article-select-state {
                font-size: 12px;
                color: #9b9b9b;
            }
        }
        .opt-btns {
            display: flex;
            flex-direction: column;
            justify-items: center;
            > button {
                width: 70px;
                height: 30px;
                border-radius: 4px;
                border: 1px solid;
                &.yc {
                    border-color: #f45574;
                    color: #f45574;
                }
                &.tj {
                    border-color: #6597ef;
                    color: #6597ef;
                }
            }
        }
    }
}
</style>
