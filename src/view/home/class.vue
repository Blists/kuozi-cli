<template>
    <ui-layout no-home>
        <ui-head all-slot>
            <div class="slot-head">
                <div class="tabs flex-1 hr-bottom">
                    <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                        <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                    </div>
                </div>
            </div>
        </ui-head>
        <ui-container>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.sp.key" :loadmore="loadmore1" :loading="videoLesson.loading" :all-loaded="videoLesson.allLoaded" ref="loadmore1">
                <div class="my-classs">
                    <div class="my-class" v-for="i in videoLesson.list" :key="i" @click="detail(i)">
                        <div class="my-class-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="my-class-right">
                            <div class="class-title limit2" v-text="i.name"></div>
                            <div class="class-info">
                                <div class="class-label" v-text="`含${i.lessonCount||0}节课程`"></div>
                                <div class="class-no">{{i.buyNums|numJia}}人购买</div>
                                <div v-if="i.bought" class="class-money">已购买</div>
                                <template v-else>
                                    <div v-if="i.free" class="class-money">免费</div>
                                    <div v-else class="class-money">￥{{i.money||0|numFmt}}</div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
            <ui-loadmore v-show="tab.activeTab==tab.tabs.yp.key" :loadmore="loadmore2" :loading="audioLesson.loading" :all-loaded="audioLesson.allLoaded" ref="loadmore2">
                <div class="my-classs">
                    <div class="my-class" v-for="i in audioLesson.list" :key="i" @click="detail(i)">
                        <div class="my-class-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="my-class-right">
                            <div class="class-title limit2" v-text="i.name"></div>
                            <div class="class-info">
                                <div class="class-label" v-text="`含${i.lessonCount||0}节课程`"></div>
                                <div class="class-no">{{i.buyNums|numJia}}人购买</div>
                                <div v-if="i.bought" class="class-money">已购买</div>
                                <template v-else>
                                    <div v-if="i.free" class="class-money">免费</div>
                                    <div v-else class="class-money">￥{{i.money||0|numFmt}}</div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
        <ui-layer :show.sync="layer">
            <div class="layer-content overflow-hidden">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{lesson.money}}
                        <span>元</span>
                    </div>
                </div>
                <div v-if="lesson.money>withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                <div class="cell-btn" @click="pay('wx')">微信支付</div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import pay from "../../mixin/pay";
import loadmore from "../../mixin/loadmore";
import { preImg } from "../../../config/project/project.env";
import UiLayer from "../../components/UiLayer.vue";
export default {
    mixins: [pay, loadmore],
    components: { UiLayer },
    data() {
        return {
            preImg: preImg,
            layer: false,
            lesson: {},
            tab: {
                activeTab: "sp",
                tabs: {
                    sp: {
                        name: "视频课堂",
                        key: "sp"
                    },
                    yp: {
                        name: "音频课堂",
                        key: "yp"
                    }
                }
            },
            videoLesson: {
                ref: "loadmore1",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                type: 1
            },
            audioLesson: {
                ref: "loadmore2",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false,
                type: 2
            }
        };
    },
    created() {
        this.loadmore1();
        this.loadmore2();
    },
    methods: {
        loadmore1() {
            this.LoadMore("queryClassRoom", "videoLesson");
        },
        loadmore2() {
            this.LoadMore("queryClassRoom", "audioLesson");
        },
        queryClassRoom(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryClassRoom", {
                        pageSize: this.PageSize,
                        pageNo: obj.pageNo,
                        type: obj.type,
                        status: 1
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        detail(i) {
            // if (i.free && !i.bought) {
            //     this.lesson = i;
            //     this.layer = true;
            // } else {
            this.$to({ name: "lessonDetail", query: { id: i.id } });
            // }
        },
        pay(flag) {
            this.$pay(
                flag,
                {
                    amount: this.lesson.money,
                    receiver: this.lesson.auther,
                    classRoomId: this.lesson.id
                },
                "PAY_BUY_CLASSROOM"
            ).then(() => {
                this.layer = false;
                this.$to({ name: "lessonDetail", query: { id: this.lesson.id } });
            });
        }
    }
};
</script>

<style lang="less"></style>
