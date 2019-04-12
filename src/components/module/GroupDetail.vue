<template>
    <ui-layout>
        <ui-head v-if="groupInfo" :transparent="true" :title="title">
            <div class="btn-text" v-if="group.type&&group.type==ROLE.GROUP_LEADER.type" slot="right" @click="groupNew">编辑</div>
        </ui-head>
        <ui-head v-else :transparent="noJoin?false:transparent" :title="noJoin?title:t">
            <div class="btn-more" slot="right" @click="$to({name:'groupMore',query:{groupId:groupId,photo:group.photo,groupName:title,type:group.type,totalNumber:group.totalNumber}})"></div>
        </ui-head>
        <template v-if="show">
            <div v-show="!groupInfo&&!noJoin&&!transparent" class="group-detail-btns">
                <button v-if="group.type&&(group.type==ROLE.GROUP_LEADER.type || group.type==ROLE.GROUP_ADMIN.type || group.type==ROLE.GUEST.type)" @click="$to({name:'groupNewPost',query:{groupName:title,groupId:groupId}})">发帖</button>
                <button @click="$to({name:'groupQuestionList',query:{groupId:groupId,type:group.type}})">提问</button>
                <button @click="$to({name:'groupEssence',query:{groupId:groupId,type:group.type}})">精华</button>
            </div>
            <ui-container v-if="groupInfo" class="group-container" style="background:white">
                <div class="group-detail">
                    <div class="group-detail-auth">
                        <ui-bg :bg="group.photo" :img="group.leaderPhoto"></ui-bg>
                        <div class="group-auth-name" v-text="group.leaderNickName"></div>
                        <div class="group-detail-name" v-text="group.name"></div>
                        <!-- <div class="group-share" style="margin-top:30px">
                            <button>
                                <span></span>分享圈子
                            </button>
                        </div> -->
                        <div class="group-detail-ms" style="display:block" v-text="group.description"></div>
                        <div class="group-detail-domains" style="display:block">
                            <span v-for="domain in group.domains" :key="domain.id" class="group-detail-domain" v-text="domain.name"></span>
                        </div>
                    </div>
                </div>
            </ui-container>
            <ui-container v-else @scroll.native="scroll" class="group-container">
                <div class="group-detail" :class="{'no-join':noJoin}">
                    <div class="group-detail-auth">
                        <div v-if="noJoin" class="group-auth-img">
                            <ui-img :src="preImg+group.leaderPhoto"></ui-img>
                        </div>
                        <ui-bg v-else :bg="group.photo" :img="group.leaderPhoto"></ui-bg>
                        <div class="group-auth-name" v-text="group.leaderNickName"></div>
                        <div class="group-detail-name" v-text="group.name"></div>
                        <div class="group-detail-ms" v-text="group.description"></div>
                        <div class="group-detail-domains">
                            <span v-for="domain in group.domains" :key="domain.id" class="group-detail-domain" v-text="domain.name"></span>
                        </div>
                        <div class="group-detail-member" style="padding-bottom:10px;">
                            <div class="group-detail-member-no">圈友
                                <span v-text="group.totalNumber"></span>+</div>
                            <div class="group-detail-members" @click="$to({name:'groupMember',query:{groupId:groupId}})">
                                <div>他们都在</div>
                                <div class="group-detail-member-imgs">
                                    <ui-img v-for="leader in leaders" :key="leader.id" :src="preImg+leader.user"></ui-img>
                                </div>
                                <div class="group-detail-member-more"></div>
                            </div>
                        </div>
                    </div>
                    <div v-show="transparent" class="group-detail-btns hr-bottom">
                        <button v-if="group.type&&(group.type==ROLE.GROUP_LEADER.type || group.type==ROLE.GROUP_ADMIN.type || group.type==ROLE.GUEST.type)" @click="$to({name:'groupNewPost',query:{groupName:title,groupId:groupId}})">发帖</button>
                        <button @click="$to({name:'groupQuestionList',query:{groupId:groupId,type:group.type}})">提问</button>
                        <button @click="$to({name:'groupEssence',query:{groupId:groupId,type:group.type}})">精华</button>
                    </div>
                    <div v-show="posts&&posts.length>0" class="group-posts hr-top hr-bottom" style="margin-top: 20px;">
                        <ui-loadmore :pull="pull" :loadmore="postsQueryByPage" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                            <group-post v-for="(post,i) in posts" v-if="!noJoin||i<3" :key="post" :group-id="groupId" :post="post" @detail="detail(i)" :simple="noJoin" @top="top(post,i)" @un-top="unTop(post)" :type="group.type"></group-post>
                        </ui-loadmore>
                    </div>
                </div>
            </ui-container>
            <div v-if="!groupInfo&&noJoin" class="group-bottom-btn" @click="join" v-text="group.free?'免费加入':`${group.money||0}元/年加入`"></div>
        </template>
        <ui-layer :show.sync="layer" @click="showSelectCoupon=false">
            <div class="layer-content overflow-hidden">
                <div class="pay-info">
                    <div class="pay-title">实付金额</div>
                    <div class="pay-money">￥{{math.sub(group.money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)}}
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
                <div v-if="math.sub(group.money,selectCouponIndex==-1?0:canUseCoupons[selectCouponIndex].value)>wallet.withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                <div class="cell-btn" @click="pay('wx')">微信支付</div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="showDetail1" postion="bottom" full>
            <ui-layout>
                <ui-head title="帖子详情" :backClick="closeDetail"></ui-head>
                <ui-container>
                    <group-post :post="posts[activePostIndex]" :group-id="groupId" detail></group-post>
                </ui-container>
            </ui-layout>
        </ui-layer>
        <ui-layer :show.sync="showDetail2" postion="bottom" full>
            <ui-layout>
                <ui-head title="帖子详情" :backClick="closeDetail"></ui-head>
                <ui-container>
                    <group-post :post="postDetail" :group-id="groupId" detail></group-post>
                </ui-container>
            </ui-layout>
        </ui-layer>
    </ui-layout>
</template>

<script>
import GroupPost from "./GroupPost.vue";
import { preImg } from "../../../config/project/project.env";
import { ROLE } from "../../utils/constants";
import UiBg from "../UiBg.vue";
import UiLayer from "../UiLayer.vue";
import pay from "../../mixin/pay";
import loadmore from "../../mixin/loadmore";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    props: {
        groupId: {},
        title: {},
        groupInfo: {
            type: Boolean,
            default: false
        },
        activePostId: {
            type: String,
            default: ""
        },
        inviter: {
            type: String,
            default: ""
        }
    },
    mixins: [pay, loadmore],
    components: { GroupPost, UiLayer, UiBg },
    data() {
        return {
            ROLE: ROLE,
            show: false,
            t: "",
            layer: false,
            pageNo: 0,
            transparent: true,
            noJoin: true,
            preImg: preImg,
            posts: [],
            group: {},
            loading: false,
            allLoaded: false,
            leaders: {},
            wallet: {},
            showDetail1: false,
            showDetail2: false,
            activePostIndex: 0,
            postDetail: {}
        };
    },
    mounted() {
        if (!this.groupInfo) {
            this.pageLoading();
            this.postsQueryByPage();
        }
        this.groupBasicDetail();
        this.listCommonUsersByPage();
        if (window.login) {
            this.$store.commit("groupRead", this.groupId);
        }
        // 带邀请嘉宾的分享码的 提醒用户是否接受成为嘉宾
        let flag = this.Store.get(this.inviter);
        if (this.inviter && !flag) {
            this.showInviter();
        }
    },
    methods: {
        showInviter() {
            this.$messagebox({
                title: "提示",
                message: "接受邀请成为嘉宾?",
                showCancelButton: true
            }).then(res => {
                if (res == "confirm") {
                    this.$post("acceptBeGuest", { inviter: this.inviter }).then(() => {
                        this.Store.set(this.inviter, true);
                        this.groupBasicDetail();
                    });
                }
            });
        },
        shareGroup() {
            shareAll({
                title: `「期望财经」我发现了${this.group.leaderNickName}的<${this.group.name}>，好多大佬都在哟`,
                desc: "加入圈子，与行业资深人士探讨学习，成长路上有师亦有友",
                path: `/group/groupDetail?groupId=${this.groupId}&title=${this.group.name}`,
                imgUrl: this.preImg + this.group.photo
            });
        },
        sharePost(info) {
            shareAll(info);
        },
        scroll($event) {
            if ($event.target.scrollTop < 302 - 64) {
                this.transparent = true;
                this.t = "";
            } else {
                this.transparent = false;
                this.t = this.title;
            }
        },
        listCommonUsersByPage() {
            this.$post("listCommonUsersByPage", {
                groupId: this.groupId,
                pageNo: 1,
                pageSize: 8,
                normal: 0
            }).then(res => {
                this.leaders = res.results;
            });
        },
        // 圈子详情
        groupBasicDetail() {
            this.$get("groupBasicDetail", this.groupId).then(res => {
                this.group = res;
                if (res.type != ROLE.NO_JOIN.type) {
                    this.noJoin = false;
                }
                if (this.activePostId) {
                    this.getPostDetail();
                } else {
                    this.shareGroup();
                }
                this.show = true;
            });
        },
        // 帖子/精华
        postsQueryByPage() {
            this.loading = true;
            this.pageNo++;
            this.$post("postsQueryByPage", {
                essence: 0,
                groupId: this.groupId,
                pageNo: this.pageNo,
                pageSize: this.PageSize
            }).then(res => {
                this.loading = false;
                this.posts.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.$nextTick(() => {
                    this.pageLoaded();
                    this.loadMoreLoaded(this.pageNo);
                });
            });
        },
        getPostDetail() {
            this.$post("postsQueryById", {
                essence: 0,
                groupId: this.groupId,
                pageNo: 1,
                pageSize: 1,
                postsId: this.activePostId
            }).then(res => {
                this.postDetail = res.results[0];
                this.showDetail2 = true;
                this.sharePost({
                    title: `「期望财经」${this.postDetail.sponsorNickName}发布了：${this.postDetail.question}`,
                    desc: "加入圈子，查看更多",
                    path: `/group/groupDetail?groupId=${this.groupId}&title=${this.group.title}&activePostId=${this.postDetail.id}`,
                    imgUrl: this.preImg + this.group.photo
                });
            });
        },
        pull() {
            this.posts = [];
            this.pageNo = 0;
            this.postsQueryByPage();
        },
        join() {
            if (this.login) {
                if (this.group.free) {
                    this.$get("applyJoinGroup", this.groupId).then(() => {
                        if (!this.group.needAudit) {
                            this.noJoin = false;
                            this.groupBasicDetail();
                            this.$toast("加入成功");
                        } else {
                            this.$toast("申请成功");
                        }
                    });
                } else {
                    this.queryCanUseCoupon("Group", this.groupId, this.group.money).then(() => {
                        this.layer = true;
                    });
                }
            } else {
                sessionStorage.setItem("$path", this.$route.fullPath);
                this.$to({ name: "login" });
            }
        },
        pay(flag) {
            this.$pay(
                flag,
                {
                    amount: this.group.money,
                    groupId: this.groupId
                },
                "PAY_JOIN_GROUP"
            ).then(() => {
                this.noJoin = false;
                this.layer = false;
                this.$toast("加入成功");
            });
        },
        top(post, i) {
            for (let p of this.posts) {
                if (p.top) {
                    p.top = 0;
                }
            }
            post.top = i;
            this.posts.splice(i, 1);
            this.posts.unshift(post);
        },
        unTop(post) {
            this.posts.splice(post.top, 0, post);
            this.posts.splice(0, 1);
        },
        detail(index) {
            this.activePostIndex = index;
            this.sharePost({
                title: `「期望财经」${this.posts[this.activePostIndex].sponsorNickName}发布了：${this.posts[this.activePostIndex].question}`,
                desc: "加入圈子，查看更多",
                path: `/group/groupDetail?groupId=${this.groupId}&title=${this.group.title}&activePostId=${this.posts[this.activePostIndex].id}`,
                imgUrl: this.preImg + this.group.photo
            });
            this.showDetail1 = true;
        },
        closeDetail() {
            this.shareGroup();
            this.showDetail1 = false;
            this.showDetail2 = false;
        },
        groupNew() {
            let groupNew = {
                id: this.group.id,
                name: this.group.name,
                photo: this.group.photo,
                description: this.group.description,
                free: !!this.group.free,
                money: this.group.money,
                domains: this.group.domains
            };
            this.Store.set("groupNew", groupNew);
            this.$to({ name: "groupNew" });
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.group-container {
    background: @gray;
}
.group-detail {
    .group-detail-auth {
        position: relative;
        // padding-top: 150px;
        // padding-bottom: 20px;
        background: white;
        .group-detail-bg {
            position: absolute;
            top: 0;
            height: 200px;
            width: 100%;
            overflow: hidden;
            > img {
                position: absolute;
                bottom: 0;
                display: block;
                width: 100%;
                min-height: 200px;
            }
        }
        .group-auth-img {
            position: relative;
            width: 78px;
            height: 78px;
            z-index: 1;
            margin: 0 auto;
            border: 3px solid white;
            border-radius: 78px;
            overflow: hidden;
            img {
                display: block;
                width: 100%;
                height: 100%;
                background: #fff;
            }
        }
        .group-auth-name {
            height: 26px;
            line-height: 26px;
            text-align: center;
            font-size: 14px;
            color: #333;
        }
        .group-detail-name {
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: 21px;
            color: #333;
        }
        .group-detail-ms {
            display: none;
            padding: 15px 15px;
            font-size: 14px;
            color: #666;
        }
        .group-detail-domains {
            display: none;
            text-align: center;
            .group-detail-domain {
                display: inline-block;
                padding: 4px 9px;
                margin: 5px;
                border: 1px solid @info;
                border-radius: 2px;
                font-size: 12px;
                color: @info;
            }
        }
        .group-detail-member {
            display: none;
            .group-detail-member-no {
                padding: 10px 0;
                text-align: center;
                font-size: 12px;
                color: #333;
            }
            .group-detail-members {
                display: flex;
                font-size: 12px;
                padding: 0 10px;
                color: #999;
                .group-detail-member-imgs {
                    flex: 1;
                    margin-left: 20px;
                    > img {
                        display: inline-block;
                        width: 23px;
                        height: 23px;
                        border-radius: 23px;
                        margin-right: 5px;
                    }
                }
                .group-detail-member-more {
                    width: 20px;
                    background: url("../../assets/img/Group Copy 6@2x.png") no-repeat center;
                    background-size: 7px auto;
                }
            }
        }
    }
    &.no-join {
        .group-detail-auth {
            // height: 350px;
            background: white;
            padding-top: 20px;
            .group-auth-img {
                border-color: #bfddff;
            }
            .group-auth-name {
                font-size: 18px;
                padding: 10px 0;
            }
            .group-detail-name {
                display: none;
            }
            .group-detail-ms {
                display: block;
            }
            .group-detail-domains {
                display: block;
            }
            .group-detail-member {
                display: block;
            }
        }
        .group-detail-btns {
            display: none;
        }
    }
}
.group-bottom-btn {
    height: 45px;
    line-height: 45px;
    text-align: center;
    background: linear-gradient(to right, #7ec5f4, #8f79ee);
    font-size: 18px;
    color: white;
}
.group-detail-btns {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    background: white;
    transition: all 0.5s;
    > button {
        height: 30px;
        padding: 0 30px;
        background: @info;
        border-radius: 4px;
        margin: 0 10px;
        font-size: 13px;
        color: #fff;
    }
    &.fixed {
        position: fixed;
        width: 100%;
        top: @ztl1 + @head-height;
        left: 0;
        z-index: 1;
    }
}
@media screen and (min-width: @max-width) {
    .group-detail-btns {
        &.fixed {
            width: @max-width;
            left: 50%;
            margin-left: -@max-width / 2;
        }
    }
}
</style>
