<template>
    <ui-layout no-home>
        <ui-container name="article" class="article">
            <div style="position: relative;">
                <div class="art-head" :class="{'no-top':isWx}">
                    <div class="search-input" @click="$to({name:'search'})">
                        <div class="input">请输入关键词/文章/圈子/达人/专栏/课程/问答</div>
                    </div>
                    <div class="head-msg" @click="$to({name:'message'})">
                        <div v-if="unreadMsg>0" class="no-read">
                            <span :class="{jia10:unreadMsg>9,jia100:unreadMsg>99}">{{unreadMsg>99?'99+':unreadMsg}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <ui-swipe :items="banners"></ui-swipe>
            <div class="article-menus">
                <div class="dr" @click="$to({name:'expertList'})">达人</div>
                <div class="ly" @click="$to({name:'selectDomain',query:{title:'领域',readonly:true}})">领域</div>
                <div class="hd" @click="$to({name:'activityList'})">活动</div>
                <div class="zl" @click="$to({name:'columns'})">专栏</div>
                <div class="gz" @click="$to({name:'myAttention'})">关注</div>
            </div>
            <div class="hr-10"></div>
            <div class="tabs hr-bottom">
                <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                    <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                </div>
            </div>
            <ui-loadmore ref="loadmore1" v-show="tab.activeTab==tab.tabs.articles.key" :top-method="loadTop1" :bottom-method="loadMore1" :bottom-all-loaded="articles.allLoaded">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article"></article-item>
                </div>
            </ui-loadmore>
            <ui-loadmore ref="loadmore2" v-show="tab.activeTab==tab.tabs.recommends.key" :top-method="loadTop2" :bottom-method="loadMore2" :bottom-all-loaded="recommends.allLoaded">
                <div class="article-list">
                    <article-item v-for="article in recommends.list" :key="article.id" :article="article"></article-item>
                </div>
            </ui-loadmore>
            <ui-loadmore ref="loadmore3" v-show="tab.activeTab==tab.tabs.qas.key" :top-method="loadTop3" :bottom-method="loadMore3" :bottom-all-loaded="posts.allLoaded">
                <answer-item :answer="answer" v-for="answer in posts.list" :key="answer" class="hr-bottom" style="margin-bottom:10px;"></answer-item>
            </ui-loadmore>
        </ui-container>
        <router-view></router-view>
    </ui-layout>
</template>

<script>
import UiLayer from "../../components/UiLayer.vue";
import UiSwipe from "../../components/UiSwipe.vue";
import ArticleItem from "../../components/module/ArticleItem.vue";
import AnswerItem from "../../components/module/AnswerItem.vue";
import { preImg } from "../../../config/project/project.env";
import { shareAppMessage } from "../../utils/wx";
import loadmore from "../../mixin/loadmore";
export default {
    mixins: [loadmore],
    components: { UiSwipe, ArticleItem, AnswerItem, UiLayer },
    data() {
        return {
            unreadMsg: 0,
            preImg: preImg,
            tab: {
                activeTab: "articles",
                tabs: {
                    articles: {
                        name: "文章",
                        key: "articles"
                    },
                    recommends: {
                        name: "推荐",
                        key: "recommends"
                    },
                    qas: {
                        name: "问答",
                        key: "qas"
                    }
                }
            },
            banners: [],
            articles: { ref: "loadmore1", pageNo: 0, list: [], loading: false, allLoaded: true },
            recommends: { ref: "loadmore2", pageNo: 0, list: [], loading: false, allLoaded: true },
            posts: { ref: "loadmore3", pageNo: 0, list: [], loading: false, allLoaded: true }
        };
    },
    mounted() {
        this.queryBanner();
        this.loadTop1();
        this.loadTop2();
        this.loadTop3();
        if (this.login) {
            this.queryMessageByPage();
        }
    },
    methods: {
        queryBanner() {
            this.$get("queryBanner", "10001").then(res => {
                this.banners = res;
            });
        },
        loadTop1() {
            this.LoadTop("queryArticleByPage", "articles");
        },
        loadMore1() {
            this.LoadMore("queryArticleByPage", "articles");
        },
        queryArticleByPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryArticleByPage", {
                        keywords: "",
                        start: "",
                        end: "",
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        loadTop2() {
            this.LoadTop("queryRecommendArticleByPage", "recommends");
        },
        loadMore2() {
            this.LoadMore("queryRecommendArticleByPage", "recommends");
        },
        queryRecommendArticleByPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryRecommendArticleByPage", {
                        keywords: "",
                        start: "",
                        end: "",
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        loadTop3() {
            this.LoadTop("queryPostByPage", "posts");
        },
        loadMore3() {
            this.LoadMore("queryPostByPage", "posts");
        },
        queryPostByPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryPostByPage", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        answered: 1
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        queryMessageByPage() {
            this.$post("queryMessageByPage", {
                status: 0,
                pageSize: 1,
                pageNo: 1
            }).then(res => {
                this.unreadMsg = res.count;
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.art-head {
    position: absolute;
    display: flex;
    width: 100%;
    top: 30px;
    left: 0;
    z-index: 1;
    // background: black;
    &.no-top {
        top: 10px;
    }
    .search-input {
        flex: 1;
        padding-left: 10px;
        .input {
            width: 100%;
            height: 28px;
            line-height: 28px;
            border-radius: 28px;
            padding-left: 35px;
            background: #edeef2 url("../../assets/img/Combined Shape@2x.png") no-repeat 10px center;
            background-size: 16px;
            font-size: 13px;
            color: #9999;
        }
    }
    .head-msg {
        position: relative;
        width: 36px;
        background: url("../../assets/img/消息 信封@2x.png") no-repeat center;
        background-size: 18px auto;
        > .no-read {
            position: absolute;
            top: 0;
            right: 5px;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            border-radius: 100%;
            background: red;
            > span {
                display: block;
                color: white;
                font-size: 8px;
                &.jia10 {
                    transform: scale(0.7);
                }
                &.jia100 {
                    transform: scale(0.5);
                    margin-right: 3px;
                }
            }
        }
    }
}
.article-menus {
    display: flex;
    > div {
        flex: 1;
        height: 83px;
        padding-top: 55px;
        text-align: center;
        font-size: 13px;
        color: #666;
        background: no-repeat center 10px;
        background-size: 35px 35px;
        cursor: pointer;
    }
    .dr {
        background-image: url("../../assets/img/Group 9@2x.png");
    }
    .ly {
        background-image: url("../../assets/img/Group 16@2x.png");
    }
    .hd {
        background-image: url("../../assets/img/Group 17@2x.png");
    }
    .zl {
        background-image: url("../../assets/img/Group 19@2x.png");
    }
    .gz {
        background-image: url("../../assets/img/Group 20@2x.png");
    }
}
</style>
