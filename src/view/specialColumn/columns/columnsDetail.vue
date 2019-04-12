<template>
    <ui-layout full>
        <ui-head :title="columnDetail.name">
            <!-- <button class="btn-search" slot="right"></button> -->
            <button class="btn-more" slot="right" @click="layer.layer1 = true;"></button>
        </ui-head>
        <ui-container v-show="columnDetail.name" class="bg-gray">
            <div class="column">
                <div class="flex">
                    <div class="column-img">
                        <ui-img v-if="columnDetail.cover" :src="preImg+columnDetail.cover"></ui-img>
                    </div>
                    <div class="flex-1">
                        <div class="column-name">
                            <div class="ellipsis" v-text="columnDetail.name"></div>
                        </div>
                        <div class="column-gzno">
                            <span v-text="columnDetail.focus||0"></span>人关注</div>
                        <div class="column-gzbtn" v-if="mine">
                            <button @click="$to({name:'columnsArticle',query:{columnId}})">
                                <span class="column-gzbtn-add"></span>文章
                            </button>
                        </div>
                        <div class="column-gzbtn" v-else>
                            <button v-if="columnDetail.checkFocus" @click="columnFocus(false)">
                                取消关注
                            </button>
                            <button v-else @click="columnFocus(true)">
                                <span class="column-gzbtn-add"></span>关注
                            </button>
                            
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <div class="column-jj">专栏简介</div>
                    <div v-if="showBtn&&showDetail" class="column-ckxq" @click="showDetail=false">收起</div>
                    <div v-if="showBtn&&!showDetail" class="column-ckxq" @click="showDetail=true">查看详情</div>
                </div>
                <div class="column-jjd hr-top" :class="{limit3:!showDetail}">
                    <div v-text="columnDetail.description||'--'"></div>
                </div>
                <div class="column-jjd hidden">
                    <div ref="description" v-text="columnDetail.description||'--'"></div>
                </div>
            </div>
            <ui-loadmore ref="loadmore" :bottom-method="loadmore" :bottom-all-loaded="articles.allLoaded" :loading="articles.loading">
                <div class="article-list">
                    <div class="article-list">
                        <article-item v-for="article in articles.list" :key="article.id" :article="article"></article-item>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
        <ui-layer :show.sync="layer.layer1">
            <div class="layer-content">
                <div v-if="mine" class="cell-btn hr-bottom" @click="$to({name:'releaseColumn',query:{columnId:columnDetail.id}})">编辑</div>
                <div class="cell-btn hr-bottom" @click="$to({name:'columnsUser',query:{columnId:columnDetail.id}})">专栏粉丝</div>
                <div class="cell-btn" @click="layer.layer1 = false;layer.layer2 = true">举报</div>
                <div></div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="layer.layer2">
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
                    <button class="layer-btn" @click="layer.layer2 = false">取消</button>
                </div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import ArticleItem from "../../../components/module/ArticleItem.vue";
import UiLayer from "../../../components/UiLayer.vue";
import { preImg } from "../../../../config/project/project.env";
import { shareAll, resetShare } from "../../../utils/wx";
import loadmore from "./../../../mixin/loadmore";
import { MTS } from "../../../utils/constants";
export default {
    mixins: [loadmore],
    components: { ArticleItem, UiLayer },
    data() {
        return {
            preImg: preImg,
            columnId: this.$route.query.columnId,
            mine: this.$route.query.mine == true || this.$route.query.mine == "true",
            columnDetail: {},
            showDetail: false,
            articles: { ref: "loadmore", pageNo: 0, list: [], loading: false, allLoaded: true },
            report: {
                tipsTypes: [],
                tipsType: {}
            },
            layer: {
                layer1: false,
                layer2: false
            },
            showBtn: false
        };
    },
    created() {
        this.getColumnDetail();
        this.loadmore();
        this.queryByTypeName();
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
            });
        },
        getColumnDetail() {
            this.$get("columnDetail", this.columnId).then(res => {
                this.columnDetail = res;
                let user = this.Store.get("$user") || {};
                this.mine = user.mobile == res.owner;
                this.$nextTick(() => {
                    let description = this.$refs.description;
                    if (description.clientHeight > 70) {
                        this.showBtn = true;
                    }
                });
                shareAll({
                    title: `「期望财经」我发现了一个优质专栏${this.columnDetail.name}，分享给你`,
                    desc: "深入带你了解一个产业的前世今生及定价规则",
                    path: this.$route.fullPath,
                    imgUrl: this.preImg + this.columnDetail.cover
                });
            });
        },
        loadmore() {
            this.LoadMore("queryArticleByColumn", "articles");
        },
        queryArticleByColumn(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryArticleByColumn", {
                        columnId: this.columnId,
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        columnFocus(falg) {
            this.$get("columnFocus", this.columnId).then(() => {
                this.$set(this.columnDetail, "checkFocus", falg);
                if (falg) {
                    this.columnDetail.focus++;
                    this.$toast("关注成功");
                } else {
                    this.columnDetail.focus--;
                    this.$toast("取消关注成功");
                }
            });
        },
        // 举报
        saveTips() {
            this.$post("saveTips", {
                type: MTS.Column.mt,
                businessId: this.columnId,
                tipsType: this.report.tipsType.tipsType,
                content: this.report.tipsType.content
            }).then(() => {
                this.layer.layer2 = false;
                this.$toast("举报成功");
                this.resetReport();
            });
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
.column {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    .column-img {
        > img {
            width: 180px;
            height: 100px;
            border-radius: 4px;
        }
    }
    .column-name {
        position: relative;
        height: 30px;
        margin-top: 5px;
        text-align: center;
        font-size: 20px;
        color: #333;
        > div {
            position: absolute;
            width: 100%;
        }
    }
    .column-gzno {
        text-align: center;
        font-size: 12px;
        color: #333;
    }
    .column-gzbtn {
        text-align: center;
        margin-top: 10px;
        button {
            // width: 70px;
            height: 30px;
            border-radius: 3px;
            background: @info;
            font-size: 13px;
            color: white;
            > .column-gzbtn-add {
                width: 20px;
                height: 30px;
                display: inline-block;
                background: url("../../../assets/img/Plus@2x.png") no-repeat center;
                background-size: 10px;
                vertical-align: -10px;
            }
        }
    }
    .column-jj {
        flex: 1;
        margin-top: 15px;
        font-size: 16px;
        color: #4a4a4a;
    }
    .column-ckxq {
        margin-top: 15px;
        line-height: 26px;
        font-size: 12px;
        color: @info;
    }
    .column-jjd {
        margin-top: 10px;
        padding-top: 10px;
        font-size: 14px;
        color: #4a4a4a;
        &.limit3 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        &.hidden {
            position: absolute;
            visibility: hidden;
        }
    }
}
</style>
