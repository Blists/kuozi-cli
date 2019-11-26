<template>
    <ui-layout>
        页面传参：{{$tab.params}}
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
