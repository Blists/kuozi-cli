<template>
    <ui-layout full>
        <ui-container class="share-img" ref="warp">
            <button class="share-back" @click="$back"></button>
            <ui-img v-if="src" :src="preImg+src"></ui-img>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            classRoomId: this.$route.query.classRoomId,
            src: ""
        };
    },
    mounted() {
        this.getImg();
    },
    methods: {
        getImg() {
            let el = this.$refs.warp.$el;
            this.$post("generateShareImg", {
                classRoomId: this.classRoomId,
                shareLink: (window.location.origin + window.location.pathname).replace("index.html", "") + "redirect.html?path=" + encodeURI("/lesson/lessonDetail?id=" + this.classRoomId),
                imageView: preImg,
                baseWidth: el.clientWidth * 2,
                baseHeight: el.clientHeight * 2
            }).then(res => {
                this.src = res;
            });
        }
    }
};
</script>

<style lang="less">
.share-img {
    position: relative;
    .share-back {
        position: absolute;
        width: 33px;
        height: 33px;
        top: 50px;
        left: 15px;
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.5) url("../../../assets/img/Pin Left@2x.png") no-repeat center;
        background-size: 8px auto;
    }
    > img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
