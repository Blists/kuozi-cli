<template>
    <div>
        <div class="common-pl-item hr-bottom" :class="{simple:simple}">
            <template v-if="simple">
                <div class="common-hf">
                    <span class="text-info" v-text="comment.commentUserName+'：'" @click.stop="$to({name:'homePage',query:{loginName:comment.commentUser}})"></span>
                    <span v-text="comment.content" @click.stop="activePl(comment.id,comment.commentUser,comment.commentUserName)"></span>
                </div>
                <template v-if="comment.childs&&comment.childs.length>0">
                    <div class="common-hf" v-for="(hf,index) in comment.childs" v-if="index<5" :key="hf.id" @click.stop="activePl(comment.id,hf.commentUser,hf.commentUserName)">
                        <span>
                            <span class="text-info" v-text="hf.commentUserName"></span>回复
                            <span class="text-info" v-text="hf.beCommentUserName"></span>：
                            <span v-text="hf.content"></span>
                        </span>
                    </div>
                    <!-- <div class="common-hf" v-if="comment.childs&&comment.childs.length>5">
                        <button class="common-pl-hf-all" @click.stop="show=true">查看全部</button>
                    </div> -->
                </template>
            </template>
            <template v-else>
                <div class="common-pl-info">
                    <div class="common-pl-user-img" @click.stop="$to({name:'homePage',query:{loginName:comment.commentUser}})">
                        <ui-img :src="preImg+comment.commentUser"></ui-img>
                    </div>
                    <div class="common-pl-user" @click.stop="$to({name:'homePage',query:{loginName:comment.commentUser}})">
                        <div class="common-pl-user-name" v-text="comment.commentUserName"></div>
                        <div class="common-pl-user-time">
                            <span v-if="index">{{index+1}}楼</span> {{comment.createTime|dateFmt('MM.dd hh:mm')}}</div>
                    </div>
                    <div class="common-pl-conut">
                        <div>
                            <span class="common-pl-zanno" :class="{active:comment.liked}" v-text="comment.commentLike||0" @click.stop="saveLike"></span>
                            <span class="common-pl-hfno" v-text="comment.commentCount||0"></span>
                        </div>
                    </div>
                </div>
                <div class="common-pl-content" v-text="comment.content" @click.stop="activePl(comment.id,comment.commentUser,comment.commentUserName)"></div>
                <div class="common-pl-hfs" v-if="comment.childs&&comment.childs.length>0">
                    <div class="common-pl-hf" v-for="(hf,index) in comment.childs" v-if="index<5" :key="hf.id" @click.stop="activePl(comment.id,hf.commentUser,hf.commentUserName)">
                        <span>
                            <span class="text-info" v-text="hf.commentUserName"></span>回复
                            <span class="text-info" v-text="hf.beCommentUserName"></span>：
                            <span v-text="hf.content"></span>
                        </span>
                    </div>
                    <div class="common-pl-hf" v-if="comment.childs&&comment.childs.length>5">
                        <button class="common-pl-hf-all" @click.stop="show=true">查看全部</button>
                    </div>
                </div>
            </template>
        </div>
        <ui-layer :show.sync="show" postion="bottom" full>
            <comment-detail :comment="comment" @close="close" :type="type" :business-id="businessId"></comment-detail>
        </ui-layer>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { MTS } from "../../utils/constants";
import UiLayer from "../UiLayer.vue";
import CommentDetail from "./CommentDetail.vue";
export default {
    props: {
        comment: {},
        detail: {},
        simple: {
            type: Boolean,
            default: false
        },
        index: {},
        businessId: {},
        type: {}
    },
    components: { UiLayer, CommentDetail },
    data() {
        return {
            preImg: preImg,
            show: false
        };
    },
    methods: {
        // 点赞
        saveLike() {
            this.$post("checkLike", {
                type: MTS.Comment.mt,
                businessId: this.comment.id
            }).then(res => {
                if (res) {
                    this.$set(this.comment, "liked", true);
                    this.$toast("您已经点过赞");
                } else {
                    this.$post("saveLike", {
                        type: MTS.Comment.mt,
                        businessId: this.comment.id
                    }).then(r => {
                        this.$set(this.comment, "liked", true);
                        this.comment.commentLike++;
                        this.$toast("点赞成功");
                    });
                }
            });
        },
        activePl(id, user, username) {
            this.$emit("comment", id, user, username);
        },
        close() {
            this.show = false;
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.common-pls {
    .common-pls-title {
        padding: 10px 0;
        text-align: center;
        font-size: 14px;
        color: @info;
    }
}

.common-pl-items {
    background: white;
    &.padding {
        padding: 10px;
    }
    .common-pl-item {
        padding-top: 15px;
        &:last-child {
            &::after {
                content: none;
            }
            &::before {
                content: none;
            }
        }
        &.simple {
            padding-top: 5px;
        }
        .common-hf {
            font-size: 14px;
        }
        .common-pl-info {
            padding: 0 15px;
            display: flex;
            > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .common-pl-user-img {
                margin-right: 10px;
                img {
                    width: 24px;
                    height: 24px;
                    border-radius: 24px;
                }
            }
            .common-pl-user {
                flex: 1;
                .common-pl-user-name {
                    font-size: 12px;
                    color: #333;
                }
                .common-pl-user-time {
                    font-size: 8px;
                    color: #999;
                }
            }
            .common-pl-conut {
                font-size: 12px;
                color: #999;
                .common-pl-zanno {
                    padding-right: 20px;
                    background: url("../../assets/img/点赞@2x.png") no-repeat right center;
                    background-size: auto 13px;
                    &.active {
                        background-image: url("../../assets/img/点赞1@2x.png");
                    }
                }
                .common-pl-hfno {
                    margin-left: 10px;
                    padding-right: 20px;
                    background: url("../../assets/img/评论@2x.png") no-repeat right center;
                    background-size: auto 13px;
                }
            }
        }
        .common-pl-content {
            padding: 15px 20px 15px 50px;
            font-size: 16px;
            color: #4a4a4a;
            &.self {
                padding-left: 15px;
            }
        }
        .common-pl-hfs {
            margin: 0 15px 0 50px;
            padding-bottom: 15px;
            border-radius: 2px;
            font-size: 12px;
            color: #4a4a4a;
            .common-pl-hf {
                padding: 5px 8px;
                background: #f8f8f9;
                &:first-child {
                    padding-top: 10px;
                }
                &:last-child {
                    padding-bottom: 10px;
                }
            }
            .common-pl-hf-all {
                font-size: 13px;
                color: #999;
                padding: 0 10px 0 0;
                background: url("../../assets/img/Group Copy 6@2x.png") no-repeat right center;
                background-size: 7px auto;
            }
        }
    }
}
</style>
