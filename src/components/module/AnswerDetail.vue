<template>
    <div class="answer-component detail">
        <div class="answer-component-detail">
            <div class="answer-auth">
                <div class="answer-auth-img">
                    <ui-img :src="preImg+(answer.target||answer.targetPhoto)"></ui-img>
                </div>
                <div class="answer-auth-info">
                    <div class="answer-auth-name" v-text="answer.targetNickName||answer.targetName"></div>
                    <div class="answer-auth-time">{{answer.createTime|dateFmt('yyyy/MM/dd hh:mm')}}</div>
                </div>
            </div>
            <div class="answer-question">
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
                    <div class="answer-text" v-text="answer.answer"></div>
                </div>
                <div v-else class="answer-text">回答：
                    <span v-text="answer.answer"></span>
                </div>
            </template>
            <div class="common-opts">
                <span class="zan" :class="{active:answer.checkLike}" @click.stop="saveLike()"></span>
                <span class="hf" @click="resetParamPl(true)"></span>
                <!-- <span class="ds" @click="tips"></span> -->
                <!-- <span class="fx" @click="share"></span> -->
            </div>
            <div v-if="answer.likeDTOS&&answer.likeDTOS.length>0" class="common-zans">
                <span class="common-zan-btn"></span>
                <span class="common-zan-ren" v-text="answer.likeDTOS.map(v=>v.userName).join('，')"></span>
            </div>
            <div v-if="answer.commentDTOS&&answer.commentDTOS.length>0" class="common-pls">
                <div class="common-pls-title hr-bottom">评论</div>
                <div class="common-pl-items">
                    <comment-item v-for="(c,i) in answer.commentDTOS" :key="c.id" :comment="c" :index="i" :type="commentType" :business-id="answer.id" @comment="activePl"></comment-item>
                </div>
            </div>
        </div>
        <div class="answer-pl-input hr-top" @click="showCommentLayer">
            <input ref="input" v-model="paramPl.content" type="text" :placeholder="paramPl.placeholder" @keyup.enter="saveComment" readonly>
            <button v-if="paramPl.content" @click="saveComment">发送</button>
        </div>
        <ui-root>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="saveComment" no-picture></ui-send>
            </ui-layer>
        </ui-root>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { MTS, ROLE } from "../../utils/constants";
import CommentItem from "./CommentItem.vue";
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
        detail: {
            type: Boolean,
            default: true
        }
    },
    mixins: [comment],
    components: { CommentItem },
    data() {
        return {
            preImg: preImg
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
</style>
