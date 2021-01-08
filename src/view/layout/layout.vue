<template>
    <ui-layout ref="scrollView" @refresh="refresh">
        <ui-head slot="top" title="布局demo" />
        <div>
            <div v-for="i in 10" :key="i" class="list">
                <span>滚动列表，点击按钮到下一个页面返回，页面不刷新{{ i }}</span>
                <button @click="$to({ name: 'layout1' })">局部滚动整体下拉刷新</button>
                <button @click="$to({ name: 'layout2' })">局部滚动局部下拉刷新</button>
            </div>
        </div>
        <div slot="bottom">
            <input v-model="msg" class="input" type="text" placeholder="返回输入框内容不刷新" />
        </div>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "",
        };
    },
    methods: {
        refresh() {
            setTimeout(() => {
                this.$refs.scrollView.refreshed();
            }, 3000);
        },
    },
};
</script>

<style lang="less" scoped>
.list {
    padding: 10px;
    height: 100px;
    background: #eee;
    font-size: 12px;
    button {
        margin-top: 10px;
        padding: 5px 10px;
        border-radius: 4px;
        background: #36c;
        color: white;
    }
}
.input {
    width: 100%;
    height: 50px;
    padding: 0 10px;
}
</style>