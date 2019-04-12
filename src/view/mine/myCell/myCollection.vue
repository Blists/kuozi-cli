<template>
    <ui-layout>
        <ui-head title="我的收藏"></ui-head>
        <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="tab.activeTab=t.key"></span>
            </div>
        </div>
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.wz.key" :bottom-method="loadmore1" :bottom-all-loaded="articles.allLoaded" ref="loadmore1">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article" no-user bottom-time></article-item>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.qz.key" :bottom-method="loadmore2" :bottom-all-loaded="posts.allLoaded" ref="loadmore2">
                <div class="group-posts">
                    <group-post v-for="post in posts.list" :key="post" :post="post" @detail="detail(post)" no-operate></group-post>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.kc.key" :bottom-method="loadmore3" :bottom-all-loaded="myclass.allLoaded" ref="loadmore3">
                <div class="courses" style="padding:10px 10px 1px 10px;">
                    <div class="course" v-for="course in myclass.list" :key="course.id" @click="$to({name:course.type==1?'courseVideo':'courseAudio',query:{id:course.id}})">
                        <div class="course-img">
                            <ui-img :src="preImg+course.img"></ui-img>
                        </div>
                        <div class="flex-1">
                            <div class="course-name" v-text="course.name"></div>
                            <div class="course-desc" v-text="course.description"></div>
                            <div class="course-nt">{{course.autherName}} {{course.publish_time|dateFmt('yyyy-MM-dd')}}</div>
                            <div class="article-infos" style="text-align:right">
                                <span class="article-info zan" v-text="course.likes||0"></span>
                                <span class="article-info ly" v-text="course.comments||0"></span>
                                <span v-if="course.type!=1" class="article-info ds" v-text="course.arewards||0"></span>
                                <span class="article-info see" v-text="course.viewCount||0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
        <ui-root>
            <ui-layer :show.sync="layer" postion="bottom" full>
                <ui-layout>
                    <ui-head title="帖子详情" :backClick="closeDetail"></ui-head>
                    <ui-container>
                        <group-post :post="postDetail" :group-id="postDetail.id" detail></group-post>
                    </ui-container>
                </ui-layout>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
import ArticleItem from "../../../components/module/ArticleItem.vue";
import GroupPost from "../../../components/module/GroupPost.vue";
import UiRoot from "../../../components/UiRoot.vue";
import UiLayer from "../../../components/UiLayer.vue";
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    components: { ArticleItem, GroupPost, UiRoot, UiLayer },
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "wz",
                tabs: {
                    wz: {
                        name: "文章",
                        key: "wz"
                    },
                    qz: {
                        name: "圈子",
                        key: "qz"
                    },
                    kc: {
                        name: "课程",
                        key: "kc"
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
            posts: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            myclass: {
                ref: "loadmore3",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            layer: false,
            postDetail: {}
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
        this.loadmore3();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryMyCollectArticle", "articles");
        },
        queryMyCollectArticle(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = this.$post("queryMyCollectArticle", {
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
            this.LoadMore("queryCollect", "posts");
        },
        queryCollect(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = this.$post("queryCollect", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        type: "10009"
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        loadmore3() {
            this.LoadMore("queryMyCollectLesson", "myclass");
        },
        queryMyCollectLesson(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = this.$post("queryMyCollectLesson", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        closeDetail() {
            this.layer = false;
        },
        detail(post) {
            this.$post("postsQueryById", {
                essence: 0,
                groupId: post.groupId,
                pageNo: 1,
                pageSize: 1,
                postsId: post.id
            }).then(res => {
                this.postDetail = res.results[0] || {};
                this.layer = true;
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
</style>
