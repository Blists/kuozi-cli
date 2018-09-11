<template>
    <ui-layout flex>
        <ui-head title='固定顶部'></ui-head>
        <ui-container>
            <div v-for="i in 100" :key="i" style="height:20px">中间滚动区域{{i}}，滚动条是ui-container的滚动条</div>
        </ui-container>
        <div>固定在底部</div>
    </ui-layout>
</template>

<script>
export default {};
</script>

<style>
</style>
