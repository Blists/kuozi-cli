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
        <ui-container>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.xs.key" :loadmore="loadmore1" :loading="activeXS.loading" :all-loaded="activeXS.allLoaded" ref="loadmore1">
                <div class="activies">
                    <div class="active" v-for="i in activeXS.list" :key="i" @click="$to({name:'activityDetail',query:{id:i.id}})">
                        <div class="active-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="flex">
                            <div class="active-info">时间：{{i.activityTimeStart|dateFmt('yyyy-MM-dd')}}&nbsp;&nbsp;&nbsp;&nbsp;地点：{{i.activityAddress}}</div>
                            <div class="active-state" :class="activeStatues[i.status].className">
                                <span v-text="activeStatues[i.status].name"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.xx.key" :loadmore="loadmore2" :loading="activeXX.loading" :all-loaded="activeXX.allLoaded" ref="loadmore2">
                <div class="activies">
                    <div class="active" v-for="i in activeXX.list" :key="i" @click="$to({name:'activityDetail',query:{id:i.id}})">
                        <div class="active-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="flex">
                            <div class="active-info">时间：{{i.activityTimeStart|dateFmt('yyyy-MM-dd')}}&nbsp;&nbsp;&nbsp;&nbsp;地点：{{i.activityAddress}}</div>
                            <div class="active-state" :class="activeStatues[i.status].className">
                                <span v-text="activeStatues[i.status].name"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../mixin/loadmore";
import { preImg } from "../../../config/project/project.env";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "xs",
                tabs: {
                    xs: {
                        name: "线上活动",
                        key: "xs"
                    },
                    xx: {
                        name: "线下活动",
                        key: "xx"
                    }
                }
            },
            activeXS: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                type: 1
            },
            activeXX: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                type: 2
            },
            activeStatues: {
                0: { name: "已结束", className: "yjs" },
                1: { name: "报名中", className: "bmz" },
                2: { name: "未开始", className: "wks" }
            }
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryActivity", "activeXS");
        },
        loadmore2() {
            this.LoadMore("queryActivity", "activeXX");
        },
        queryActivity(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryActivity", {
                        pageNo: obj.pageNo++,
                        pageSize: this.PageSize,
                        type: obj.type
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
@import "../../style/variables.less";
.activies {
    padding: 15px;
    .active {
        margin-bottom: 10px;
        .active-img {
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 5px;
            > img {
                width: 100%;
                border-radius: 8px;
            }
        }
        .active-info {
            flex: 1;
            font-size: 14px;
            color: #666;
            line-height: 24px;
            padding-left: 10px;
        }
        .active-state {
            height: 24px;
            position: relative;
            font-size: 16px;
            padding: 0 10px;
            &::before {
                content: "";
                position: absolute;
                width: 7px;
                height: 7px;
                top: 50%;
                left: 0;
                margin-top: -3.5px;
                border-radius: 100%;
            }
            &.wks {
                color: #afafaf;
                &::before {
                    background: #afafaf;
                }
            }
            &.bmz {
                color: @info;
                &::before {
                    background: @info;
                }
            }
            &.yjs {
                color: #afafaf;
                &::before {
                    background: #afafaf;
                }
            }
        }
    }
}
</style>
