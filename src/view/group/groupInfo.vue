<template>
    <group-detail :title="title" :group-id="groupId" group-info></group-detail>
</template>

<script>
import GroupDetail from "../../components/module/GroupDetail.vue";
export default {
    components: { GroupDetail },
    data() {
        return {
            groupId: this.$route.query.groupId,
            title: this.$route.query.title
        };
    },
    methods: {}
};
</script>

<style lang="less">

</style>
