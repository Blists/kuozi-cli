<template>
    <div class="article-detail" v-show="article.title">
        <div ref="warp" class="article-warp">
            <div class="article-detail-content">
                <div class="article-title" v-text="article.title"></div>
                <div class="article-infos">
                    <div class="article-infos-left">
                        <div>
                            <ui-img @click="$to({name:'homePage',query:{loginName:article.auther}})" class="article-user-img" :src="preImg+article.auther"></ui-img>
                            <span @click="$to({name:'homePage',query:{loginName:article.auther}})" class="article-user-name" v-text="article.nickName"></span>
                            <span class="article-labels split">
                                <span class="article-label" v-for="(domain,i) in article.domainList" v-if="i<2" :key="domain.id" v-text="domain.name"></span>
                            </span>
                        </div>
                        <div>
                            <span class="article-time">{{article.publishTime|dateFmt('yyyy-MM-dd hh:mm')}}</span>
                            <!-- <span class="article-times" v-text="article.pageviewNum"></span> -->
                            <span class="article-times" v-text="article.viewCount"></span>
                        </div>
                    </div>
                    <div v-if="!isSelf" class="article-infos-right">
                        <button class="article-gz" v-if="article.focusAuther" @click="focusCancleFocus">取消关注</button>
                        <button class="article-gz" v-else @click="focusAuther">
                            <span class="article-gz-add"></span>关注
                        </button>
                    </div>
                </div>
                <div class="article-main">
                    <div class="article-main-detail html" v-html="article.content||'--'"></div>
                    <div class="article-zl">
                        <button v-for="(column,index) in article.columns" v-if="index<2" v-text="column.name+'专栏'" @click="$to({name:'columnsDetail',query:{columnId:column.id}})"></button>
                    </div>
                    <div class="article-ds">
                        <div class="article-ds-text">如果你觉得文章对你有价值，请支持一下。</div>
                        <div class="article-ds-button">
                            <button @click="layer.layer3=true">打赏</button>
                        </div>
                        <div class="article-ds-users">
                            <ui-img v-for="(r,i) in rewardMember" v-if="i<8" :key="r.id" :src="preImg+r.member"></ui-img>
                            <span v-if="rewardMember.length>8" style="vertical-align: top;">...</span>
                        </div>
                    </div>
                    <div v-if="!isSelf" class="article-tw">
                        <div class="article-tw-title">有问题直接向作者提问</div>
                        <div class="article-tw-warp hr-top" @click="$to({name:'homePage',query:{loginName:article.auther}})">
                            <div class="article-tw-user-img">
                                <ui-img :src="preImg+article.auther"></ui-img>
                            </div>
                            <div class="flex-1">
                                <div class="article-tw-user-name" v-text="article.nickName"></div>
                                <div class="article-tw-user-zw">
                                    <span v-text="article.company">·</span>
                                    <span v-text="article.post"></span>
                                </div>
                            </div>
                            <div class="article-tw-button">
                                <button @click.stop="$to({name:'askQuestion',query:{name:article.nickName,user:article.auther,placeholder:'请输入问题'}})">提问</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="article-xgwz">相关文章推荐</div>
            <div class="article-list">
                <div class="article-item" v-for="art in recommendArticles" :key="art.id" @click="$to({name:'articleDetail',params:{id:art.id},query:{title:art.title,id:art.id}})">
                    <div class="flex-1">
                        <div class="article-item-content">
                            <div class="article-item-content-left">
                                <div class="article-title limit2" v-text="art.title"></div>
                                <div class="article-content limit2" v-text="art.desc||'--'"></div>
                            </div>
                            <div class="article-item-content-right">
                                <ui-img :src="preImg+article.cover"></ui-img>
                            </div>
                        </div>
                        <div class="article-item-bottom">
                            <div class="article-lables flex-1">
                                <span v-for="(domain,i) in art.domainList" v-if="i<2" :key="domain.id" v-text="domain.name"></span>
                            </div>
                            <div class="article-infos">
                                <span class="article-info zan" v-text="art.likes"></span>
                                <span class="article-info ly" v-text="art.comments"></span>
                                <span class="article-info ds" v-text="art.arewards"></span>
                                <span class="article-info see" v-text="art.pageviewNum"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="common-pls">
                <div class="common-pls-title">评论 {{article.comments}}</div>
                <div class="common-pl-items padding">
                    <comment-item v-for="(c,i) in comment" :key="c.id" :comment="c" :index="i" @comment="activePl" :type="commentType" :business-id="articleId"></comment-item>
                </div>
            </div>
        </div>
        <div class="common-bottom hr-top">
            <div class="common-pl" @click="commentLayer=true">
                <input ref="input" v-model="paramPl.content" type="text" :placeholder="paramPl.placeholder" @keyup.enter="saveComment" readonly />
                <button v-if="paramPl.content" @click="saveComment">发送</button>
            </div>
            <div class="common-bottom-other">
                <div class="back">
                    <button @click="$back"></button>
                </div>
                <div class="common-bottom-btns">
                    <span class="zan" :class="{active:article.liked}" v-text="article.likes" @click="saveLike(articleId,article,'likes','article')"></span>
                    <span class="ly" v-text="article.comments" @click="activePl()"></span>
                    <span class="ds" @click="layer.layer3=true" v-text="article.arewards"></span>
                    <span class="more" @click="layer.layer1 = true"></span>
                </div>
            </div>
        </div>
        <ui-root>
            <ui-layer :show.sync="layer.layer1">
                <div class="layer-content overflow-hidden">
                    <div v-if="isPB" class="cell-btn hr-bottom" @click="pbShare({title:article.title,des:article.desc})">分享</div>
                    <div v-if="article.collected" class="cell-btn hr-bottom info">已收藏</div>
                    <div v-else class="cell-btn hr-bottom" @click="saveCollect">收藏</div>
                    <div class="cell-btn" @click="layer.layer1 = false;layer.layer2 = true">举报</div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer2">
                <div class="layer-content">
                    <div class="report">
                        <div class="report-title">请选择举报原因</div>
                        <div class="report-reasons">
                            <div v-for="tt in report.tipsTypes" @click="report.tipsType=tt" :key="tt.id" class="report-reason" :class="{active:report.tipsType.tipsType==tt.tipsType}" v-text="tt.title"></div>
                            <!-- <div class="report-reason">抄袭或转载</div>
                        <div class="report-reason">其他</div> -->
                            <div class="report-reason-other" v-if="report.tipsType.tipsType===-1">
                                <textarea v-model="report.tipsType.content" rows="5" placeholder="请输入举报原因"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layer-btns hr-top">
                        <button class="layer-btn text-info" @click="saveTips">确定</button>
                        <button class="layer-btn" @click="layer.layer2 = false">取消</button>
                    </div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="layer.layer3" @close="clearDs" overflow-visible>
                <div class="layer-content">
                    <div class="twjg">
                        <div class="twjg-img">
                            <ui-img :src="preImg+article.auther"></ui-img>
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
            <ui-layer :show.sync="layer.layer4">
                <div class="layer-content overflow-hidden">
                    <div class="pay-info">
                        <div class="pay-title">实付金额</div>
                        <div class="pay-money">￥{{ds.money}}
                            <span>元</span>
                        </div>
                    </div>
                    <div v-if="ds.money>wallet.withdrawMoney" class="cell-btn hr-top hr-bottom">钱包余额不足，请充值</div>
                    <div v-else class="cell-btn hr-top hr-bottom" @click="pay('qb')">钱包支付</div>
                    <div class="cell-btn" @click="pay('wx')">微信支付</div>
                </div>
            </ui-layer>
            <ui-layer :show.sync="commentLayer" postion="bottom" @close="resetParamPl">
                <ui-send ref="send" v-model="paramPl.content" :placeholder="paramPl.placeholder" @send="saveComment" no-picture></ui-send>
            </ui-layer>
        </ui-root>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { MTS } from "../../utils/constants";
import { shareAll, resetShare } from "../../utils/wx";
import UiLayer from "../UiLayer.vue";
import CommentItem from "./CommentItem.vue";
import CommentDetail from "./CommentDetail.vue";
import pay from "../../mixin/pay";
import pb from "../../mixin/pb";
import comment from "../../mixin/comment";
import UiSend from "../UiSend.vue";
import UiRoot from "../UiRoot.vue";
export default {
    props: { articleId: {} },
    mixins: [pay, pb, comment],
    components: { UiLayer, CommentItem, CommentDetail, UiSend, UiRoot },
    data() {
        return {
            preImg: preImg,
            article: {},
            isSelf: false,
            recommendArticles: [],
            // 评论总数
            commentCount: 0,
            // 评论
            comment: [],
            // paramPl: {},
            report: {
                tipsTypes: [],
                tipsType: {}
            },
            layer: {
                layer1: false,
                layer2: false,
                layer3: false,
                layer4: false,
                layer5: true
            },
            wallet: {},
            ds: {
                moneys: [2, 5, 10, 20, 50],
                money: "",
                showInput: false
            },
            rewardMember: []
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.commentType = MTS.Article.mt;
            this.commentBusinessId = this.articleId;
            this.resetParamPl();
            this.pageLoading();
            this.resetReport();
            // 阅读文章
            this.$get("readArticle", this.articleId);
            this.getArticleDetail();
            this.queryComment();
            this.queryRewardMember();
            this.queryByTypeName();
        },
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
            });
        },
        // 关闭打赏
        clearDs() {
            this.layer.layer3 = false;
            this.layer.layer4 = false;
            this.ds.money = "";
            this.ds.showInput = false;
        },
        sureMoney() {
            if (this.ds.money <= 0) return this.$toast("打赏金额有误");
            this.$get("myWallet").then(res => {
                this.wallet = res;
                this.layer.layer3 = false;
                this.layer.layer4 = true;
            });
        },
        // 打赏
        pay(flag) {
            if (this.ds.money <= 0) return this.$toast("打赏金额有误");
            this.$pay(
                flag,
                {
                    amount: this.ds.money,
                    receiver: this.article.auther,
                    type: MTS.Article.mt,
                    businessId: this.article.id
                },
                "PAY_REWARD"
            ).then(() => {
                this.clearDs();
                this.queryRewardMember();
                this.$toast("打赏成功");
            });
        },
        // resetParamPl() {
        //     this.paramPl = {
        //         placeholder: "写下你的评论",
        //         beCommentUser: "",
        //         content: "",
        //         type: MTS.Article.mt,
        //         businessId: this.articleId,
        //         parent: 0
        //     };
        //     this.layer.layer5 = false;
        // },
        // 查询文章详情
        getArticleDetail() {
            this.$get("getArticleDetail", this.articleId)
                .then(res => {
                    this.article = res;
                    if (this.login) {
                        let user = this.Store.get("$user");
                        this.isSelf = res.auther == user.mobile;
                    }
                    if (this.article && this.article.columnId) {
                        this.relatedArticle();
                    }
                    let self = this;
                    shareAll({
                        title: `「期望财经」${this.article.title}`,
                        desc: this.article.desc,
                        path: this.$route.fullPath,
                        imgUrl: this.preImg + this.article.cover,
                        success() {
                            self.$post("finishTask", { taskId: 12 });
                            this.$toast("分享成功");
                        }
                    });
                    this.pageLoaded();
                })
                .catch(() => {
                    this.pageLoaded();
                });
        },
        // 查询打赏记录
        queryRewardMember() {
            this.$post("queryRewardMember", {
                businessId: this.articleId,
                type: MTS.Article.mt
            }).then(res => {
                this.rewardMember = res;
            });
        },
        // 查询推荐文章
        relatedArticle() {
            this.$get("relatedArticle", this.article.columnId + "/" + this.articleId).then(res => {
                this.recommendArticles = res.results;
            });
        },
        // 查询评论
        queryComment() {
            this.$post("queryComment", {
                type: MTS.Article.mt,
                businessId: this.articleId,
                pageNo: 1,
                pageSize: 15,
                parent: 0
            }).then(res => {
                this.commentCount = res.count;
                this.comment = res.results;
            });
        },
        // // 修改评论参数
        // activePl(parent, beCommentUser, commentUserName) {
        //     if (beCommentUser) {
        //         this.paramPl.placeholder = `回复${commentUserName}:`;
        //         this.paramPl.parent = parent;
        //         this.paramPl.beCommentUser = beCommentUser;
        //     } else {
        //         this.resetParamPl();
        //     }
        //     this.layer.layer5 = true;
        //     this.$nextTick(() => {
        //         this.$refs.send.focus();
        //     });
        // },
        // // 提交评论
        // saveComment() {
        //     if (!this.paramPl.content) return this.$toast("评论不能为空");
        //     let paramPl = this.paramPl;
        //     delete paramPl.placeholder;
        //     this.$post("saveComment", paramPl).then(res => {
        //         this.$toast("评论成功");
        //         this.resetParamPl();
        //         this.queryComment();
        //     });
        // },
        // 点赞
        saveLike(businessId, obj, key, type) {
            this.$post("checkLike", {
                type: type == "article" ? MTS.Article.mt : MTS.Comment.mt,
                businessId: businessId
            }).then(res => {
                if (res) {
                    this.$set(obj, "liked", true);
                    this.$toast("您已经点过赞");
                } else {
                    this.$post("saveLike", {
                        type: type == "article" ? MTS.Article.mt : MTS.Comment.mt,
                        businessId: businessId
                    }).then(r => {
                        this.$set(obj, "liked", true);
                        obj[key]++;
                        this.$toast("点赞成功");
                    });
                }
            });
        },
        // 关注
        focusAuther() {
            this.$post("focusSave", {
                type: MTS.Personal.mt,
                businessId: this.article.autherId
            }).then(res => {
                this.article.focusAuther = true;
            });
        },
        // 取消关注
        focusCancleFocus() {
            this.$post("focusCancleFocus", {
                type: MTS.Personal.mt,
                businessId: this.article.autherId
            }).then(res => {
                this.$toast("取消关注");
                this.article.focusAuther = false;
            });
        },
        // 收藏
        saveCollect() {
            this.$post("saveCollect", {
                type: MTS.Article.mt,
                businessId: this.article.id
            }).then(res => {
                this.article.collected = true;
                this.layer.layer1 = false;
                this.$toast('已收藏至"我的收藏"');
            });
        },
        // 取消收藏
        delCollect() {
            this.$get("delCollect", this.article.id).then(res => {
                this.layer.layer1 = false;
                this.$toast("取消收藏成功");
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
            if (!this.report.tipsType.tipsType) return this.$toast("请选择举报类型");
            if (this.report.tipsType.tipsType == 3 && !this.report.tipsType.content) return this.$toast("请填写举报原因");
            this.$post("saveTips", {
                type: MTS.Article.mt,
                businessId: this.article.id,
                tipsType: this.report.tipsType.tipsType,
                content: this.report.tipsType.content
            }).then(res => {
                this.layer.layer2 = false;
                this.$toast("举报成功");
                this.resetReport();
            });
        },
    },
    watch: {
        articleId() {
            this.$refs.warp.scrollTop = 0;
            this.init();
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.article-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    .article-warp {
        flex: 1;
        overflow: scroll;
    }
    .article-detail-content {
        padding: 15px 10px;
        .article-title {
            font-size: 21px;
            color: #4a4a4a;
            margin-bottom: 10px;
        }
        .article-infos {
            display: flex;
            margin-bottom: 15px;
            .article-infos-left {
                flex: 1;
                line-height: 25px;
                > div > * {
                    display: inline-block;
                }
                .article-user-img {
                    width: 25px;
                    height: 25px;
                    border-radius: 100%;
                    overflow: hidden;
                    vertical-align: sub;
                }
                .article-user-name {
                    margin-left: 5px;
                    font-size: 14px;
                    color: #333333;
                }
                .article-labels {
                    margin-left: 5px;
                    &.split {
                        padding-left: 10px;
                        background: linear-gradient(to right, #979797, #979797, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) no-repeat 0 5px;
                        background-size: 1px 15px;
                    }
                    .article-label {
                        font-size: 14px;
                        color: @info;
                        margin-right: 3px;
                    }
                }
                .article-time {
                    font-size: 12px;
                    color: #9b9b9b;
                }
                .article-times {
                    margin-left: 15px;
                    background: url("../../assets/img/Icons_Eye Copy 2@2x.png") no-repeat 0 7px;
                    background-size: 15px 10px;
                    padding-left: 18px;
                    font-size: 12px;
                    color: #9b9b9b;
                    &.active {
                        color: @info;
                    }
                }
            }
            .article-infos-right {
                display: flex;
                align-items: flex-end;
                padding-bottom: 10px;
                button {
                    // width: 71px;
                    height: 30px;
                    background: @info;
                    color: white;
                    font-size: 14px;
                    border-radius: 3px;
                    > .article-gz-add {
                        display: inline-block;
                        width: 20px;
                        height: 30px;
                        background: url("../../assets/img/Plus@2x.png") no-repeat center;
                        background-size: 10px;
                        vertical-align: -10px;
                    }
                }
            }
        }
    }
    .article-main {
        .article-main-detail {
            width: 100%;
            overflow-x: scroll;
            text-align: justify;
            img {
                max-width: 100%;
            }
            table {
                max-width: 100%;
            }
            p {
                margin: 18px 0;
            }
        }
        .article-zl {
            padding: 25px 0;
            button {
                height: 26px;
                padding: 0 20px 0 10px;
                border: 1px solid @info;
                border-radius: 3px;
                color: @info;
                background: url("../../assets/img/Group Copy3@2x.png") no-repeat 95% center;
                background-size: 6px auto;
            }
        }
        .article-ds {
            text-align: center;
            margin-bottom: 45px;
            .article-ds-text {
                font-size: 11px;
                color: #666;
            }
            .article-ds-button {
                padding: 15px 0;
                button {
                    width: 73px;
                    height: 30px;
                    background: #f58691;
                    border-radius: 3px;
                    font-size: 13px;
                    color: white;
                }
            }
            .article-ds-users {
                img {
                    display: inline-block;
                    width: 26px;
                    height: 26px;
                    border-radius: 100%;
                    margin-left: -10px;
                    border: 3px solid white;
                }
            }
        }
        .article-tw {
            padding: 0 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            .article-tw-title {
                padding: 8px 0;
                font-size: 13px;
                color: #ccc;
            }
            .article-tw-warp {
                display: flex;
                height: 68px;
                > div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .article-tw-user-img {
                    margin-right: 10px;
                    img {
                        display: block;
                        width: 28px;
                        height: 28px;
                        border-radius: 28px;
                    }
                }
                .article-tw-user-name {
                    font-size: 16px;
                    color: #333;
                }
                .article-tw-user-zw {
                    font-size: 13px;
                    color: #ccc;
                }
                .article-tw-button {
                    button {
                        width: 70px;
                        height: 30px;
                        background: @info;
                        border-radius: 4px;
                        font-size: 13px;
                        color: white;
                    }
                }
            }
        }
    }
    .article-xgwz {
        padding: 30px 10px 10px;
        font-size: 18px;
        color: #333;
    }
}
</style>
