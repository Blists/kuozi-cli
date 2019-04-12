<template>
    <ui-layout>
        <ui-container>
            <div class="timeout-link">
                <span>从前有座山，山里有座庙</span><br>
                <span>庙里有个页面，现在找不到了</span>
            </div>
            <div style="margin:40px 50px; 0 50px">
                <button class="btn1" @click="home">回到首页</button>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
export default {
    methods: {
        home() {
            this.$router.replace({ name: "home" });
        }
    }
};
</script>

<style>
</style>
