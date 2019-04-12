<template>
    <ui-layout>
        <ui-head title="我的问答"></ui-head>
        <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="tab.activeTab=t.key"></span>
            </div>
        </div>
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.twz.key" :top-method="pull1" :bottom-method="loadmore1" :bottom-all-loaded="activeTwz.allLoaded" ref="loadmore1">
                <answer-item :answer="answer" v-for="answer in activeTwz.list" :key="answer" style="margin-bottom:10px;" no-operate no-like no-comment no-detail status></answer-item>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.yd.key" :top-method="pull2" :bottom-method="loadmore2" :bottom-all-loaded="activeYd.allLoaded" ref="loadmore2">
                <answer-item :answer="answer" v-for="answer in activeYd.list" :key="answer" style="margin-bottom:10px;" no-operate no-like no-comment collapse></answer-item>
            </ui-loadmore>
            <ui-loadmore v-if="tab.tabs.wd" v-show="tab.activeTab==tab.tabs.wd.key" :top-method="pull3" :bottom-method="loadmore3" :bottom-all-loaded="activeWd.allLoaded" ref="loadmore3">
                <answer-item :answer="answer" v-for="answer in activeWd.list" :key="answer" style="margin-bottom:10px;" no-operate no-like no-comment collapse @click.native="to(answer)" no-detail status></answer-item>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../../mixin/loadmore";
import AnswerItem from "../../../components/module/AnswerItem.vue";
export default {
    mixins: [loadmore],
    components: { AnswerItem },
    data() {
        return {
            expert: this.$route.query.expert,
            tab: {
                activeTab: "twz",
                tabs: {
                    twz: {
                        name: "提问中",
                        key: "twz"
                    },
                    yd: {
                        name: "已答问题",
                        key: "yd"
                    }
                }
            },
            activeWd: {
                ref: "loadmore3",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                answered: 0,
                mine: 0
            },
            activeYd: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                answered: 1,
                mine: 2
            },
            activeTwz: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                answered: 0,
                mine: 1
            },
            user: {}
        };
    },
    created() {
        if (this.expert == true || this.expert == "true") {
            this.tab = {
                activeTab: "twz",
                tabs: {
                    twz: {
                        name: "提问中",
                        key: "twz"
                    },
                    yd: {
                        name: "已答问题",
                        key: "yd"
                    },
                    wd: {
                        name: "未答问题",
                        key: "wd"
                    }
                }
            };
            this.pull3();
        } else {
            this.tab = {
                activeTab: "yd",
                tabs: {
                    yd: {
                        name: "已答问题",
                        key: "yd"
                    },
                    twz: {
                        name: "提问中",
                        key: "twz"
                    }
                }
            };
        }
        this.pull1();
        this.pull2();
        this.user = this.Store.get("$user");
    },
    methods: {
        pull1() {
            this.LoadTop("query", "activeTwz");
        },
        pull2() {
            this.LoadTop("query", "activeYd");
        },
        pull3() {
            this.LoadTop("query", "activeWd");
        },
        loadmore1() {
            this.LoadMore("query", "activeTwz");
        },
        loadmore2() {
            this.LoadMore("query", "activeYd");
        },
        loadmore3() {
            this.LoadMore("query", "activeWd");
        },
        query(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyQuestionAndAnswer", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize,
                        answered: obj.answered,
                        mine: obj.mine,
                        all: true
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        to(answer) {
            if ((answer.targetName == "我" || answer.targetNickName == "我") && answer.targetPhoto == this.user.mobile) {
                this.$to({ name: "reply", query: { id: answer.id, name: answer.sponsorName, question: answer.question } });
            }
        }
    }
};
</script>

<style>
</style>
