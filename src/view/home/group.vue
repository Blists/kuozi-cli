<template>
    <ui-layout no-home>
        <ui-head all-slot>
            <div class="tabs hr-bottom">
                <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                    <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                </div>
            </div>
        </ui-head>
        <ui-container>
            <ui-loadmore v-show="tab.activeTab=='myGroup'" :pull="getListSelfGroup" ref="loadmore1">
                <div class="group-list">
                    <div class="group-list-item" v-for="group in listSelfGroup" :key="group.id" @click="$to({name:'groupDetail',query:{groupId:group.id,title:group.name}})">
                        <div class="group-list-item-img">
                            <ui-img :src="preImg+group.photo"></ui-img>
                        </div>
                        <div class="group-list-item-name">
                            <div class="ellipsis" v-text="group.name"></div>
                        </div>
                        <div class="group-list-item-no" v-text="groupUnRead[group.id]&&groupUnRead[group.id].num?groupUnRead[group.id].num:''"></div>
                    </div>
                </div>
            </ui-loadmore>
            <div v-if="tab.activeTab=='myGroup'&&show" class="add-group-btn" @click="groupNew">
                <span class="add-icon"></span>申请创建圈子
            </div>
            <ui-loadmore v-show="tab.activeTab=='recommendGropp'" :pull="pullRecommendGroupList" :loadmore="getRecommendGroupList" :loading="loading" :all-loaded="allLoaded" ref="loadmore2">
                <div class="group-list">
                    <div class="group-list-item tj" v-for="group in recommendGroupList" :key="group" @click="$to({name:'groupDetail',query:{groupId:group.id,title:group.name}})">
                        <div class="group-list-item-img">
                            <ui-img :src="preImg+group.photo"></ui-img>
                        </div>
                        <div class="group-list-item-right">
                            <div class="group-list-item-name">
                                <div class="ellipsis" v-text="group.name"></div>
                            </div>
                            <div class="group-list-item-no">
                                <span>{{group.userNumber|numJia}}</span>圈友</div>
                            <div class="group-list-item-ms">
                                <div class="ellipsis" v-text="group.description"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { ROLE } from "../../utils/constants";
import loadmore from "../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "myGroup",
                tabs: {
                    articles: {
                        name: "我的圈子",
                        key: "myGroup"
                    },
                    recommends: {
                        name: "全部圈子",
                        key: "recommendGropp"
                    }
                }
            },
            listSelfGroup: [],
            pageNo: 0,
            recommendGroupList: [],
            show: false,
            loading: false,
            allLoaded: false,
            login: window.login
        };
    },
    created() {
        if (this.login) {
            this.getListSelfGroup();
            this.memberDetail();
        } else {
            this.tab = {
                activeTab: "recommendGropp",
                tabs: {
                    recommends: {
                        name: "全部圈子",
                        key: "recommendGropp"
                    }
                }
            };
        }
        this.getRecommendGroupList();
    },
    methods: {
        memberDetail() {
            this.$post("memberDetail", { loginName: null }).then(res => {
                this.user = res;
                this.show = res.type == "12000";
            });
        },
        getListSelfGroup() {
            this.$get("listSelfGroup").then(res => {
                this.listSelfGroup = res;
                this.$store.dispatch("queryGroup");
                this.loadMoreLoaded(1, "loadmore1");
            });
        },
        getRecommendGroupList() {
            this.loading = true;
            this.pageNo++;
            this.$post("recommendGroupList", {
                pageNo: this.pageNo,
                pageSize: this.PageSize,
                phone: ""
            }).then(res => {
                this.loading = false;
                this.recommendGroupList.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loadMoreLoaded(this.pageNo, "loadmore2");
            });
        },
        groupNew() {
            this.Store.remove("groupNew");
            this.$to({ name: "groupNew" });
        },
        pullRecommendGroupList() {
            this.pageNo = 0;
            this.recommendGroupList = [];
            this.getRecommendGroupList();
        }
    },
    computed: {
        groupUnRead() {
            return this.$store.state.socket.groupUnRead;
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.add-group-btn {
    height: 24px;
    line-height: 24px;
    margin: 30px 0;
    text-align: center;
    font-size: 16px;
    color: #838383;
    .add-icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        display: inline-block;
        background: url("../../assets/img/Group 7@2x.png") no-repeat center;
        background-size: 11px;
        transform: rotate(45deg);
    }
}
</style>
