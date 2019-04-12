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
            <ui-loadmore v-show="tab.activeTab==tab.tabs.tj.key" :loadmore="loadmore1" :loading="expertTJ.loading" :all-loaded="expertTJ.allLoaded" ref="loadmore1">
                <div class="experts hr-bottom">
                    <div class="expert hr-bottom" v-for="(expert,index) in expertTJ.list" :key="expert.id" @click="$to({name:'homePage',query:{loginName:expert.loginName}})">
                        <div class="expert-img">
                            <ui-img :src="preImg+expert.loginName"></ui-img>
                        </div>
                        <div class="expert-info">
                            <div class="expert-name" v-text="expert.nickName"></div>
                            <div class="expert-post">{{expert.company}}·{{expert.post}}</div>
                        </div>
                        <div class="expert-tw">
                            <button v-if="expert.focus" @click.stop="$to({name:'askQuestion',query:{name:expert.nickName,user:expert.loginName,placeholder:'请输入问题'}})">提问</button>
                            <button v-else @click.stop="focusSave(expert,'expertTJ',index)">关注</button>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.sy.key" :loadmore="loadmore2" :loading="expertSY.loading" :all-loaded="expertSY.allLoaded" ref="loadmore2">
                <div class="experts hr-bottom">
                    <div class="expert hr-bottom" v-for="(expert,index) in expertSY.list" :key="expert.id" @click="$to({name:'homePage',query:{loginName:expert.loginName}})">
                        <div class="expert-img">
                            <ui-img :src="preImg+expert.loginName"></ui-img>
                        </div>
                        <div class="expert-info">
                            <div class="expert-name" v-text="expert.nickName"></div>
                            <div class="expert-post">{{expert.company}}·{{expert.post}}</div>
                        </div>
                        <div class="expert-tw">
                            <button v-if="expert.focus" @click.stop="$to({name:'askQuestion',query:{name:expert.nickName,user:expert.loginName,placeholder:'请输入问题'}})">提问</button>
                            <button v-else @click.stop="focusSave(expert,'expertSY',index)">关注</button>
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
import { MTS } from "../../utils/constants";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            tab: {
                activeTab: "tj",
                tabs: {
                    tj: {
                        name: "推荐达人",
                        key: "tj"
                    },
                    sy: {
                        name: "所有达人",
                        key: "sy"
                    }
                }
            },
            expertTJ: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                key: "recommendMastersByPage"
            },
            expertSY: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                key: "listMasterByPage"
            }
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
    },
    methods: {
        loadmore1() {
            this.LoadMore("query", "expertTJ");
        },
        loadmore2() {
            this.LoadMore("query", "expertSY");
        },
        query(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post(obj.key, {
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        focusSave(user, key, index) {
            this.$post("focusSave", {
                type: MTS.Personal.mt,
                businessId: user.memberId
            }).then(res => {
                this[key].list[index].focus = true;
                this.$toast("关注成功");
            });
        }
    }
};
</script>

<style lang="less">
</style>
