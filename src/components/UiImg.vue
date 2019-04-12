<template>
    <img :src="imgSrc" @click="click" @error="error">
</template>

<script>
import { preImg, preImgRaw } from "../../config/project/project.env";
export default {
    props: { src: {} },
    data() {
        return {
            replace: 0,
            setinterval: null
        };
    },
    methods: {
        click() {
            this.$emit("click");
        },
        error(e) {
            if (this.replace == 0) {
                this.replace = 1;
                e.target.src = this.src.replace(preImg, preImgRaw);
                return;
            }
            if (this.replace == 1) {
                this.replace = 2;
                e.target.src = preImg + "logo";
                return;
            }
        }
    },
    computed: {
        imgSrc() {
            if (this.src != preImg + "undefined" && this.src != preImg + "null") {
                return this.src;
            } else {
                return preImg + "logo";
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.setinterval);
    }
};
</script>

<style>
</style>
