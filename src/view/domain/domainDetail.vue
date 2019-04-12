<template>
    <ui-layout>
        <ui-head :title="title">
            <!-- <div class="btn-more" slot="right"></div> -->
        </ui-head>
        <ui-container class="bg-gray">
            <div class="domain-detail">
                <div class="domain-img">
                    <ui-img :src="preImg+photo"></ui-img>
                </div>
                <div class="domain-info">
                    <div class="domain-name">
                        <div v-text="title"></div>
                    </div>
                    <div class="domain-gz">
                        <button v-if="focus" @click="focusSave(false)">取消关注</button>
                        <button v-else @click="focusSave(true)">
                            <span class="domain-gz-add"></span>关注</button>
                    </div>
                </div>
            </div>
            <div class="tabs hr-bottom" style="margin-top:10px;">
                <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                    <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                </div>
            </div>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.articles.key" :loadmore="loadmore1" :loading="articles.loading" :all-loaded="articles.allLoaded" ref="loadmore1">
                <div class="article-list">
                    <article-item v-for="article in articles.list" :key="article.id" :article="article"></article-item>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.qas.key" :loadmore="loadmore2" :loading="qas.loading" :all-loaded="qas.allLoaded" ref="loadmore2">
                <answer-item :answer="answer" v-for="answer in qas.list" :key="answer" style="margin-bottom:10px;" collapse></answer-item>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.experts.key" :loadmore="loadmore3" :loading="experts.loading" :all-loaded="experts.allLoaded" ref="loadmore3">
                <div class="experts hr-bottom">
                    <div class="expert hr-bottom" v-for="expert in experts.list" :key="expert.id" @click="$to({name:'homePage',query:{loginName:expert.loginName}})">
                        <div class="expert-img">
                            <ui-img :src="preImg+expert.loginName"></ui-img>
                        </div>
                        <div class="expert-info">
                            <div class="expert-name" v-text="expert.nickName"></div>
                            <div class="expert-post">{{expert.company}}·{{expert.post}}</div>
                        </div>
                        <div class="expert-tw">
                            <button @click.stop="$to({name:'askQuestion',query:{name:expert.nickName,user:expert.auther,placeholder:'请输入问题'}})">提问</button>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../mixin/loadmore";
import ArticleItem from "../../components/module/ArticleItem.vue";
import AnswerItem from "../../components/module/AnswerItem.vue";
import { preImg } from "../../../config/project/project.env";
import { MTS } from "../../utils/constants";
export default {
    mixins: [loadmore],
    components: { ArticleItem, AnswerItem },
    data() {
        return {
            title: this.$route.query.title,
            id: this.$route.query.id,
            photo: this.$route.query.title,
            preImg: preImg,
            tab: {
                activeTab: "articles",
                tabs: {
                    articles: {
                        name: "文章",
                        key: "articles"
                    },
                    qas: {
                        name: "问答",
                        key: "qas"
                    },
                    experts: {
                        name: "达人",
                        key: "experts"
                    }
                }
            },
            articles: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                key: "queryArticleByDomain"
            },
            qas: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                key: "queryQuesionByDomain"
            },
            experts: {
                ref: "loadmore3",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                key: "queryUserByDomain"
            },
            focus: false
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
        this.loadmore3();
        this.checkDomainFocus();
    },
    methods: {
        loadmore1() {
            this.LoadMore("query", "articles");
        },
        loadmore2() {
            this.LoadMore("query", "qas");
        },
        loadmore3() {
            this.LoadMore("query", "experts");
        },
        query(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post(obj.key, {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        domainId: this.id
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        checkDomainFocus() {
            this.$post("checkDomainFocus", { domainId: this.id }).then(res => {
                this.focus = res.isFocus;
            });
        },
        focusSave(flag) {
            if (flag) {
                this.$post("focusSave", {
                    type: MTS.Domain.mt,
                    businessId: this.id
                }).then(res => {
                    this.focus = true;
                    this.$toast("关注成功");
                });
            } else {
                this.$post("focusCancleFocus", {
                    type: MTS.Domain.mt,
                    businessId: this.id
                }).then(res => {
                    this.focus = false;
                    this.$toast("取消关注成功");
                });
            }
        }
    }
};
</script>
<style lang="less">
@import "../../style/variables.less";
.domain-detail {
    display: flex;
    padding: 10px;
    background: white;
    .domain-img {
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
        > img {
            display: block;
            max-width: 200px;
            height: 100px;
            border-radius: 4px;
        }
    }
    .domain-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .domain-name {
            position: relative;
            height: 40px;
            > div {
                position: absolute;
                width: 100%;
                text-align: center;
                font-size: 20px;
                color: #333;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .domain-gz {
            text-align: center;
            > button {
                height: 30px;
                border-radius: 3px;
                background: @info;
                font-size: 13px;
                color: white;
                .domain-gz-add {
                    width: 20px;
                    height: 30px;
                    display: inline-block;
                    background: url("../../assets/img/Plus@2x.png") no-repeat center;
                    background-size: 10px;
                    vertical-align: -10px;
                }
            }
        }
    }
}
</style>

