<template>
    <div class="article-item" @click="to(article)">
        <div class="flex-1">
            <div v-if="!noUser" class="article-item-top">
                <div class="article-user">
                    <ui-img class="article-user-img" :src="preImg+article.auther"></ui-img>
                    <span class="article-user-name" v-text="article.nickName"></span>
                </div>
                <div class="article-time">{{article.publishTime|dateFmt('yyyy-MM-dd')}}</div>
            </div>
            <div v-else style="height:15px;"></div>
            <div class="article-item-content">
                <div class="article-item-content-left">
                    <div class="article-title limit2" v-text="article.title"></div>
                    <div v-if="article.desc" class="article-content limit2" v-text="article.desc"></div>
                </div>
                <div class="article-item-content-right">
                    <ui-img :src="preImg+article.cover"></ui-img>
                </div>
            </div>
            <div class="article-item-bottom">
                <div v-if="bottomTime" class="article-time flex-1">
                    {{article.publishTime|dateFmt('yyyy-MM-dd')}}
                    <span v-for="statu in status" :key="statu.type" v-if="(article.status==status.ytg.type?showStatus:true)&&article.status==statu.type" class="article-lables" style="margin-left:10px">
                        <span class="article-item-check" v-text="statu.text"></span>
                    </span>
                </div>
                <div v-else class="article-lables flex-1">
                    <span v-for="(domain,i) in article.domainList" v-if="i<2" :key="domain.id" v-text="domain.name"></span>
                    <span v-for="statu in status" :key="statu.type" v-if="(article.status==status.ytg.type?showStatus:true)&&article.status==statu.type" v-text="statu.text"></span>
                </div>
                <div class="article-infos">
                    <span class="article-info zan" v-text="article.likes"></span>
                    <span class="article-info ly" v-text="article.comments"></span>
                    <span class="article-info ds" v-text="article.arewards"></span>
                    <!-- <span class="article-info see" v-text="article.pageviewNum"></span> -->
                    <span class="article-info see" v-text="article.viewCount"></span>
                </div>
            </div>
        </div>
        <div v-if="select" class="article-select" :class="{selected:article.selected}" @click.stop="selectHandler"></div>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    props: {
        article: {
            type: Object,
            default: () => {}
        },
        noUser: {
            type: Boolean,
            default: false
        },
        bottomTime: {
            type: Boolean,
            default: false
        },
        showStatus: {
            type: Boolean,
            default: false
        },
        select: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            preImg: preImg,
            status: {
                dsh: {
                    text: "审核中",
                    type: 0
                },
                ytg: {
                    text: "已通过",
                    type: 1
                },
                ysc: {
                    text: "已删除",
                    type: 2
                },
                btg: {
                    text: "不通过",
                    type: 3
                }
            }
        };
    },
    methods: {
        selectHandler() {
            this.$set(this.article, "selected", !this.article.selected);
            this.$emit("select", this.article);
        },
        to(article) {
            if (this.select) return this.selectHandler();
            switch (article.status) {
            case this.status.dsh.type:
                this.$toast("文章正在审核中");
                break;
            case this.status.ytg.type:
                this.$to({ name: "articleDetail", params: { id: article.id } });
                break;
            case this.status.ysc.type:
                this.$toast("文章已删除");
                break;
            case this.status.btg.type:
                let articleNew = {
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    cover: article.cover,
                    domains: article.domainList,
                    column: { id: article.columnId }
                };
                this.Store.set("articleNew", articleNew);
                this.$to({ name: "releaseArticle1" });
                break;
            default:
                break;
            }
        }
    }
};
</script>

<style>
.article-list .article-item .article-lables > span.article-item-check {
    /* height: 30px; */
    border-color: #fba39c;
    color: #fba39c;
    /* padding: 5px 10px; */
}
</style>
