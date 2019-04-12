<template>
    <ui-layout>
        <ui-head title="音频课程">
            <!-- <div class="btn-more" slot="right" @click="layer=true"></div> -->
        </ui-head>
        <ui-container>
            <div class="lesson">
                <div class="lesson-name">
                    <span v-text="course.name"></span>
                    <span class="lesson-type">音频课程</span>
                </div>
                <div class="lesson-info">
                    <div class="lesson-author">
                        <div class="lesson-author-img">
                            <ui-img :src="preImg+course.auther"></ui-img>
                        </div>
                        <div class="lesson-author-name" v-text="course.autherName"></div>
                    </div>
                    <div class="lesson-see flex-1" v-text="course.viewCount||0"></div>
                    <div class="lesson-time">{{course.publishTime|dateFmt('yyyy-MM-dd hh:mm')}}</div>
                </div>
                <div class="course-audio">
                    <audio :src="preImgRaw+course.videoName" controls></audio>
                </div>
            </div>
            <div class="course-audio-detail html" v-html="course.content"></div>
            <div class="common-pls">
                <div class="common-pls-title">评论 {{course.comments}}</div>
                <div class="common-pl-items padding">
                    <comment-item v-for="(c,i) in course.commentDTOS" :key="c.id" :comment="c" :index="i" @comment="activePl" :type="commentType" :business-id="id"></comment-item>
                </div>
            </div>
        </ui-container>
        <div class="common-bottom hr-top">
            <div class="common-pl" @click="showCommentLayer">
                <input ref="input" v-model="paramPl.content" type="text" :placeholder="paramPl.placeholder" @keyup.enter="saveComment" readonly/>
                <button v-if="paramPl.content" @click="saveComment">发送</button>
            </div>
            <div class="common-bottom-other">
                <div class="flex-1"></div>
                <div class="common-bottom-btns">
                    <span class="zan" :class="{active:course.liked}" v-text="course.likes" @click="saveLike"></span>
                    <span class="ly" v-text="course.comments" @click="activePl()"></span>
                    <span class="ds" @click="layer.layer2=true" v-text="course.arewards"></span>
                    <span class="more" @click="layer.layer1 = true"></span>
                </div>
            </div>
        </div>
        <ui-root>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="saveCommentSelf" no-picture></ui-send>
            </ui-layer>
            <ui-layer :show.sync="layer.layer1">
                <div class="layer-content overflow-hidden">
                    <div class="cell-btn" @click="saveCollect">收藏</div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer2" @close="clearDs" overflow-visible>
                <div class="layer-content">
                    <div class="twjg">
                        <div class="twjg-img">
                            <ui-img :src="preImg+course.auther"></ui-img>
                        </div>
                        <div class="twjg-title with-img">选择打赏金额</div>
                        <div v-if="ds.showInput" class="twjg-input">
                            <input v-model.number="ds.money" type="number" placeholder="请输入打赏金额">
                        </div>
                        <div v-else class="twjg-btns">
                            <div class="twjg-btn" v-for="m in ds.moneys" :key="m">
                                <button @click="ds.money=m" :class="{active:ds.money==m}">
                                    <span v-text="m"></span>元</button>
                            </div>
                            <div class="twjg-btn">
                                <button @click="ds.showInput = true">自定义</button>
                            </div>
                        </div>
                    </div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn text-info" @click="sureMoney">确定</button>
                        <button class="layer-btn" @click="clearDs">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer3" @close="clearDs">
                <div class="layer-content overflow-hidden">
                    <div class="pay-info">
                        <div class="pay-title">实付金额</div>
                        <div class="pay-money">￥{{ds.money}}
                            <span>元</span>
                        </div>
                    </div>
                    <div v-if="ds.money>withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                    <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                    <div class="cell-btn" @click="pay('wx')">微信支付</div>
                </div>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>

<script>
import CommentItem from "../../components/module/CommentItem.vue";
import UiLayer from "../../components/UiLayer.vue";
import { MTS } from "../../utils/constants";
import { preImg, preImgRaw } from "../../../config/project/project.env";
import pay from "../../mixin/pay";
import comment from "../../mixin/comment";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    mixins: [pay, comment],
    components: { CommentItem, UiLayer },
    data() {
        return {
            preImg: preImg,
            preImgRaw: preImgRaw,
            id: this.$route.query.id,
            course: {},
            paramPl: {},
            layer: { layer1: false, layer2: false, layer3: false },
            ds: {
                moneys: [2, 5, 10, 20, 50],
                money: "",
                showInput: false
            }
        };
    },
    created() {
        this.lessonDetail();
        this.commentType = MTS.Lesson.mt;
        this.commentBusinessId = this.id;
        this.resetParamPl();
    },
    methods: {
        // 关闭打赏
        clearDs() {
            this.layer.layer2 = false;
            this.layer.layer3 = false;
            this.ds.money = "";
            this.ds.showInput = false;
        },
        sureMoney() {
            if (this.ds.money <= 0) return this.$toast("打赏金额有误");
            this.layer.layer2 = false;
            this.layer.layer3 = true;
        },
        // 打赏
        pay(flag) {
            if (this.ds.money <= 0) return this.$toast("打赏金额有误");
            this.$pay(
                flag,
                {
                    amount: this.ds.money,
                    receiver: this.course.auther,
                    type: MTS.Lesson.mt,
                    businessId: this.id
                },
                "PAY_REWARD"
            ).then(() => {
                this.clearDs();
                this.$toast("打赏成功");
                this.course.arewards++;
            });
        },
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
            });
        },
        saveCollect() {
            if (!this.course.id) return this.$toast("数据加载失败，请刷新重试");
            this.$post("saveCollect", {
                type: MTS.Lesson.mt,
                businessId: this.course.id
            })
                .then(() => {
                    this.layer.layer1 = false;
                    this.$toast('已收藏至"我的收藏"');
                })
                .catch(() => {
                    this.layer.layer1 = false;
                });
        },
        saveCommentSelf() {
            this.saveComment().then(() => {
                this.lessonDetail();
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
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style>
.course-audio-detail {
    padding: 10px;
}
</style>
