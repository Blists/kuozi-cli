<template>
    <ui-layout>
        <ui-head title="积分明细">
            <div slot="right" class="btn-text" @click="open">积分商城</div>
        </ui-head>
        <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="changeTab(t)"></span>
            </div>
        </div>
        <ui-container class="bg-gray">
            <ui-loadmore :pull="pull" :loading="loading" :all-loaded="allLoaded" :loadmore="queryMyScoreRecords" ref="loadmore">
                <div class="scores">
                    <div class="score" v-for="i in list" :key="i">
                        <div class="score-info">
                            <div class="score-lx" v-text="i.score_type_name"></div>
                            <div class="score-sj" v-text="i.date"></div>
                        </div>
                        <div class="score-no" v-text="i.score>0?'+'+i.score:i.score"></div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../../mixin/loadmore";
import { jfsc } from "../../../../config/project/project.env";
export default {
    mixins: [loadmore],
    data() {
        return {
            tab: {
                activeTab: "all",
                tabs: {
                    all: {
                        name: "全部",
                        key: "all",
                        type: "0"
                    },
                    sr: {
                        name: "收入",
                        key: "sr",
                        type: "1"
                    }
                    // zc: {
                    //     name: "支出",
                    //     key: "zc",
                    //     type: "2"
                    // }
                }
            },
            list: [],
            type: 0,
            pageNo: 0,
            loading: false,
            allLoaded: false
        };
    },
    created() {
        this.queryMyScoreRecords();
    },
    methods: {
        pull() {
            this.pageNo = 0;
            this.list = [];
            this.allLoaded = false;
            this.queryMyScoreRecords();
        },
        changeTab(t) {
            if (this.tab.activeTab != t.key) {
                this.tab.activeTab = t.key;
                this.type = t.type;
                this.pageNo = 0;
                this.list = [];
                this.queryMyScoreRecords();
            }
        },
        queryMyScoreRecords() {
            this.loading = true;
            this.pageNo++;
            this.$post("queryMyScoreRecords", {
                pageNo: this.pageNo,
                pageSize: this.PageSize,
                type: this.type
            }).then(res => {
                this.loading = false;
                this.list.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loadMoreLoaded(this.pageNo);
            });
        },
        open() {
            window.location.href = jfsc;
        }
    }
};
</script>

<style lang="less">
.scores {
    background: white;
    padding: 10px 20px;
    .score {
        display: flex;
        padding: 10px 0;
        .score-info {
            flex: 1;
            .score-lx {
                font-size: 16px;
                color: #4a4a4a;
            }
            .score-sj {
                font-size: 14px;
                color: #9b9b9b;
            }
        }
        .score-no {
            display: flex;
            align-items: center;
            font-size: 18px;
            color: #4a4a4a;
        }
    }
}
</style>
