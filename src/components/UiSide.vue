<template>
    <div class="ui-side" :class="{collapse:collapse}">
        <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="collapse">
            <el-menu-item index="test1" @click.native="open({name:'test1',title:'测试一页面',params:{p1:'参数一'}})">
                <i class="el-icon-coin" />
                <span slot="title">测试一</span>
            </el-menu-item>
            <el-menu-item index="test1" @click.native="open({name:'test1',key:'key',title:'测试一页面'})">
                <i class="el-icon-coin" />
                <span slot="title">测试一</span>
            </el-menu-item>
            <el-menu-item index="test2" @click.native="open({name:'test2',title:'测试二页面'})">
                <i class="el-icon-suitcase" />
                <span slot="title">测试二</span>
            </el-menu-item>
        </el-menu>
        <div class="dock" @click="collapse = !collapse">
            <i v-if="collapse" class="el-icon-arrow-right" />
            <i v-else class="el-icon-arrow-left" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { collapse: false, activeMenu: "" };
    },
    methods: {
        setActiveMenu(menuName) {
            this.activeMenu = menuName;
        },
        open(e) {
            this.setActiveMenu(e.name);
            this.$refreshOrOpen(e, true);
        }
    }
};
</script>

<style lang="less">
.ui-side {
    position: relative;
    width: 250px;
    height: 100%;
    &.collapse {
        width: 64px;
    }
    > ul {
        height: 100%;
    }
    .dock {
        position: absolute;
        width: 15px;
        height: 50px;
        top: 50%;
        margin-top: -5px;
        right: -15px;
        background: white;
        border: 1px #ccc;
        border-style: solid solid solid none;
        border-radius: 0 5px 5px 0;
        line-height: 50px;
        z-index: 9;
    }
}
</style>
