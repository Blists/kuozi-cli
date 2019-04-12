<template>
    <ui-layout>
        <ui-container class="lesson-warp">
            <div class="lesson">
                <!-- <div class="course-video">
                    <video :src="course.videoName" controls></video>
                </div> -->
                <div ref="youkuplayer" id="youkuplayer" class="course-video" :style="style"></div>
                <button class="lesson-back" :class="{'no-top':isWx}" @click="$back"></button>
                <button class="lesson-more" :class="{'no-top':isWx}" @click="layers.layer3=true"></button>
                <div class="lesson-name">
                    <span v-text="course.name"></span>
                    <span class="lesson-type">视频课程</span>
                </div>
                <div class="lesson-info">
                    <div class="lesson-author">
                        <div class="lesson-author-img">
                            <ui-img :src="preImg+course.auther"></ui-img>
                        </div>
                        <div class="lesson-author-name" v-text="course.autherName"></div>
                    </div>
                    <div class="flex-1">
                        <span class="lesson-see" v-text="course.viewCount||0"></span>
                        <span class="lesson-likes" v-text="course.likes||0"></span>
                    </div>
                    <div class="lesson-time">{{course.publishTime|dateFmt('yyyy-MM-dd hh:mm')}}</div>
                </div>
            </div>
            <div class="course-chat">
                <div class="flex hr-top hr-bottom">
                    <!-- <div class="course-chat-title">聊天</div> -->
                    <div class="tabs flex-1">
                        <div v-for="t in tab.tabs" :key="t.key" :class="{active:tab.activeTab==t.key}">
                            <span v-text="t.name" @click="tab.activeTab=t.key"></span>
                        </div>
                    </div>
                    <div class="btn-yg">
                        <button class="btn-yq" @click="$to({name:'lessonShare',query:{id:id,classRoomId:course.classRoomId}})">邀请</button>
                        <button class="btn-gz" @click="layers.layer4=true">关注</button>
                    </div>
                </div>
                <div v-show="tab.activeTab==tab.tabs.lt.key" class="course-chats">
                    <div class="course-chat-detail" v-for="i in chats" :key="i">
                        <div class="course-chat-name" v-text="i.user+'：'"></div>
                        <div v-if="i.type==='gift'" class="course-chat-content">
                            <span>赠送给讲师</span>
                            <span class="chat-gift">
                                <span class="chat-gift-name" :style="{backgroundImage:`url(${preImg+i.photo})`}" v-text="i.giftName"></span>
                                <span class="chat-gift-no" v-text="'x'+i.no"></span>
                                <span>{{i.time|dateFmt("yyyy-MM-dd hh:mm:ss")}}</span>
                            </span>
                        </div>
                        <div v-else class="course-chat-content">
                            <span v-text="i.content"></span>
                            <span>{{i.time|dateFmt("yyyy-MM-dd hh:mm:ss")}}</span>
                        </div>
                    </div>
                </div>
                <div class="course-jj" v-if="tab.activeTab==tab.tabs.kt.key">
                    <div class="course-jj-title">本课详情</div>
                    <div class="course-jj-content" v-html="course.description"></div>
                </div>
            </div>
        </ui-container>
        <div class="chat-ib ht-top">
            <div class="chat-input"><input v-model="content" type="text" placeholder="留言" @keyup.enter="saveComment"></div>
            <div class="chat-btns">
                <!-- <button class="ly"></button> -->
                <button class="lw" @click="layers.layer1=true"></button>
                <button class="zan" :class="{active:course.liked}" @click="saveLike"></button>
                <button class="send" v-if="content" @click="saveComment">发送</button>
            </div>
        </div>
        <ui-layer :show.sync="layers.layer1" postion="bottom">
            <div class="send-gift">
                <div class="send-gift-title">礼物</div>
                <div class="gifts">
                    <div class="gift" :class="{active:g.giftName==sendGift.giftName}" :style="{backgroundImage:`url('${preImg+g.photo}')`}" v-for="g in gifts" :key="g.giftName" @click="chooseGift(g)">
                        <div class="gift-name" v-text="g.giftName"></div>
                        <div class="gift-price" v-text="'￥'+g.money"></div>
                    </div>
                </div>
                <div class="send-gift-opt">
                    <div class="send-gift-money">
                        金额
                        <span>{{math.mul(sendGift.no,sendGift.money)|numFmt}}</span>
                    </div>
                    <div class="send-gift-sb">
                        <!-- <div class="select">
                            <div v-text="sendGift.no"></div>
                            <select v-model="sendGift.no">
                                <option value="1">1</option>
                            </select>
                        </div> -->
                        <input v-model="sendGift.no" type="number" />
                        <button @click="sendBtn">赠送</button>
                    </div>
                </div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="layers.layer2">
            <div class="layer-content overflow-hidden">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{math.mul(sendGift.no,sendGift.money)|numFmt}}
                        <span>元</span>
                    </div>
                </div>
                <div v-if="math.mul(sendGift.no,sendGift.money)>withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                <div class="cell-btn" @click="pay('wx')">微信支付</div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="layers.layer3">
            <div class="layer-content overflow-hidden">
                <div class="cell-btn" @click="saveCollect">收藏</div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="layers.layer4">
            <div class="layer-content gz-ewm">
                <div class="gz-ewm-title">
                    长按关注
                    <span>期望学院</span>公众号
                </div>
                <div class="gz-ewm-img">
                    <ui-img :src="preImg+'qrcode_qwxy'"></ui-img>
                </div>
                <div class="gz-ewm-bottom">
                    关注后可收到课程最新动态哦
                </div>
            </div>
        </ui-layer>
        <router-view></router-view>
    </ui-layout>
</template>

<script>
import pay from "../../mixin/pay";
import math from "../../utils/math";
import { preImg } from "../../../config/project/project.env";
import UiLayer from "../../components/UiLayer.vue";
import { MTS } from "../../utils/constants";
import orderBy from "lodash/orderBy";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    mixins: [pay],
    components: { UiLayer },
    data() {
        return {
            preImg: preImg,
            math: math,
            id: this.$route.query.id,
            tab: {
                activeTab: "lt",
                tabs: {
                    lt: {
                        name: "聊天",
                        key: "lt"
                    },
                    kt: {
                        name: "课程介绍",
                        key: "kt"
                    }
                }
            },
            layers: {
                layer1: false,
                layer2: false,
                layer3: false,
                layer4: false
            },
            gifts: [],
            course: {},
            content: "",
            sendGift: {
                money: 0,
                no: 1
            },
            giftCount: 1,
            style: {}
        };
    },
    created() {
        this.queryGift();
    },
    mounted() {
        this.lessonDetail();
    },
    methods: {
        lessonDetail() {
            this.$get("lessonDetail", this.id).then(res => {
                this.course = res;
                shareAll({
                    title: `「期望财经」《${this.course.name}》进行中…`,
                    // desc: this.course.description,
                    desc: `讲师：${this.course.autherName}，已有${this.course.viewCount}人学习`,
                    path: `/lesson/lessonDetail?id=${this.course.classRoomId}`,
                    imgUrl: this.preImg + this.course.auther
                });
                let youkuplayer = this.$refs.youkuplayer;
                this.style = { height: youkuplayer.clientWidth * 720 / 1280 + "px" };
                let self = this;
                if (window.YKU) {
                    new window.YKU.Player("youkuplayer", {
                        styleid: "0",
                        client_id: "1e8ad21af50a97a6",
                        vid: res.videoName,
                        newPlayer: true,
                        // autoplay: true,
                        events: {
                            onPlayStart() {
                                self.$post("finishTask", { taskId: 11 });
                            }
                        }
                    });
                }
            });
        },
        queryGift() {
            this.$get("queryGift").then(res => {
                this.gifts = res;
            });
        },
        saveComment() {
            if (!this.content) return this.$toast("请输入留言内容");
            this.$post("saveComment", {
                content: this.content,
                type: MTS.Lesson.mt,
                businessId: this.course.id,
                parent: 0,
                beCommentUser: this.course.auther
            }).then(() => {
                let user = this.Store.get("$user");
                this.course.commentDTOS.push({
                    commentUserName: user.name,
                    createTime: new Date().getTime(),
                    content: this.content
                });
                this.content = "";
            });
        },
        sendBtn() {
            if (!this.sendGift.id) return this.$toast("请选择礼物");
            if (!this.sendGift.no) return this.$toast("请填写礼物数量");
            if (this.sendGift.no <= 0) return this.$toast("礼物数量有误");
            this.layers.layer2 = true;
        },
        chooseGift(g) {
            g.no = this.sendGift.no;
            this.sendGift = g;
        },
        pay(flag) {
            if (!this.course.id) return this.$toast("数据加载失败，请刷新重试");
            this.$pay(
                flag,
                {
                    amount: this.math.mul(this.sendGift.no, this.sendGift.money),
                    receiver: this.course.auther,
                    type: MTS.Lesson.mt,
                    businessId: this.course.id,
                    giftId: this.sendGift.id,
                    giftCount: this.sendGift.no
                },
                "PAY_GIVE_GIFT"
            ).then(() => {
                let user = this.Store.get("$user");
                this.course.giftRecordDTOS.push({
                    sendUserName: user.name,
                    createTime: new Date().getTime(),
                    giftName: this.sendGift.giftName,
                    photo: this.sendGift.photo,
                    no: this.sendGift.no
                });
                this.layers.layer1 = false;
                this.layers.layer2 = false;
            });
        },
        saveCollect() {
            if (!this.course.id) return this.$toast("数据加载失败，请刷新重试");
            this.$post("saveCollect", {
                type: MTS.Lesson.mt,
                businessId: this.course.id
            })
                .then(() => {
                    this.layers.layer3 = false;
                    this.$toast('已收藏至"我的收藏"');
                })
                .catch(() => {
                    this.layer = false;
                });
        },
        saveLike() {
            if (this.course.liked) return this.$toast("您已经点过赞");
            this.$post("checkLike", {
                type: MTS.Lesson.mt,
                businessId: this.id
            }).then(res => {
                if (res) {
                    this.$set(this.course, "liked", true);
                    this.$toast("您已经点过赞");
                } else {
                    this.$post("saveLike", {
                        type: MTS.Lesson.mt,
                        businessId: this.id
                    }).then(() => {
                        this.$set(this.course, "liked", true);
                        this.course.likes++;
                        this.$toast("点赞成功");
                    });
                }
            });
        }
    },
    computed: {
        chats() {
            let chats = [];
            if (this.course.giftRecordDTOS) {
                let chats1 = this.course.giftRecordDTOS.map(v => {
                    return {
                        user: v.sendUserName,
                        time: v.createTime,
                        type: "gift",
                        giftName: v.giftName,
                        photo: v.photo,
                        no: v.no || v.count || 1
                    };
                });
                chats.push(...chats1);
            }
            if (this.course.commentDTOS) {
                let chats2 = this.course.commentDTOS.map(v => {
                    return {
                        user: v.commentUserName,
                        time: v.createTime,
                        type: "comment",
                        content: v.content
                    };
                });
                chats.push(...chats2);
            }
            return orderBy(chats, ["time"], ["asc"]);
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.lesson-warp {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.course-chat {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: 15px;
    overflow: hidden;
    .course-chat-title {
        padding: 6px 0;
        text-align: center;
        font-size: 16px;
        color: #333;
    }
    .course-chats {
        flex: 1;
        overflow: auto;
        background: #f7f7f7;
        padding: 10px;
        .course-chat-detail {
            display: flex;
            font-size: 14px;
            color: #4a4a4a;
            margin: 5px 0;
            .course-chat-name {
                color: @info;
            }
            .course-chat-content {
                flex: 1;
            }
        }
    }
}
.chat-gift {
    .chat-gift-name {
        padding: 2px 25px 2px 0;
        background: no-repeat 100% center;
        background-size: 20px 20px;
        &.xyc {
            background-image: url("../../assets/img/gift/Group 93@2x.png");
        }
        &.fgc {
            background-image: url("../../assets/img/gift/Group 97@2x.png");
        }
        &.byhz {
            background-image: url("../../assets/img/gift/Group 94@2x.png");
        }
        &.djdl {
            background-image: url("../../assets/img/gift/Group 96@2x.png");
        }
        &.ztyh {
            background-image: url("../../assets/img/gift/Group 91@2x.png");
        }
        &.dtyh {
            background-image: url("../../assets/img/gift/Group 92@2x.png");
        }
        &.xymm {
            background-image: url("../../assets/img/gift/Group 9@2x.png");
        }
        &.jn {
            background-image: url("../../assets/img/gift/Group 95@2x.png");
        }
    }
    .chat-gift-no {
        font-size: 12px;
    }
}
.chat-ib {
    display: flex;
    .chat-input {
        flex: 1;
        padding: 7.5px 5px 7.5px 10px;
        input {
            width: 100%;
            height: 35px;
            background: #edeef2;
            border-radius: 2px;
            font-size: 14px;
            padding-left: 10px;
        }
    }
    .chat-btns {
        display: flex;
        padding-right: 5px;
        button {
            width: 30px;
            height: 48px;
            padding: 0 5px;
            background: no-repeat center;
            background-size: 17px auto;
            &.ly {
                background-image: url("../../assets/img/评论@2x.png");
            }
            &.lw {
                background-image: url("../../assets/img/礼物@2x.png");
            }
            &.ds {
                background-image: url("../../assets/img/钱包@2x.png");
            }
            &.zan {
                background-image: url("../../assets/img/点赞@2x.png");
                &.active {
                    background-image: url("../../assets/img/点赞1@2x.png");
                }
            }
            &.send {
                width: 40px;
                height: 30px;
                margin: 10px;
                background: @info;
                border-radius: 4px;
                font-size: 12px;
                color: #fff;
            }
        }
    }
}
.send-gift {
    background: white;
    border-radius: 4px 4px 0 0;
    .send-gift-title {
        padding: 20px 0 10px 0;
        text-align: center;
        font-size: 16px;
        color: #333;
    }
    .gifts {
        display: flex;
        flex-wrap: wrap;
        .gift {
            width: 25%;
            font-size: 13px;
            text-align: center;
            background: no-repeat center 10px;
            background-size: 50px 50px;
            padding-top: 70px;
            &.active {
                .gift-name {
                    color: #f45574;
                }
            }
            .gift-name {
                color: #333;
            }
            .gift-price {
                color: #f45574;
            }
        }
    }
    .send-gift-opt {
        display: flex;
        padding: 15px;
        .send-gift-money {
            flex: 1;
            font-size: 16px;
            color: #333;
            > span {
                color: #f45574;
            }
        }
        .send-gift-sb {
            display: flex;
            .select {
                position: relative;
                width: 70px;
                height: 28px;
                line-height: 28px;
                border: 1px solid @info;
                border-radius: 30px 0 0 30px;
                font-size: 16px;
                color: #333;
                text-align: center;
                > select {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    outline: none;
                    opacity: 0;
                }
            }
            > input {
                width: 70px;
                height: 28px;
                text-align: center;
                border: 1px solid @info;
                border-radius: 30px 0 0 30px;
                font-size: 16px;
                color: #333;
            }
            > button {
                width: 56px;
                height: 28px;
                padding: 3px 0;
                background: @info;
                border-radius: 0 30px 30px 0;
                font-size: 14px;
                color: white;
            }
        }
    }
}
.btn-yg {
    display: flex;
    margin-left: 20px;
    > button {
        height: 36px;
        padding: 0 20px;
        font-size: 16px;
        color: white;
        background: @info;
        margin: 0;
    }
    .btn-yq {
        opacity: 0.7;
        &:active {
            opacity: 0.3;
        }
    }
}
.course-jj {
    flex: 1;
    padding: 10px;
    overflow: auto;
    .course-jj-title {
        padding: 5px 0;
        font-size: 16px;
        color: #4a4a4a;
    }
    .course-jj-content {
        font-size: 14px;
        color: #4a4a4a;
    }
}
.gz-ewm {
    background: white;
    text-align: center;
    .gz-ewm-title {
        padding-top: 20px;
        font-size: 16px;
        color: #333;
        > span {
            color: @info;
        }
    }
    .gz-ewm-img {
        img {
            display: block;
            width: 258px;
            margin: 0 auto;
        }
    }
    .gz-ewm-bottom {
        padding-bottom: 20px;
        font-size: 14px;
        color: #999;
    }
}
</style>
