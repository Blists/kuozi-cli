<template>
    <group-detail :title="title" :group-id="groupId" :active-post-id="activePostId" :inviter="inviter"></group-detail>
</template>

<script>
import GroupDetail from "../../components/module/GroupDetail.vue";
export default {
    components: { GroupDetail },
    data() {
        return {
            groupId: this.$route.query.groupId,
            title: this.$route.query.title,
            activePostId: this.$route.query.activePostId,
            inviter: this.$route.query.inviter,
        };
    },
    methods: {}
};
</script>

<style lang="less">
</style>
