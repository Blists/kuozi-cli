<template>
    <ui-layout>
        <ui-head title="我的关注"></ui-head>
        <div class="tabs hr-bottom">
            <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                <span v-text="t.name" @click="tab.activeTab=t.key"></span>
            </div>
        </div>
        <ui-container class="bg-gray">
            <ui-loadmore v-show="tab.activeTab==tab.tabs.dr.key" :bottom-method="loadmore1" :bottom-all-loaded="experts.allLoaded" ref="loadmore1">
                <div class="experts hr-bottom">
                    <div class="expert hr-bottom" v-for="expert in experts.list" :key="expert.id" @click="$to({name:'homePage',query:{loginName:expert.mobile}})">
                        <div class="expert-img">
                            <ui-img :src="preImg+expert.mobile"></ui-img>
                        </div>
                        <div class="expert-info">
                            <div class="expert-name" v-text="expert.nickName"></div>
                            <div class="expert-post">{{expert.company}}·{{expert.post}}</div>
                        </div>
                        <div class="expert-tw">
                            <button @click.stop="$to({name:'askQuestion',query:{name:expert.nickName,user:expert.mobile,placeholder:'请输入问题'}})">提问</button>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.zl.key" :bottom-method="loadmore2" :bottom-all-loaded="experts.allLoaded" ref="loadmore2">
                <div class="columns">
                    <div class="column" v-for="column in columns.list" :key="column.id" @click="$to({name:'columnsDetail',query:{columnId:column.id}})">
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
            <!-- <ui-loadmore v-show="tab.activeTab==tab.tabs.qz.key" :bottom-method="loadmore3" :bottom-all-loaded="experts.allLoaded" ref="loadmore3"> -->
            <div v-show="tab.activeTab==tab.tabs.qz.key">
                <div class="group-list">
                    <div class="group-list-item tj" v-for="group in groups.list" :key="group" @click="$to({name:'groupDetail',query:{groupId:group.id,title:group.name}})">
                        <div class="group-list-item-img">
                            <ui-img :src="preImg+group.photo"></ui-img>
                        </div>
                        <div class="group-list-item-right">
                            <div class="group-list-item-name">
                                <div class="ellipsis" v-text="group.name"></div>
                            </div>
                            <div class="group-list-item-no">
                                <span>{{group.unreadNumber|numJia}}</span>圈友</div>
                            <div class="group-list-item-ms">
                                <div class="ellipsis" v-text="group.description"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- </ui-loadmore> -->
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "dr",
                tabs: {
                    dr: {
                        name: "达人",
                        key: "dr"
                    },
                    zl: {
                        name: "专栏",
                        key: "zl"
                    },
                    qz: {
                        name: "圈子",
                        key: "qz"
                    }
                }
            },
            experts: {
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
            },
            groups: {
                ref: "loadmore3",
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
        this.queryMyCollectGroup();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryMyFocusFamousUser", "experts");
        },
        queryMyFocusFamousUser(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyFocusFamousUser", {
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
            this.LoadMore("queryMyFocusColumn", "columns");
        },
        queryMyFocusColumn(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyFocusColumn", {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        queryMyCollectGroup() {
            this.$post("listSelfGroup").then(res => {
                this.groups.list = res;
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
</style>
