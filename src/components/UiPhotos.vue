<template>
    <div v-if="show" ref="warp" class="ui-photos" :class="['ui-photos-'+len,{'ui-photos-more':len>1}]" @click.stop=";">
        <template v-for="(p,i) in photos">
            <div class="ui-photo" :class="['ui-photo-index-'+(i+1),'ui-photo-cell-'+(i%3+1)]" :key="p" :style="style?style:style1">
                <img :_src="p" :src="preImg+p" @load="load" @error="error" />
            </div>
            <div v-if="len==4&&i==1" :key="p" :style="style"></div>
        </template>
    </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
export default {
    props: {
        photos: {
            type: Array,
            default: () => []
        },
        preImg: {
            type: String,
            default: ""
        },
        preImgRaw: {
            type: String,
            default: ""
        },
        defaultImg: {
            type: String,
            default: ""
        },
        maxWidth: {
            type: Number,
            default: 300
        },
        maxHeight: {
            type: Number,
            default: 500
        },
        minWH: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            itemSize: 0,
            style1: {},
            show: true
        };
    },
    mounted() {
        this.update();
    },
    methods: {
        update() {
            this.itemSize = ((this.$refs.warp.clientWidth - 10) / 3) | 0;
            this.show = false;
            setTimeout(() => {
                this.show = true;
                setTimeout(() => {
                    new Viewer(this.$refs.warp);
                }, 10);
            }, 50);
        },
        load(e) {
            let el = e.target;
            let width = el.naturalWidth;
            let height = el.naturalHeight;
            switch (this.len) {
            case 1:
                if (width / height > this.maxWidth / this.maxHeight) {
                    if (width / height > this.maxWidth / this.minWH) {
                        if (width > this.maxWidth) {
                            let realWidth = this.minWH * width / height;
                            this.style1 = { width: this.maxWidth + "px", height: this.minWH + "px" };
                            el.style.height = this.minWH + "px";
                            el.style.left = (this.maxWidth - realWidth) / 2 + "px";
                        } else if (width < this.minWH) {
                            let realHeight = this.maxWidth * height / width;
                            this.style1 = { width: this.minWH + "px", height: realHeight + "px" };
                            el.style.width = this.minWH + "px";
                        } else {
                            this.style1 = { width: width + "px", height: height + "px" };
                            el.style.width = width + "px";
                        }
                    } else {
                        if (width > this.maxWidth) {
                            let realHeight = this.maxWidth * height / width;
                            this.style1 = { width: this.maxWidth + "px", height: realHeight + "px" };
                            el.style.width = this.maxWidth + "px";
                        } else if (width < this.minWH) {
                            let realWidth = this.minWH * width / height;
                            this.style1 = { width: realWidth + "px", height: this.minWH + "px" };
                            el.style.width = realWidth + "px";
                        } else {
                            this.style1 = { width: width + "px", height: height + "px" };
                            el.style.width = width + "px";
                        }
                    }
                } else {
                    if (width / height < this.minWH / this.maxHeight) {
                        if (height > this.maxHeight) {
                            let realHeight = this.minWH * height / width;
                            this.style1 = { width: this.minWH + "px", height: this.maxHeight + "px" };
                            el.style.width = this.minWH + "px";
                            el.style.top = (this.maxHeight - realHeight) / 2 + "px";
                        } else if (height < this.minWH) {
                            let realWidth = this.maxHeight * width / height;
                            this.style1 = { width: realWidth + "px", height: this.maxHeight + "px" };
                            el.style.width = realWidth + "px";
                        } else {
                            this.style1 = { width: width + "px", height: height + "px" };
                            el.style.width = width + "px";
                        }
                    } else {
                        if (height > this.maxHeight) {
                            let realWidth = this.maxHeight * width / height;
                            this.style1 = { width: realWidth + "px", height: this.maxHeight + "px" };
                            el.style.width = realWidth + "px";
                        } else if (height < this.minWH) {
                            let realHeight = this.minWH * height / width;
                            this.style1 = { width: this.minWH + "px", height: realHeight + "px" };
                            el.style.width = this.minWH + "px";
                        } else {
                            this.style1 = { width: width + "px", height: height + "px" };
                            el.style.width = width + "px";
                        }
                    }
                }
                break;
            default:
                if (width > height) {
                    let realWidth = this.itemSize * width / height;
                    el.style.height = this.itemSize + "px";
                    el.style.left = (this.itemSize - realWidth) / 2 + "px";
                } else {
                    let realHeight = this.itemSize * height / width;
                    el.style.width = this.itemSize + "px";
                    el.style.top = (this.itemSize - realHeight) / 2 + "px";
                }
                break;
            }
            el.style.display = "block";
        },
        error(e) {
            let el = e.target;
            el.style.display = "block";
            if (!el.getAttribute("load-time")) {
                el.setAttribute("load-time", "1");
                this.preImgRaw ? (el.src = this.preImgRaw + el.getAttribute("_src")) : this.defaultImg ? (el.src = this.defaultImg) : null;
                return;
            }
            if (el.getAttribute("load-time") == "1") {
                el.setAttribute("load-time", "2");
                this.defaultImg ? (el.src = this.defaultImg) : null;
                return;
            }
        }
    },
    watch: {
        len: {
            immediate: false,
            handler() {
                this.update();
            }
        }
    },
    computed: {
        len() {
            return this.photos.length;
        },
        style() {
            let style = null;
            if (this.len > 1) {
                style = { width: this.itemSize + "px", height: this.itemSize + "px" };
            }
            return style;
        }
    }
};
</script>

<style lang="less">
.viewer-footer {
    .viewer-title {
        display: none;
    }
}
.ui-photos {
    margin-right: 100px;
    max-width: 450px;
    .ui-photo {
        position: relative;
        overflow: hidden;
        img {
            position: absolute;
            display: none;
        }
    }
    &.ui-photos-1 {
        margin-right: 0;
    }
    &.ui-photos-more {
        display: flex;
        flex-wrap: wrap;
        .ui-photo {
            margin-right: 5px;
            margin-top: 5px;
            &.ui-photo-index-1,
            &.ui-photo-index-2,
            &.ui-photo-index-3 {
                margin-top: 0;
            }
            &.ui-photo-cell-3 {
                margin-right: 0;
            }
        }
        &.ui-photos-4 {
            .ui-photo {
                &.ui-photo-index-3 {
                    margin-top: 5px;
                }
                &.ui-photo-cell-3 {
                    margin-right: 5px;
                }
            }
        }
    }
}
</style>
