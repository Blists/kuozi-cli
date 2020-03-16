<template>
    <ui-layout flex>
        <ui-head slot="top" title="固定顶部" />
        <div style="height:100px;">我也固定在上面，下面滚动区域使用BetterScroll</div>
        <UiContainer class="flex-1">
            <div v-for="i in 100" :key="i" style="height:20px">中间滚动区域{{i}}，滚动条是ui-container的滚动条</div>
        </UiContainer>
        <div slot="bottom">固定在底部</div>
    </ui-layout>
</template>

<script>
import UiContainer from "../../components/UiContainer.vue";
export default { components: { UiContainer } };
</script>

<style>
</style>
