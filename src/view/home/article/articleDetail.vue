<template>
    <ui-root>
        <ui-layout full>
            <ui-container>
                <article-detail :article-id="id"></article-detail>
            </ui-container>
        </ui-layout>
    </ui-root>
</template>

<script>
import UiRoot from "../../../components/UiRoot.vue";
import ArticleDetail from "../../../components/module/ArticleDetail.vue";
export default {
    components: { ArticleDetail, UiRoot },
    data() {
        return {
            id: this.$route.params.id,
        };
    },
    watch: {
        $route() {
            this.id = this.$route.params.id;
        }
    }
};
</script>

<style>
</style>
