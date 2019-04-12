<template>
    <ui-layout>
        <ui-head all-slot>
            <div class="slot-head" style="padding-right:35px">
                <div class="head-back" @click="$back"></div>
                <div class="tabs flex-1 hr-bottom">
                    <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                        <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                    </div>
                </div>
            </div>
        </ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.article.key" :bottom-method="loadmore1" :bottom-all-loaded="articles.allLoaded" ref="loadmore1">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article" no-user bottom-time show-status></article-item>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.column.key" :bottom-method="loadmore2" :bottom-all-loaded="columns.allLoaded" ref="loadmore2">
                <div class="columns">
                    <div class="column" v-for="column in columns.list" :key="column.id" @click="$to({name:'columnsDetail',query:{columnId:column.id,mine:true}})">
                        <div class="column-left">
                            <ui-img :src="preImg+column.cover"></ui-img>
                        </div>
                        <div class="column-right">
                            <div class="column-info">
                                <div class="column-mc" v-text="column.name"></div>
                                <div class="column-gz">
                                    <span v-text="column.focus||0"></span>人关注</div>
                            </div>
                            <div class="column-zw">
                                <span v-text="column.userName"></span>·
                                <span v-text="column.company"></span>
                                <span v-text="column.post"></span>
                            </div>
                            <div class="column-ms limit2" v-text="column.description"></div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
        <button class="add-release" @click="release"></button>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
import ArticleItem from "../../../components/module/ArticleItem.vue";
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    components: { ArticleItem },
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "article",
                tabs: {
                    article: {
                        name: "我的文章",
                        key: "article"
                    },
                    column: {
                        name: "我的专栏",
                        key: "column"
                    }
                }
            },
            articles: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            columns: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            }
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryMyArticles", "articles");
        },
        queryMyArticles(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = this.$post("queryMyArticles", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        loadmore2() {
            this.LoadMore("queryMyColumn", "columns");
        },
        queryMyColumn(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = this.$post("queryMyColumn", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        release() {
            if (this.tab.activeTab == this.tab.tabs.article.key) {
                // if (this.columns.length == 0) {
                //     this.$messagebox({
                //         title: "提示",
                //         message: "您还没有专栏，请先新建专栏",
                //         showCancelButton: true
                //     }).then(res => {
                //         if (res == "confirm") this.$to({ name: "releaseColumn" });
                //     });
                // } else {
                this.Store.remove("articleNew");
                this.$to({ name: "releaseArticle1" });
                // }
            } else {
                this.$to({ name: "releaseColumn" });
            }
        }
    }
};
</script>

<style lang="less">
</style>
