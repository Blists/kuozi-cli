<template>
    <ui-layout>
        <ui-head slot="top" title="首页" no-back></ui-head>
        <div>
            <div @click="$to({name:'layoutFixed'})">window滚动fixed布局</div>
            <div @click="$to({name:'layoutFlex'})">局部滚动flex布局</div>
            <input type="text" v-model="msg" placeholder="测试返回不刷新">
            <div v-for="i in 10" :key="i" class="list" @click="$to({name:'test'})">进去详细页面返回不刷新页面{{i}}</div>
        </div>
        <div slot="bottom" @click="clear">清除rs</div>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "",
            rs: {}
        };
    },
    created() {
        this.rs = this.$navigation.getRoutes();
    },
    methods: {
        clear() {
            this.$navigation.cleanRoutes();
            this.rs = this.$navigation.getRoutes();
        }
    }
};
</script>

<style lang="less" scoped>
.list {
    height: 100px;
}
</style>
