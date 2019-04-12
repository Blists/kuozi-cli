<template>
    <ui-layout>
        <!--  -->
        <ui-head :title="white?user.nickName:''" transparent :white="white">
            <div slot="right">
                <div v-if="self&&login" class="photo-btn">
                    <input type="file" @change="change">
                </div>
            </div>
        </ui-head>
        <ui-container @scroll.native="scroll">
            <ui-bg :bg="preImg+background" :img="preImg+user.loginName" full-path></ui-bg>
            <div>
                <div class="h-user-name" v-text="user.nickName"></div>
                <div class="h-user-post">{{user.company||'--'}}·{{user.post||'--'}}</div>
                <div v-if="expert&&!self" class="h-btns">
                    <button v-if="user.checkFocus" @click="focusSave(false)">取消关注</button>
                    <button v-else @click="focusSave(true)">关注</button>
                    <button @click="$to({name:'askQuestion',query:{name:user.nickName,user:user.loginName,placeholder:'请输入问题'}})">向TA提问</button>
                </div>
            </div>
            <div class="bg-gray" style="height:15px;"></div>
            <div v-if="expert" class="tabs hr-bottom">
                <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                    <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                </div>
            </div>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.dynamic.key" :bottom-method="loadmore1" :bottom-all-loaded="dynamics.allLoaded" ref="loadmore1">
                <div class="dynamics">
                    <div class="dynamic" v-for="dynamic in dynamics.list" :key="dynamic.id">
                        <div class="dynamic-left">
                            <div class="dynamic-bg"></div>
                        </div>
                        <div class="dynamic-right">
                            <div class="dynamic-user">
                                <div class="dynamic-user-img">
                                    <ui-img :src="preImg+dynamic.operaterUser"></ui-img>
                                </div>
                                <div class="flex-1">
                                    <div class="dynamic-user-name">
                                        <span v-text="user.nickName"></span>
                                        <span v-text="dynamic.operater"></span>
                                    </div>
                                    <div class="dynamic-user-time">{{dynamic.operateDate|dateFmt('yyyy/MM/dd hh:mm')}}</div>
                                </div>
                            </div>
                            <div class="dynamic-content">
                                <div class="dynamic-tw">
                                    <div v-if="dynamic.img" class="dynamic-tw-img">
                                        <ui-img :src="preImg+dynamic.img"></ui-img>
                                    </div>
                                    <div v-if="dynamic.title" class="dynamic-tw-text" v-text="dynamic.title"></div>
                                </div>
                                <div v-if="dynamic.comments" class="dynamic-hf">
                                    <!-- 回答：回答了这个问题 -->
                                    <span v-text="dynamic.comments"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.articles.key" :bottom-method="loadmore2" :bottom-all-loaded="articles.allLoaded" ref="loadmore2">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article" no-user bottom-time></article-item>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import { MTS } from "../../utils/constants";
import { preImg } from "../../../config/project/project.env";
import UiBg from "../../components/UiBg.vue";
import ArticleItem from "../../components/module/ArticleItem.vue";
import loadmore from "../../mixin/loadmore";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    mixins: [loadmore],
    components: { UiBg, ArticleItem },
    data() {
        return {
            preImg: preImg,
            white: false,
            tab: {
                activeTab: "dynamic",
                tabs: {
                    dynamic: {
                        name: "动态",
                        key: "dynamic"
                    },
                    articles: {
                        name: "文章",
                        key: "articles"
                    }
                }
            },
            loginName: this.$route.query.loginName,
            self: this.$route.query.self,
            user: {},
            background: "",
            expert: false,
            dynamics: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            },
            articles: {
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
        this.memberDetail();
        let user = this.Store.get("$user") || {};
        this.self = user.mobile == this.loginName;
    },
    methods: {
        scroll($event) {
            if ($event.target.scrollTop < 100) {
                this.white = false;
            } else {
                this.white = true;
            }
        },
        memberDetail() {
            this.$post("memberDetail", { loginName: this.loginName }).then(res => {
                this.user = res;
                this.background = res.background;
                this.expert = res.type != "11000";
                let title = `「期望财经 ${this.user.nickName}`;
                if (this.expert) {
                    this.loadmore2();
                    title = `「期望财经」达人 ${this.user.nickName}--${this.user.company}，${this.user.post}`;
                }
                shareAll({
                    title: title,
                    desc: "为投资者提供最有价值的信息",
                    path: this.$route.fullPath,
                    imgUrl: this.preImg + this.loginName,
                });
            });
        },
        loadmore1() {
            this.LoadMore("queryMyDynamic", "dynamics");
        },
        queryMyDynamic(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyDynamic", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        loginName: this.loginName
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        loadmore2() {
            this.LoadMore("queryMyArticles", "articles");
        },
        queryMyArticles(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyArticles", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        loginName: this.loginName,
                        status: 1
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.editBackground(res);
            });
        },
        editBackground(background) {
            this.$post("editBackground", { background: background }).then(() => {
                this.background = background;
            });
        },
        focusSave(flag) {
            if (flag) {
                this.$post("focusSave", {
                    type: MTS.Personal.mt,
                    businessId: this.user.id
                }).then(res => {
                    this.user.checkFocus = true;
                    this.$toast("关注成功");
                });
            } else {
                this.$post("focusCancleFocus", {
                    type: MTS.Personal.mt,
                    businessId: this.user.id
                }).then(res => {
                    this.user.checkFocus = false;
                    this.$toast("取消关注成功");
                });
            }
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.h-user-name {
    margin: 15px 0;
    text-align: center;
    font-size: 20px;
    color: #121314;
}
.h-user-post {
    margin: 15px 0;
    text-align: center;
    font-size: 14px;
    color: #333;
}
.h-btns {
    text-align: center;
    margin: 15px 0;
    > button {
        width: 85px;
        height: 30px;
        margin: 0 10px;
        border-radius: 4px;
        background: @info;
        color: white;
        font-size: 13px;
        &:last-child {
            background: white;
            border: 1px solid @info;
            color: @info;
        }
    }
}
.dynamics {
    .dynamic {
        display: flex;
        &:first-child {
            .dynamic-left {
                &::before {
                    background: none;
                }
            }
        }
        &:last-child {
            .dynamic-left {
                &::after {
                    background: none;
                }
            }
        }
        .dynamic-left {
            width: 40px;
            display: flex;
            flex-direction: column;
            &::before {
                content: "";
                height: 21px;
                background: linear-gradient(to bottom, @info, @info) no-repeat center;
                background-size: 1px 100%;
            }
            .dynamic-bg {
                width: 10px;
                height: 10px;
                background: @info;
                border-radius: 100%;
                margin: 3px auto;
            }
            &::after {
                content: "";
                flex: 1;
                background: linear-gradient(to bottom, @info, @info) no-repeat center;
                background-size: 1px 100%;
            }
        }
        .dynamic-right {
            flex: 1;
            padding: 10px 0;
            .dynamic-user {
                display: flex;
                .dynamic-user-img {
                    padding: 5px 0;
                    > img {
                        width: 30px;
                        height: 30px;
                        border-radius: 100%;
                    }
                }
                .dynamic-user-name {
                    margin: 2px 10px;
                    font-size: 14px;
                    color: #333;
                }
                .dynamic-user-time {
                    margin: 2px 10px;
                    font-size: 12px;
                    color: #999;
                }
            }
            .dynamic-content {
                padding: 10px 10px 10px 40px;
                .dynamic-tw {
                    display: flex;
                    padding-bottom: 10px;
                    .dynamic-tw-img {
                        margin-right: 10px;
                        > img {
                            display: flex;
                            width: 28px;
                            height: 28px;
                            border-radius: 4px;
                        }
                    }
                    .dynamic-tw-text {
                        flex: 1;
                        padding: 2px 0;
                        font-size: 16px;
                        color: #333;
                    }
                }
                .dynamic-hf {
                    background: #edeef2;
                    padding: 6px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #333;
                }
            }
        }
    }
}
</style>
