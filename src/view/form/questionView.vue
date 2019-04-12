<template>
    <ui-layout no-home>
        <ui-container>
            <question-view rest-key="form" :pre-img="preImg"></question-view>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { QuestionView } from "yy-form-app";
export default {
    components: { QuestionView },
    data() {
        return { preImg: preImg };
    }
};
</script>
</script>

<style lang="less"></style>