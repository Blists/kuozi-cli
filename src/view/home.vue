<template>
    <div class="home">
        <header></header>
        <div class="home-container">
            <div class="home-side">
                <div @click="$open({name:'test1',title:'测试一页面',params:{p1:'参数一'}})">测试一</div>
                <div @click="$open({name:'test1',key:'key',title:'测试一页面'})">新开一个测试一</div>
                <div @click="$open({name:'test2',title:'测试二页面'})">测试二</div>
            </div>
            <div class="home-tabs">
                <vue-tabs></vue-tabs>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
<style lang="less">
.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    header {
        height: 50px;
        background: #eeee;
    }
    .home-container {
        flex: 1;
        display: flex;
        .home-side {
            width: 200px;
            background: #eeee;
        }
        .home-tabs {
            flex: 1;
        }
    }
}
</style>
