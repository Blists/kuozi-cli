<template>
    <ui-layout>
        <ui-head title="草稿箱">
            <div v-if="showChoose" slot="right" class="btn-text" @click="showChoose=false">取消</div>
            <div v-else slot="right" class="btn-text" @click="showChoose=true">选择</div>
        </ui-head>
        <!-- <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="tab.activeTab=t.key"></span>
            </div>
        </div> -->
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.article.key" :loadmore="queryMyArticles" :loading="article.loading" :all-loaded="article.allLoaded" ref="loadmore">
                <div class="draft-articles hr-bottom">
                    <div class="draft-article hr-bottom" :class="{choose:showChoose,choosed:i.choosed}" v-for="i in article.list" v-if="!i.hide" :key="i" @click="releaseArticle(i)">
                        <div class="draft-article-title" v-text="i.title"></div>
                        <div class="draft-article-time">{{i.publishTime|dateFmt('yyyy-MM-dd')}}</div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
        <div v-if="showChoose" class="draft-del">
            <button @click="delConfirm">删除</button>
        </div>
    </ui-layout>
</template>

<script>
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            tab: {
                activeTab: "article",
                tabs: {
                    article: {
                        name: "文章",
                        key: "article"
                    }
                    // group: {
                    //     name: "圈子",
                    //     key: "group"
                    // },
                    // answer: {
                    //     name: "提问",
                    //     key: "answer"
                    // }
                }
            },
            article: {
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            group: {
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            answer: {
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            showChoose: false
        };
    },
    created() {
        this.queryMyArticles();
        this.Store.remove("articleNew");
    },
    methods: {
        queryMyArticles() {
            let obj = this.article;
            obj.loading = true;
            this.$post("queryMyArticles", {
                pageNo: ++obj.pageNo,
                pageSize: this.PageSize,
                status: 5
            }).then(res => {
                obj.list.push(...res.results);
                obj.allLoaded = obj.pageNo >= res.pageCount;
                obj.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        },
        releaseArticle(i) {
            if (this.showChoose) {
                this.$set(i, "choosed", !i.choosed);
            } else {
                let articleNew = {
                    id: i.id,
                    title: i.title,
                    content: i.content,
                    cover: i.cover,
                    domains: i.domainList,
                    column: { id: i.columnId }
                };
                this.Store.set("articleNew", articleNew);
                this.$to({ name: "releaseArticle1" });
            }
        },
        delConfirm() {
            let articleIds = this.article.list.filter(v => v.choosed && !v.hide).map(v => v.id);
            if (articleIds.length == 0) return this.$toast("请选择文章");
            this.$messagebox({
                title: "提示",
                message: "是否确认删除?",
                showCancelButton: true
            }).then(res => {
                if (res == "confirm") {
                    this.$post("delBatch", {articleIds: articleIds}).then(res => {
                        for (let item of this.article.list) {
                            if (item.choosed) {
                                this.$set(item, "hide", true);
                                item.choosed = false;
                            }
                        }
                    });
                } else {
                    this.showChoose = false;
                }
            });
        }
    }
};
</script>

<style lang="less">
.draft-articles {
    padding: 0 15px;
    background: white;
    .draft-article {
        padding: 15px 0;
        &.choose {
            padding-left: 30px;
            background: url("../../../assets/img/Oval 4 Copy@2x.png") 0 center no-repeat;
            background-size: 16px auto;
            &.choosed {
                background-image: url("../../../assets/img/Oval 4@2x.png");
            }
        }
        .draft-article-title {
            font-size: 16px;
            color: #333;
        }
        .draft-article-time {
            margin-top: 3px;
            font-size: 12px;
            color: #9b9b9b;
        }
    }
}
.draft-del {
    > button {
        width: 100%;
        height: 40px;
        background: #f45574;
        color: white;
        font-size: 18px;
    }
}
</style>
