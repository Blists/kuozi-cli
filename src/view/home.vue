<template>
    <ui-layout>
        <ui-head slot="top" title="首页" no-back />
        <button @click="$to({ name: 'layout' })">页面布局demo</button>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="less">
</style>
