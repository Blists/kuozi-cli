<template>
    <ui-layout>
        <ui-head title="发布文章" :backClick="backClick">
            <div slot="right" class="btn-text" @click="saveArticle">发布</div>
        </ui-head>
        <ui-container class="bg-gray">
            <div class="release-show">
                <div class="release-img">
                    <img v-show="articleNew.cover" :src="preImg+articleNew.cover"/>
                    <div class="release-img-btn">
                        <input type="file" accept="image/*" @change="change">
                    </div>
                </div>
                <div class="release-title" v-text="articleNew.title"></div>
                <div class="release-content" v-html="articleNew.content"></div>
            </div>
            <div class="release-domain">
                <div class="release-domain-text">选择文章所属领域</div>
                <div class="release-domain-opt">
                    <div class="release-domains" v-if="articleNew.domains&&articleNew.domains.length>0">
                        <span v-for="domain in articleNew.domains" :key="domain" v-text="domain.name"></span>
                    </div>
                    <div class="release-domain-add" @click="articleAddDomain">+</div>
                </div>
            </div>
            <div class="release-column">
                <div class="release-column-text">选择文章所属专栏</div>
                <div class="select-column">
                    <div class="selected-column" :class="{active:show}" @click="show = !show">
                        <div class="column-xq active" v-if="articleNew.column">
                            <ui-img v-if="articleNew.column.cover" :src="preImg+articleNew.column.cover"></ui-img>
                            <span class="column-xq-name">{{articleNew.column.name}}</span>
                        </div>
                    </div>
                    <div v-show="show" class="all-column">
                        <div class="column-xq hr-bottom" :class="{active:column.id==articleNew.column.id}" v-for="column in allColumn" :key="column.id" @click="articleNew.column=column;show=false;">
                            <ui-img :src="preImg+column.cover"></ui-img>
                            <span class="column-xq-name">{{column.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            show: false,
            articleNew: {},
            allColumn: []
        };
    },
    created() {
        this.articleNew = this.Store.get("articleNew") || {};
        if (!this.articleNew.title) {
            this.$to({ name: "releaseArticle1" });
        }
        this.queryColumns();
    },
    methods: {
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.articleNew.cover = res;
            });
        },
        articleAddDomain() {
            this.Store.set("articleNew", this.articleNew);
            this.$to({ name: "selectDomain", query: { title: "选择文章所属领域", store: "articleNew", key: "domains" } });
        },
        queryColumns() {
            this.$post("queryMyColumn", {
                pageNo: 1,
                pageSize: 3000
            }).then(res => {
                this.allColumn = res.results;
                if (this.articleNew.column.id) {
                    this.articleNew.column = this.allColumn.find(v => v.id == this.articleNew.column.id);
                }
            });
        },
        saveArticle() {
            if (!this.articleNew.cover) return this.$toast("请选择文章照片");
            if (this.articleNew.domains.length == 0) return this.$toast("请选择文章所属领域");
            // if (!this.articleNew.column.id) return this.$toast("请选择文章所属专栏");
            this.$post("saveArticle", {
                id: this.articleNew.id,
                title: this.articleNew.title,
                content: this.articleNew.content,
                cover: this.articleNew.cover,
                domainIds: this.articleNew.domains.map(v => v.id).join(","),
                columnId: this.articleNew.column.id,
                status: 0
            }).then(res => {
                this.$toast("发布文章成功");
                setTimeout(() => {
                    this.Store.remove("articleNew");
                }, 1000);
                this.$back(-2);
            });
        },
        backClick() {
            this.Store.set("articleNew", this.articleNew);
            this.$back();
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
</style>
