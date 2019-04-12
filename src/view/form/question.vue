<template>
    <ui-layout no-home>
        <ui-container class="bg-gray">
            <question rest-key="form" :pre-img="preImg" @set-share="setShare"></question>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { Question } from "yy-form-app";
import { shareAll } from "../../utils/wx";
export default {
    components: { Question },
    data() {
        return { preImg };
    },
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
