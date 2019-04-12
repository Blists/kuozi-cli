<template>
    <ui-layout>
        <ui-container>
            <div v-show="activity.name" class="active-detail">
                <button class="active-back" @click="$back"></button>
                <!-- <button class="active-share">分享</button> -->
                <div class="active-img">
                    <ui-img v-if="activity.photo" :src="preImg+activity.photo"></ui-img>
                </div>
                <div style="padding-left:10px;">
                    <div class="active-name hr-bottom" v-text="activity.name"></div>
                    <div class="active-time">{{activity.activityTimeStart|dateFmt('MM/dd hh:mm')}} - {{activity.activityTimeEnd|dateFmt('MM/dd hh:mm')}}</div>
                    <div class="active-place" v-text="activity.activityAddress"></div>
                    <div class="active-ren" v-text="activity.numberLimit+'人'"></div>
                    <div v-if="activity.specValues&&activity.specValues.length==1" class="active-money" v-text="activity.specValues[0].money>0?'￥'+activity.specValues[0].money:'免费'"></div>
                    <div v-if="activity.specValues&&activity.specValues.length>1" class="active-money">¥{{activity.specValues[0].money}}-{{activity.specValues[activity.specValues.length-1].money}}</div>
                </div>
                <div class="hr-10"></div>
                <div style="padding-left:10px;">
                    <div class="active-jj hr-bottom">
                        <div class="active-jj-title">
                            活动简介
                        </div>
                        <div class="active-jj-detal" v-html="activity.description">
                        </div>
                    </div>
                    <div class="active-jj">
                        <div class="active-jj-title">
                            报名须知
                        </div>
                        <div class="active-jj-detal" v-html="activity.remark"></div>
                    </div>
                </div>
            </div>
        </ui-container>
        <div v-if="activity.status==1" class="bottom-btns hr-top">
            <button v-if="activity.free" class="info" @click="bm">立即报名</button>
            <button v-else class="info" @click="show=true">立即报名</button>
        </div>
        <ui-layer :show.sync="show" postion="bottom">
            <div class="active-piao">
                <div class="active-piao-title">选择票种</div>
                <div class="active-piaos">
                    <div class="active-piao-detail" :class="{active:activeTicket.type==specValue.type}" v-for="specValue in activity.specValues" :key="specValue.money" @click="activeTicket=specValue">
                        <div class="active-piao-name" v-text="specValue.type"></div>
                        <div class="active-piao-price" v-text="specValue.money>0?'￥'+specValue.money:'免费'"></div>
                    </div>
                </div>
            </div>
            <div class="bottom-btns hr-top">
                <button class="info" @click="to({name:'activityEnroll',query:{activityId:activity.id,type:activeTicket.type,money:activeTicket.money}})">立即报名</button>
                <button @click="show=false">取消</button>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import UiLayer from "../../components/UiLayer.vue";
import { preImg } from "../../../config/project/project.env";
import { shareAll } from "../../utils/wx";
export default {
    components: { UiLayer },
    data() {
        return {
            id: this.$route.query.id,
            preImg: preImg,
            show: false,
            activity: {},
            activeTicket: {}
        };
    },
    created() {
        this.queryActivityDetail();
    },
    methods: {
        queryActivityDetail() {
            this.$get("activityDetail", this.id).then(res => {
                this.activity = res;
                shareAll({
                    title: `「期望财经」${this.activity.name}`,
                    // desc: this.activity.description,
                    desc: `已有${this.activity.numberLimit}人报名，快来参加吧~`,
                    path: this.$route.fullPath,
                    imgUrl: this.preImg + this.activity.photo
                });
            });
        },
        bm() {
            this.activeTicket = {
                activityId: this.activity.id,
                type: "免费",
                money: 0
            };
            this.to({ name: "activityEnroll", query: this.activeTicket });
        },
        to(param) {
            if (!this.activeTicket.type) return this.$toast("请选择票种");
            this.$to(param);
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.active-detail {
    position: relative;
    .active-back {
        position: absolute;
        width: 33px;
        height: 33px;
        top: 40px;
        left: 15px;
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.5) url("../../assets/img/Pin Left@2x.png") no-repeat center;
        background-size: 8px auto;
    }
    .active-share {
        position: absolute;
        width: 60px;
        height: 33px;
        top: 40px;
        right: 15px;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.5);
        font-size: 15px;
        color: white;
    }
    .active-img {
        > img {
            display: block;
            width: 100%;
        }
    }
    .active-name {
        padding: 10px 10px 10px 0;
        font-size: 20px;
        color: #333;
        margin-bottom: 10px;
    }
    .active-time {
        padding: 10px 10px 10px 30px;
        background: url("../../assets/img/时间@2x.png") no-repeat 0 center;
        background-size: 18px auto;
        font-size: 18px;
        color: #333;
    }
    .active-place {
        padding: 10px 10px 10px 30px;
        background: url("../../assets/img/地点@2x.png") no-repeat 2px center;
        background-size: 16px auto;
        font-size: 18px;
        color: #333;
    }
    .active-ren {
        padding: 10px 10px 10px 30px;
        background: url("../../assets/img/人群@2x.png") no-repeat 0 center;
        background-size: 18px auto;
        font-size: 18px;
        color: #333;
    }
    .active-money {
        padding: 10px 10px 10px 30px;
        background: url("../../assets/img/金钱@2x.png") no-repeat 0 center;
        background-size: 18px auto;
        font-size: 18px;
        color: #333;
    }
    .active-jj {
        padding: 10px 0;
        .active-jj-title {
            position: relative;
            font-size: 18px;
            color: #333;
            padding: 10px 10px;
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
        .active-jj-detal {
            padding: 0 10px 10px 0;
        }
    }
}
.active-piao {
    background: white;
    border-radius: 4px 4px 0 0;
    .active-piao-title {
        padding-top: 20px;
        text-align: center;
        font-size: 18px;
        color: #333;
        font-weight: bold;
    }
    .active-piaos {
        padding: 15px;
        .active-piao-detail {
            display: flex;
            margin: 10px 0;
            border: 1px solid #bfddff;
            border-radius: 4px;
            padding: 10px;
            .active-piao-name {
                flex: 1;
            }
            .active-piao-price {
                color: @info;
            }
            &.active {
                background: @info;
                color: white;
                .active-piao-price {
                    color: white;
                }
            }
        }
    }
}
</style>
