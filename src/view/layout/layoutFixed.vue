<template>
    <ui-layout>
        <ui-head slot="top" title='固定在顶部：设置slot="top"'></ui-head>
        <div v-for="i in 100" :key="i" style="height:20px">滚动区域{{i}},滚动条是window的滚动条</div>
        <div slot="bottom">固定在底部：设置slot="bottom"</div>
    </ui-layout>
</template>

<script>
export default {};
</script>

<style>
</style>
