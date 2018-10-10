<template>
    <ui-layout>
        页面传参：{{p1}}
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            p1: this.$tab.params.p1
        };
    }
};
</script>

<style>
</style>
