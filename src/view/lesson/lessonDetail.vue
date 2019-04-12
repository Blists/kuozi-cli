<template>
    <ui-layout>
        <ui-container v-show="showDetail" class="bg-gray">
            <div class="lesson">
                <button class="lesson-back" :class="{'no-top':isWx}" @click="$back"></button>
                <!-- <button class="lesson-more"></button> -->
                <div class="lesson-img">
                    <!-- <ui-img v-if="lesson.photo" :src="preImg+lesson.photo"></ui-img> -->
                    <img :src="preImg+lesson.photo">
                </div>
                <div class="lesson-name">
                    <span v-text="lesson.name||'--'"></span>
                    <span v-if="lesson.type==1" class="lesson-type">视频课程</span>
                    <span v-if="lesson.type==2" class="lesson-type">音频课程</span>
                </div>
                <div class="hr-top" style="margin-left:10px;"></div>
                <div class="lesson-column">
                    <div class="lesson-column-title">
                        <span>课堂简介</span>
                        <button v-if="show" @click="show=false">收起</button>
                        <button v-else @click="show=true">查看详情</button>
                    </div>
                    <div v-if="show" class="lesson-column-detal" v-html="lesson.description||'--'"></div>
                    <div v-else class="lesson-column-detal limit3" v-html="lesson.description||'--'"></div>
                </div>
                <div class="lesson-column" style="margin-top:10px">
                    <div class="lesson-column-title">
                        课程列表
                    </div>
                    <div class="lesson-column-detal">
                        <div class="courses">
                            <ui-loadmore :loadmore="lessonQuery" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                                <div class="course" v-for="course in courses" :key="course.id" @click="to({name:lesson.type==1?'courseVideo':'courseAudio',query:{id:course.id}})">
                                    <div class="course-img">
                                        <ui-img :src="preImg+course.img"></ui-img>
                                    </div>
                                    <div class="flex-1">
                                        <div class="course-name" v-text="course.name"></div>
                                        <div class="course-desc" v-text="course.description"></div>
                                        <div class="course-nt">{{course.autherName}} {{course.publishTime|dateFmt('yyyy-MM-dd')}}</div>
                                        <div class="article-infos" style="text-align:right">
                                            <span class="article-info zan" v-text="course.likes||0"></span>
                                            <span class="article-info ly" v-text="course.comments||0"></span>
                                            <span v-if="lesson.type!=1" class="article-info ds" v-text="course.arewards||0"></span>
                                            <span class="article-info see" v-text="course.viewCount||0"></span>
                                        </div>
                                    </div>
                                </div>
                            </ui-loadmore>
                        </div>
                    </div>
                    <div style="height:150px;"></div>
                </div>
            </div>
        </ui-container>
        <template v-if="showDetail">
            <div v-if="!lesson.bought" class="bottom-btns hr-top">
                <template v-if="lesson.free">
                    <button class="info flex-1" @click="freeJoinClass">免费获取</button>
                </template>
                <template v-else>
                    <div class="bottom-btns-text">
                        费用：
                        <span v-text="lesson.money>0?'￥'+lesson.money:'免费'"></span>
                    </div>
                    <button class="info" @click="buy">购买课程</button>
                </template>
            </div>
        </template>
        <ui-layer :show.sync="layer" @click="showSelectCoupon=false">
            <div class="layer-content overflow-hidden">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{math.sub(lesson.money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)}}
                        <span>元</span>
                    </div>
                </div>
                <div v-if="canUseCoupons.length>0" class="use-coupon">
                    <div v-if="selectCouponIndex==-1" class="use-coupon-selected" :class="{active:showSelectCoupon}" @click.stop="showSelectCoupon=!showSelectCoupon">
                        <span class="use-coupon-selected-text" v-text="noUseText"></span>
                    </div>
                    <div v-else class="use-coupon-selected" :class="{active:showSelectCoupon}" @click.stop="showSelectCoupon=!showSelectCoupon">
                        <span class="use-coupon-selected-text active" v-text="canUseCoupons[selectCouponIndex].name"></span>
                        <span class="use-coupon-selected-money">{{canUseCoupons[selectCouponIndex].value|jMoney}}</span>
                    </div>
                    <div class="use-coupon-options" v-show="showSelectCoupon">
                        <div class="use-coupon-option" @click="selectCoupon(-1)">
                            <span class="use-coupon-option-text" :class="{active:selectCouponIndex==-1}" v-text="noUseText"></span>
                        </div>
                        <div class="use-coupon-option hr-top" v-for="(v,i) in canUseCoupons" :key="i" @click="selectCoupon(i)">
                            <span class="use-coupon-option-text" :class="{active:selectCouponIndex==i}" v-text="v.name"></span>
                            <span class="use-coupon-option-money">{{v.value|jMoney}}</span>
                        </div>
                    </div>
                </div>
                <div v-if="math.sub(lesson.money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)>withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
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
import { shareAll, resetShare } from "../../utils/wx";
export default {
    mixins: [pay, loadmore],
    components: { UiLayer },
    data() {
        return {
            preImg: preImg,
            id: this.$route.query.id,
            show: false,
            showDetail: false,
            lesson: {},
            courses: [],
            pageNo: 0,
            loading: false,
            allLoaded: false,
            layer: false,
            lessonImg: true
        };
    },
    mounted() {
        this.getClassRoom();
    },
    methods: {
        getClassRoom() {
            this.$get("getClassRoom", this.id).then(res => {
                this.lesson = res;
                this.lessonQuery();
                this.showDetail = true;
                // setTimeout(() => {
                //     this.lessonImg = false;
                //     setTimeout(() => {
                //         this.lessonImg = true;
                //     }, 100);
                // }, 1000);
            });
        },
        lessonQuery() {
            this.loading = true;
            this.$post("lessonQuery", {
                classRoomId: this.id,
                status: 1,
                pageNo: ++this.pageNo,
                pageSize: this.PageSize
            }).then(res => {
                if (this.pageNo == 1) {
                    let js = res.results.map(v=>v.autherName).join("，");
                    shareAll({
                        title: `「期望财经」《${this.lesson.name}》开讲啦~`,
                        desc: js ? `讲师：${js}；已更新${res.count}节课` : "暂无课程",
                        path: this.$route.fullPath,
                        imgUrl: this.preImg + this.lesson.photo
                    });
                }
                this.courses.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        },
        buy() {
            if (this.login) {
                this.queryCanUseCoupon("Lesson", this.id, this.lesson.money).then(() => {
                    this.layer = true;
                });
            } else {
                sessionStorage.setItem("$path", this.$route.fullPath);
                this.$to({ name: "login" });
            }
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
                this.lesson.bought = true;
                this.$toast("购买成功");
            });
        },
        to(p) {
            if (this.login) {
                if (this.lesson.bought) {
                    this.$to(p);
                } else {
                    this.$toast("请先购买课堂");
                }
            } else {
                sessionStorage.setItem("$path", this.$route.fullPath);
                this.$to({ name: "login" });
            }
            // if (this.lesson.free) {
            //     this.$to(p);
            // } else {
            //     if (this.login) {
            //         if (this.lesson.bought) {
            //             this.$to(p);
            //         } else {
            //             this.layer = true;
            //         }
            //     } else {
            //         sessionStorage.setItem("$path", this.$route. fullPath);
            //         this.$to({ name: "login" });
            //     }
            // }
        },
        freeJoinClass() {
            this.$get("freeJoinClass", this.lesson.id).then(() => {
                this.lesson.bought = true;
                this.$toast("获取成功");
            });
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.lesson-column {
    padding: 10px;
    background: white;
    .lesson-column-title {
        display: flex;
        position: relative;
        font-size: 18px;
        color: #333;
        padding: 10px 0 10px 10px;
        > span {
            flex: 1;
        }
        button {
            background: url();
            font-size: 12px;
            color: @info;
        }
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 13px;
            width: 4px;
            height: 20px;
            background: @info;
            border-radius: 4px;
        }
    }
    .lesson-column-detal {
        &.limit3 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
