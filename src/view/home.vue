<template>
    <ui-layout>
        <ui-head slot="top" title="首页" no-back />
        <div class="right">
            <div @click="$to({name:'layoutNoBs'})">不使用BetterScroll</div>
            <div @click="$to({name:'layoutFlex'})">内容flex布局</div>
            <div v-for="i in 10" :key="i" class="list" @click="$to({name:'test'})">进去详细页面返回不刷新页面{{i}}</div>
        </div>
        <div slot="bottom">
            <input v-model="msg" class="input" type="text" placeholder="测试返回不刷新" />
        </div>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "",
            rs: {}
        };
    }
};
</script>

<style lang="less">
.list {
    height: 100px;
    background: #eee;
}
.right {
    text-align: right;
}
.input {
    width: 100%;
    height: 50px;
    padding: 0 10px;
    border-top: 1px solid #eee;
}
</style>
