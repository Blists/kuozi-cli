<template>
    <ui-layout>
        <ui-head title="发布文章" :backClick="backClick">
            <div slot="right" class="btn-text" @click="next">下一步</div>
        </ui-head>
        <ui-container class="bg-gray">
            <div class="release-editor">
                <div class="release-title">
                    <textarea v-model="articleNew.title" placeholder="请输入标题" rows="1"></textarea>
                </div>
                <div class="hr-top"></div>
                <div class="release-content">
                    <!-- <textarea v-if="ismobile" v-model="articleNew.content" placeholder="请输入正文"></textarea> -->
                    <ui-editor v-model="articleNew.content"></ui-editor>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiEditor from "../../../components/UiEditor.vue";
export default {
    components: { UiEditor },
    data() {
        return {
            articleNew: {},
            ismobile: /(Android|iPhone)/.test(navigator.userAgent)
        };
    },
    created() {
        this.articleNew = this.Store.get("articleNew") || {};
        if (!this.articleNew.title) {
            this.initArticleNew();
        }
    },
    methods: {
        initArticleNew() {
            this.articleNew = {
                id: "",
                title: "",
                content: "",
                cover: "",
                domains: [],
                column: {}
            };
        },
        next() {
            if (!this.articleNew.title) return this.$toast("请输入标题");
            if (!this.articleNew.content || this.articleNew.content == "请输入正文" || this.articleNew.content == "<p>请输入正文</p>" || this.articleNew.content == "<p><br></p>") return this.$toast("请输入正文");
            this.Store.set("articleNew", this.articleNew);
            this.$to({ name: "releaseArticle2" });
        },
        backClick() {
            this.$messagebox({
                title: "提示",
                message: "将此次编辑保存到草稿箱?",
                showCancelButton: true
            }).then(res => {
                if (res == "confirm") {
                    if (this.articleNew.title) {
                        this.$post("saveArticle", {
                            id: this.articleNew.id,
                            title: this.articleNew.title,
                            content: this.articleNew.content,
                            cover: this.articleNew.cover,
                            domainIds: this.articleNew.domains.map(v => v.id).join(","),
                            columnId: this.articleNew.column.id || "",
                            status: 5
                        }).then(res => {
                            this.$toast("保存成功");
                            this.$back();
                        });
                    } else {
                        this.$toast("保存到草稿箱，标题不能为空");
                    }
                } else {
                    this.$back();
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.release-editor {
    .release-content {
        overflow: hidden;
        > textarea {
            width: 100%;
            height: 100%;
            padding: 15px;
            font-size: 14px;
            resize: none;
        }
    }
}
</style>
