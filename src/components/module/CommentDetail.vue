<template>
    <ui-layout>
        <ui-head title="评论详情" :backClick="backClick"></ui-head>
        <ui-container class="bg-gray">
            <div class="common-pl-items padding">
                <div class="common-pl-item hr-bottom">
                    <div class="common-pl-info">
                        <div class="common-pl-user-img" @click="$to({name:'homePage',query:{loginName:comment.commentUser}})">
                            <ui-img :src="preImg+comment.commentUser"></ui-img>
                        </div>
                        <div class="common-pl-user" @click="$to({name:'homePage',query:{loginName:comment.commentUser}})">
                            <div class="common-pl-user-name" v-text="comment.commentUserName"></div>
                            <div class="common-pl-user-time">{{comment.createTime|dateFmt('MM.dd hh:mm')}}</div>
                        </div>
                    </div>
                    <div class="common-pl-content self" v-text="comment.content"></div>
                </div>
            </div>
            <div class="hr-10"></div>
            <div class="common-pl-items padding">
                <div class="common-pl-item hr-bottom" v-for="c in comment.childs" :key="c.id">
                    <div class="common-pl-info">
                        <div class="common-pl-user-img" @click="$to({name:'homePage',query:{loginName:c.commentUser}})">
                            <ui-img :src="preImg+c.commentUser"></ui-img>
                        </div>
                        <div class="common-pl-user" @click="$to({name:'homePage',query:{loginName:c.commentUser}})">
                            <div class="common-pl-user-name" v-text="c.commentUserName"></div>
                            <div class="common-pl-user-time">{{c.createTime|dateFmt('MM.dd hh:mm')}}</div>
                        </div>
                        <div class="common-pl-conut">
                            <div>
                                <span class="common-pl-zanno" :class="{active:c.liked}" v-text="c.commentLike||0" @click="saveLike(c)"></span>
                                <!-- <span class="common-pl-hfno" v-text="c.commentCount||0" @click="activePl(c.id,c.commentUser,c.commentUserName)"></span> -->
                            </div>
                        </div>
                    </div>
                    <div class="common-pl-content" @click="activePl(comment.id,c.commentUser,c.commentUserName)">
                        <span>回复</span>
                        <span class="text-info" v-text="c.beCommentUserName"></span>：
                        <span v-text="c.content"></span>
                    </div>
                </div>
            </div>
        </ui-container>
        <ui-root>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="saveCommentSelf" no-picture></ui-send>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>

<script>
import { MTS } from "../../utils/constants";
import { preImg } from "../../../config/project/project.env";
import CommentItem from "./CommentItem.vue";
import comment from "../../mixin/comment";
export default {
    props: { comment: {}, type: {}, businessId: {} },
    mixins: [comment],
    components: { CommentItem },
    data() {
        return {
            preImg: preImg
        };
    },
    created() {
        this.commentType = this.commentType;
        this.commentBusinessId = this.businessId;
        this.resetParamPl();
    },
    methods: {
        backClick() {
            this.$emit("close");
        },
        // 点赞
        saveLike(comment) {
            this.$post("checkLike", {
                type: MTS.Comment.mt,
                businessId: comment.id
            }).then(res => {
                if (res) {
                    this.$set(comment, "liked", true);
                    this.$toast("您已经点过赞");
                } else {
                    this.$post("saveLike", {
                        type: MTS.Comment.mt,
                        businessId: comment.id
                    }).then(r => {
                        this.$set(comment, "liked", true);
                        comment.commentLike++;
                        this.$toast("点赞成功");
                    });
                }
            });
        },
        saveCommentSelf() {
            let beCommentUserName = this.paramPl.beCommentUserName;
            this.saveComment().then(res => {
                let user = this.Store.get("$user") || {};
                this.comment.childs.push({
                    beCommentUser: this.paramPl.beCommentUser,
                    beCommentUserName: beCommentUserName,
                    childs: [],
                    commentCount: 1,
                    commentLike: 0,
                    commentUser: user.mobile,
                    commentUserName: user.name,
                    content: this.paramPl.content,
                    createTime: new Date().getTime(),
                    liked: false,
                    parent: this.paramPl.parent
                });
            });
        }
    }
};
</script>

<style lang="less">
.bottom-input {
    height: 50px;
    padding: 8px 15px 0 15px;
    > input {
        width: 100%;
        height: 34px;
        background: #edeef2;
        border-radius: 2px;
        padding-left: 5px;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #999;
        }
    }
}
</style>
