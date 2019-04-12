<template>
    <div class="ui-bg" ref="warp">
        <canvas ref="canvas"></canvas>
        <div v-if="img" class="ui-bg-img">
            <ui-img :src="fullPath?img:preImg+img"></ui-img>
        </div>
    </div>
</template>

<script>
import { preImg, preImgRaw } from "../../config/project/project.env";
export default {
    props: {
        bg: {},
        img: {},
        fullPath: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            preImg: preImg,
            bgsrc: "",
            warpWidth: 375,
            warpHeight: 200
        };
    },
    methods: {
        setBg() {
            let interval = setInterval(() => {
                if (this.bg) {
                    clearInterval(interval);
                    this.bgsrc = this.fullPath ? this.bg : preImgRaw + this.bg;
                    this.init();
                }
            }, 100);
        },
        init() {
            let canvas = this.$refs.canvas;
            this.warpWidth = canvas.width = this.$refs.warp.clientWidth;
            canvas.height = this.warpHeight;
            let ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.arc(this.warpWidth / 2, -2 * canvas.height, 3 * canvas.height, 0, Math.PI * 2, true);
            ctx.clip();
            let img = new Image();
            img.onload = () => {
                this.drawImage(ctx, img);
            };
            img.src = this.bgsrc;
        },
        drawImage(ctx, img) {
            let imgWidth = img.width;
            let imgHeight = img.height;
            let drawWidth = imgWidth;
            let drawHeight = imgWidth * this.warpHeight / this.warpWidth;
            let sy = imgHeight - drawHeight;
            ctx.drawImage(img, 0, sy, drawWidth, drawHeight, 0, 0, this.warpWidth, this.warpHeight);
        }
    },
    watch: {
        bg: {
            immediate: true,
            handler() {
                this.setBg();
            }
        }
    }
};
</script>

<style lang="less">
.ui-bg {
    position: relative;
    height: 240px;
    .ui-bg-img {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 78px;
        overflow: hidden;
        img {
            display: block;
            width: 78px;
            height: 100%;
            border: 3px solid white;
            border-radius: 100%;
            margin: 0 auto;
            background: #fff;
        }
    }
}
</style>
