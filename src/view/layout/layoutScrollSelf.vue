<template>
    <ui-layout scroll>
        <ui-head slot="top" title="固定顶部：滚动条是局部的" />
        <div v-for="i in 100" :key="i" style="height:20px">中间滚动区域{{i}}</div>
        <div slot="bottom">固定在底部</div>
    </ui-layout>
</template>

<script>
export default {};
</script>

<style>
</style>
