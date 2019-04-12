<template>
    <ui-layout>
        <ui-head></ui-head>
        <ui-container>
            <group-post :post="post" detail></group-post>
        </ui-container>
    </ui-layout>
</template>

<script>
import GroupPost from "../../../components/module/GroupPost.vue";
export default {
    data() {
        return {
            post: {}
        };
    }
};
</script>

<style>
</style>
