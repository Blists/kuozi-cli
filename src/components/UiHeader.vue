<template>
    <header class="header">
        <div class="sys-name">后台管理系统</div>
    </header>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./../style/variables.less";
@height: 80px;
.header {
    height: @height;
    background: white;
    border-bottom: 1px solid #eee;
    .sys-name {
        margin-left: 25px;
        line-height: @height;
        font-size: 24px;
        color: #333;
        font-weight: bold;
    }
}
</style>