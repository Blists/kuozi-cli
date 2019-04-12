<template>
    <ui-layout no-home>
        <ui-head title="提交成功" no-back></ui-head>
        <ui-container>
            <sub-succ @set-share="setShare"></sub-succ>
        </ui-container>
    </ui-layout>
</template>

<script>
import { SubSucc } from "yy-form-app";
import { shareAll } from "../../utils/wx";
export default {
    components: { SubSucc },
    methods: {
        setShare(info) {
            setTimeout(() => {
                shareAll(info);
            }, 1000);
        }
    }
};
</script>

<style lang="less"></style>
