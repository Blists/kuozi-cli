<template>
    <div class="pay-ewm" v-if="show" @click="show=false">
        <div class="pay-ewm-body">
            <ui-img @click.stop=";" :src="preImg+src"></ui-img>
        </div>
    </div>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            show: false,
            src: ""
        };
    }
};
</script>

<style lang="less">
.pay-ewm {
    position: fixed;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.6);
    .pay-ewm-body {
        position: absolute;
        width: 200px;
        height: 200px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: white;
        > img {
            display: block;
            width: 100%;
        }
    }
}
</style>
