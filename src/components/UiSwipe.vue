<template>
    <div style="min-height:100px;">
        <div v-if="show">
            <swipe :style="swipeStyle" :auto="3000">
                <swipe-item class="ui-swipe-item" v-for="item in items" :key="item.id">
                    <a :_href="item.url" @click="go(item)">
                        <img ref="img" :src="preImgRaw+item.name" />
                    </a>
                </swipe-item>
            </swipe>
        </div>
    </div>
</template>

<script>
import { preImgRaw } from "../../config/project/project.env";
import { Swipe, SwipeItem } from "vue-swipe";
export default {
    components: { Swipe, SwipeItem },
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            show: false,
            swipeStyle: { height: "100px" },
            preImgRaw: preImgRaw
        };
    },
    methods: {
        loadImg() {
            let interval = setInterval(() => {
                let img = this.$refs.img && this.$refs.img[0];
                if (img) {
                    this.swipeStyle.height = img.clientHeight + "px";
                    if (img.complete && img.clientHeight) {
                        clearInterval(interval);
                    }
                }
            }, 10);
        },
        go(item) {
            if (item.url.match("http")) {
                window.open(item.url);
            } else {
                if (item.url.match("www.")) {
                    window.open("http://" + item.url);
                } else {
                    this.$to({ path: item.url });
                }
            }
        }
    },
    watch: {
        items: {
            immediate: true,
            handler() {
                if (this.items.length > 0) {
                    this.show = true;
                    this.loadImg();
                }
            }
        }
    }
};
</script>

<style lang="less">
.ui-swipe-item {
    img {
        width: 100%;
    }
}
</style>
