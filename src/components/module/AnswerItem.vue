<template>
    <div class="answer-component">
        <div class="answer-component-detail">
            <div class="flex">
                <div class="answer-auth flex-1">
                    <div class="answer-auth-img">
                        <ui-img :src="preImg+(answer.target||answer.targetPhoto)"></ui-img>
                    </div>
                    <div class="answer-auth-info">
                        <div class="answer-auth-name" v-text="answer.targetNickName||answer.targetName"></div>
                        <div class="answer-auth-time">{{answer.createTime|dateFmt('yyyy/MM/dd hh:mm')}}</div>
                    </div>
                </div>
                <div v-if="status" class="answer-status">
                    <span v-if="answer.status==4">已过期</span>
                </div>
            </div>
            <div class="answer-question" @click="showDetailPage">
                <span class="text-info" v-text="answer.sponsorNickName||answer.sponsorName"></span>
                <span>提问：</span>
                <span v-text="answer.question">提问：</span>
            </div>
            <template v-if="answer.answer">
                <div v-if="collapse" class="answer-collapse" :class="{active:answer.showAnswer}" @click="$set(answer,'showAnswer',!answer.showAnswer)">
                    <div class="answer-collapse-title">
                        <div>回答：</div>
                        <div class="djyd">点击阅读</div>
                        <div class="ann"></div>
                    </div>
                    <div @click="showDetailPage" class="answer-text" v-text="answer.answer"></div>
                </div>
                <div v-else class="answer-text" @click="showDetailPage">回答：
                    <span v-text="answer.answer"></span>
                </div>
            </template>
            <div v-if="!noOperate" class="common-opts">
                <span class="zan" :class="{active:answer.checkLike}" @click.stop="saveLike()"></span>
                <!-- <span class="hf" @click="resetParamPl()"></span> -->
            </div>
            <div v-if="!noLike&&answer.likeDTOS&&answer.likeDTOS.length>0" class="common-zans">
                <span class="common-zan-btn"></span>
                <span class="common-zan-ren" v-text="answer.likeDTOS.map(v=>v.userName).join('，')"></span>
            </div>
            <div v-if="!noOperate&&answer.commentDTOS&&answer.commentDTOS.length>0" class="common-pls" @click="showDetailPage">
                <div class="common-pl-items">
                    <comment-item v-for="(c,i) in answer.commentDTOS" :key="c.id" :comment="c" :index="i" :type="commentType" :business-id="answer.id" simple></comment-item>
                </div>
            </div>
        </div>
        <ui-root>
            <ui-layer :show.sync="showDetail" postion="bottom" full>
                <ui-layout>
                    <ui-head title="详情" :backClick="closeDetail"></ui-head>
                    <ui-container>
                        <answer-detail :answer="answer" :collapse="collapse"></answer-detail>
                    </ui-container>
                </ui-layout>
            </ui-layer>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="saveComment" no-picture></ui-send>
            </ui-layer>
        </ui-root>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { MTS, ROLE } from "../../utils/constants";
import UiLayer from "../UiLayer.vue";
import CommentItem from "./CommentItem.vue";
import AnswerDetail from "./AnswerDetail.vue";
import comment from "../../mixin/comment";
export default {
    props: {
        answer: {
            type: Object,
            default: () => {}
        },
        collapse: {
            type: Boolean,
            default: false
        },
        noDetail: {
            type: Boolean,
            default: false
        },
        noOperate: {
            type: Boolean,
            default: false
        },
        noLike: {
            type: Boolean,
            default: false
        },
        noComment: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    mixins: [comment],
    components: { UiLayer, CommentItem, AnswerDetail },
    data() {
        return {
            preImg: preImg,
            showDetail: false
        };
    },
    created() {
        this.commentType = MTS.Posts.mt;
        this.commentBusinessId = this.answer.id;
        this.resetParamPl();
    },
    methods: {
        // 点赞
        saveLike() {
            this.$post("checkLike", {
                type: MTS.Posts.mt,
                businessId: this.answer.id
            }).then(res => {
                if (res) {
                    this.answer.checkLike = true;
                    this.$toast("您已经点过赞");
                } else {
                    this.$post("saveLike", {
                        type: MTS.Posts.mt,
                        businessId: this.answer.id
                    }).then(r => {
                        this.answer.checkLike = true;
                        let user = this.Store.get("$user") || {};
                        this.answer.likeDTOS.push({ userName: user.name });
                        this.$toast("点赞成功");
                    });
                }
            });
        },
        tips() {},
        share() {},
        showDetailPage($event) {
            if (!this.noDetail) {
                this.showDetail = true;
                $event.preventDefault();
                $event.stopPropagation();
            }
        },
        closeDetail() {
            this.showDetail = false;
        },
        queryComment() {
            this.$post("queryAnswerDetail", { postsId: this.answer.id }).then(res => {
                if (res.results && res.results.length > 0) {
                    this.answer.commentDTOS = res.results[0].commentDTOS;
                }
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.answer-component {
    &.detail {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .answer-component-detail {
        background: white;
        padding: 10px;
        flex: 1;
        overflow: auto;
        .answer-auth {
            display: flex;
            margin-top: 10px;
            .answer-auth-img {
                margin-right: 10px;
                > img {
                    display: block;
                    width: 35px;
                    height: 35px;
                    border-radius: 100%;
                }
            }
            .answer-auth-info {
                flex: 1;
                .answer-auth-name {
                    font-size: 14px;
                    color: #6597ef;
                }
                .answer-auth-time {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
        .answer-question {
            margin: 15px 0;
            padding-left: 10px;
            background: linear-gradient(to bottom, #ccc, #ccc) no-repeat 0;
            background-size: 2px 98%;
            font-size: 16px;
            color: #666;
        }
        .answer-collapse {
            padding: 5px 0;
            &.active {
                .answer-collapse-title {
                    opacity: 0.8;
                    border-radius: 3px 3px 0 0;
                    .djyd {
                        opacity: 0;
                    }
                    .ann {
                        transform: rotate(180deg);
                    }
                }
                .answer-text {
                    display: block;
                }
            }
            .answer-collapse-title {
                display: flex;
                border-radius: 3px;
                background: @info;
                padding: 7px 10px;
                color: white;
                .djyd {
                    flex: 1;
                    text-align: right;
                }
                .ann {
                    width: 34px;
                    background: url("../../assets/img/Group@2x 3 2.png") no-repeat center;
                    background-size: 14px auto;
                    transform: rotate(0);
                    transition: all 0.5s;
                }
            }
            .answer-text {
                display: none;
                padding: 10px;
                border: 1px solid #ccc;
                border-style: none solid solid;
            }
        }
        .answer-text {
            font-size: 16px;
            color: #333;
        }
    }
    .answer-pl-input {
        display: flex;
        padding: 8px 10px;
        background: white;
        > input {
            height: 34px;
            flex: 1;
            padding-left: 10px;
            background: #edeef2;
            border-radius: 3px;
        }
        > button {
            margin-left: 10px;
            padding: 0 10px;
            background: @info;
            border-radius: 3px;
            color: white;
        }
    }
}
.answer-status {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #ec4949;
}
</style>
