<template>
    <div v-if="show" class="group-post" :class="{'hr-bottom':!detail,'detail':detail}" @click="showDetail">
        <div class="group-post-auth" @click.stop="$to({name:'homePage',query:{loginName:post.sponsor}})">
            <div class="group-post-auth-img">
                <ui-img :src="preImg+post.sponsor"></ui-img>
            </div>
            <div class="group-post-auth-info">
                <div class="group-post-auth-name">
                    <span v-text="post.sponsorNickName||post.nickName||post.sponsor"></span>
                    <span v-if="post.top" class="post-top">置顶</span>
                </div>
                <div class="group-post-auth-time">{{post.createTime||post.create_time|dateFmt('yyyy/MM/dd hh:mm')}}</div>
            </div>
            <div v-if="!simple&&!noOperate" class="group-post-auth-more" @click.stop="layer.layer1=true"></div>
        </div>
        <div class="group-post-detail">
            <div class="group-post-text">
                <pre v-html="hyperLinks(post.question)"></pre>
            </div>
            <div v-if="!simple && post.imgs" class="group-post-imgs">
                <ui-photos :photos="post.imgs.split(',')" :pre-img="preImg" :pre-img-raw="preImgRaw" :default-img="preImg+'logo'"></ui-photos>
            </div>
        </div>
        <div v-if="!simple&&!noOperate" class="common-opts">
            <span class="zan" :class="{active:post.checkLike}" @click.stop="chan"></span>
            <span class="hf" @click.stop="activePl"></span>
            <!-- <span class="ds" @click.stop="tips"></span> -->
            <!-- <span class="fx" @click.stop="share"></span> -->
        </div>
        <div v-if="!simple&&post.likeDTOS&&post.likeDTOS.length>0" class="common-zans">
            <span class="common-zan-btn"></span>
            <span class="common-zan-ren" v-text="post.likeDTOS.map(v=>v.userName).join('，')"></span>
        </div>
        <div v-if="!simple" class="common-pl-items">
            <comment-item v-for="(c,i) in post.commentDTOS" v-if="detail?true:i<5" :key="c.id" :comment="c" :index="i" @comment="activePl" :type="commentType" :business-id="post.id" :simple="!detail"></comment-item>
        </div>
        <ui-root>
            <ui-layer :show.sync="layer.layer1">
                <div class="layer-content">
                    <div v-if="post.collected" class="cell-btn hr-bottom" @click="delCollect">取消收藏</div>
                    <div v-else class="cell-btn hr-bottom" @click="saveCollect">收藏</div>
                    <div v-if="!post.top&&(type==ROLE.GROUP_LEADER.type||type==ROLE.GROUP_ADMIN.type)" class="cell-btn hr-bottom" @click="topPosts">置顶</div>
                    <div v-if="post.top&&(type==ROLE.GROUP_LEADER.type||type==ROLE.GROUP_ADMIN.type)" class="cell-btn hr-bottom" @click="cancelTopPosts">取消置顶</div>
                    <div class="cell-btn hr-bottom" @click="layer.layer1=false;queryByTypeName()">举报</div>
                    <template v-if="type==ROLE.GROUP_LEADER.type||type==ROLE.GROUP_ADMIN.type">
                        <div v-if="essence" class="cell-btn hr-bottom">取消精华</div>
                        <div v-else class="cell-btn hr-bottom" @click="layer.layer1=false;layer.layer3=true">加精华</div>
                    </template>
                    <div v-if="type==ROLE.GROUP_LEADER.type||type==ROLE.GROUP_ADMIN.type||post.sponsor==user.mobile" class="cell-btn del" @click="layer.layer1=false;layer.layer2=true">删除</div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer2">
                <div class="layer-content">
                    <div class="layer-question">是否删除该帖？</div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn" @click="delPosts">确定</button>
                        <button class="layer-btn text-info" @click="layer.layer2 = false">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer3">
                <div class="layer-content">
                    <div class="layer-question">是否加入精华？</div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn text-info" @click="updateEnssence">确定</button>
                        <button class="layer-btn" @click="layer.layer3=false">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer5">
                <div class="layer-content">
                    <div class="report">
                        <div class="report-title">请选择举报原因</div>
                        <div class="report-reasons">
                            <div v-for="tt in report.tipsTypes" @click="report.tipsType=tt" :key="tt.id" class="report-reason" :class="{active:report.tipsType.tipsType==tt.tipsType}" v-text="tt.title"></div>
                            <div class="report-reason-other" v-if="report.tipsType.tipsType==-1">
                                <textarea v-model="report.tipsType.content" rows="5" placeholder="请输入举报原因"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn text-info" @click="saveTips">确定</button>
                        <button class="layer-btn" @click="layer.layer5 = false">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="comments" no-picture></ui-send>
            </ui-layer>
        </ui-root>
    </div>
</template>

<script>
import { preImg, preImgRaw } from "../../../config/project/project.env";
import { MTS, ROLE } from "../../utils/constants";
import UiLayer from "../UiLayer.vue";
import CommentItem from "./CommentItem.vue";
import UiPhotos from "../UiPhotos.vue";
import comment from "../../mixin/comment";
export default {
    props: {
        post: {
            type: Object,
            default: () => {}
        },
        groupId: {
            type: [String, Number],
            default: ""
        },
        type: {
            type: [String, Number],
            default: ROLE.COMMON_MEMBER.type
        },
        simple: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Boolean,
            default: false
        },
        essence: {
            type: Boolean,
            default: false
        },
        noOperate: {
            type: Boolean,
            default: false
        }
    },
    mixins: [comment],
    components: { UiLayer, CommentItem, UiPhotos },
    data() {
        return {
            ROLE: ROLE,
            show: true,
            preImg: preImg,
            preImgRaw: preImgRaw,
            layer: { layer1: false, layer2: false, layer3: false, layer4: false, layer5: false },
            report: {
                tipsTypes: [],
                tipsType: {}
            },
            paramPl: {},
            comment: "",
            user: {}
        };
    },
    created() {
        this.user = this.Store.get("$user") || {};
        this.resetReport();
        this.commentType = MTS.Posts.mt;
        this.commentBusinessId = this.post.id;
        this.resetParamPl();
        if (this.groupId && this.detail) {
            this.getPostDetail();
        }
    },
    methods: {
        queryByTypeName() {
            this.$post("queryByTypeName", { name: "TIPS_TYPE" }).then(res => {
                this.report.tipsTypes = [
                    ...res.map(v => ({ tipsType: v.value, content: v.name, title: v.name })),
                    {
                        tipsType: -1,
                        content: "",
                        title: "其他"
                    }
                ];
                this.layer.layer5 = true;
            });
        },
        getPostDetail() {
            this.$post("postsQueryById", {
                essence: 0,
                groupId: this.groupId,
                pageNo: 1,
                pageSize: 1,
                postsId: this.post.id
            }).then(res => {
                if (res.results[0] && res.results[0].commentDTOS) {
                    this.post.commentDTOS = res.results[0].commentDTOS;
                }
            });
        },
        // 收藏
        saveCollect() {
            this.$post("saveCollect", {
                type: MTS.Posts.mt,
                businessId: this.post.id
            }).then(() => {
                this.post.collected = true;
                this.layer.layer1 = false;
                this.$toast('已收藏至"我的收藏"');
            });
        },
        // 取消收藏
        delCollect() {
            this.$get("delCollect", this.post.id).then(() => {
                this.post.collected = false;
                this.layer.layer1 = false;
                this.$toast("已取消收藏");
            });
        },
        // 加精华
        updateEnssence() {
            this.$get("updateEnssence", this.post.id + "/1").then(() => {
                this.layer.layer3 = false;
                // this.show = false;
                this.$toast("已加精华");
            });
        },
        // 置顶
        topPosts() {
            this.$get("topPosts", this.post.id).then(() => {
                this.layer.layer1 = false;
                this.post.top = 1;
                this.$emit("top");
                this.$toast("已置顶");
            });
        },
        cancelTopPosts() {
            this.$get("unTopPosts", this.post.id).then(() => {
                this.layer.layer1 = false;
                this.post.top = false;
                this.$toast("已取消置顶");
                this.$emit("un-top");
            });
        },
        resetReport() {
            this.report.tipsType = {
                tipsType: "",
                content: ""
            };
        },
        // 举报
        saveTips() {
            this.$post("saveTips", {
                type: MTS.Posts.mt,
                businessId: this.post.id,
                tipsType: this.report.tipsType.tipsType,
                content: this.report.tipsType.content
            }).then(() => {
                this.layer.layer5 = false;
                this.$toast("举报成功");
                this.resetReport();
            });
        },
        // 删除帖子
        delPosts() {
            this.$get("delPosts", this.post.id).then(() => {
                this.$toast("delete");
                this.show = false;
                this.$toast("已删除");
            });
        },
        // 赞
        chan() {
            this.$post("checkLike", {
                type: MTS.Posts.mt,
                businessId: this.post.id
            }).then(res => {
                if (res) {
                    this.$toast("您已经点过赞");
                    this.post.checkLike = true;
                } else {
                    this.$post("saveLike", {
                        type: MTS.Posts.mt,
                        businessId: this.post.id
                    }).then(() => {
                        this.post.likeDTOS.push({ userName: this.user.name || this.user.mobile });
                        this.$toast("点赞成功");
                        this.post.checkLike = true;
                    });
                }
            });
        },
        // 评论
        comments() {
            this.saveComment().then(() => {
                this.getPostDetail();
            });
        },
        // 打赏
        tips() {},
        // 分享
        share() {},
        showDetail() {
            if (this.simple) return false;
            this.$emit("detail");
        },
        hyperLinks(v) {
            let linkRegExp = "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";
            v = v.replace(new RegExp(linkRegExp, "g"), match => {
                return `<a class="post-link" href="${match}" target="_blank" onclick="event.stopPropagation();">${match}</a>`;
            });
            return v;
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.group-posts {
    padding: 0 10px;
    background: white;
}
.group-post {
    padding: 20px 0;
    &.detail {
        padding: 20px 10px;
    }
    .group-post-auth {
        display: flex;
        .group-post-auth-img {
            > img {
                display: block;
                width: 35px;
                height: 35px;
                border-radius: 35px;
            }
        }
        .group-post-auth-info {
            flex: 1;
            margin-left: 10px;
            .group-post-auth-name {
                font-size: 14px;
                color: @info;
                .post-top {
                    background: #f3c7a9;
                    color: white;
                    font-size: 10px;
                    padding: 2px 8px;
                    border-radius: 2px;
                    margin-left: 3px;
                    vertical-align: 2px;
                }
            }
            .group-post-auth-time {
                font-size: 12px;
                color: #999;
            }
        }
        .group-post-auth-more {
            width: 30px;
            background: url("../../assets/img/Group@2x.png") no-repeat center;
            background-size: 14px auto;
        }
    }
    .group-post-detail {
        .group-post-text {
            padding-top: 10px;
            font-size: 16px;
            color: #666;
            > pre {
                margin: 0;
            }
        }
        .group-post-imgs {
            //     display: flex;
            //     flex-wrap: wrap;
            margin-top: 10px;
            //     padding-top: 10px;
            //     &.imgs-1 {
            //         max-width: 50%;
            //     }
            //     &.imgs-2 {
            //         flex: 50%;
            //     }
            //     .group-post-img {
            //         flex: 33.33333%;
            //         img {
            //             max-width: 100%;
            //         }
            //     }
        }
    }
}
.post-comments {
    background: white;
    padding: 10px;
    > textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        font-size: 14px;
        background: #eee;
        color: #333;
        resize: none;
    }
}
</style>
