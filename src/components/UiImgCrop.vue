<template>
    <div class="cropper">
        <ui-root>
            <div class="cropper-page" v-show="isShow" id="cropperPage">
                <img ref="cropperImg" src class="cropper-img" :style="imageStyle" id="cropperImg">
                <div class="cover" :style="{height: coverHeight + 'px'}"></div>
                <div class="cropper-box" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd" id="cropBox"></div>
                <div class="cover" :style="{height: coverHeight + 'px'}">
                    <div class="buttons">
                        <button class="cancel" @click="isShow = false;">取消</button>
                        <button class="confirm" @click="confirm">确定</button>
                    </div>
                </div>
            </div>
        </ui-root>
        <canvas ref="canvas"></canvas>
        <input id="file" type="file" accept="image/*" @change="readImage">
    </div>
</template>
<script>
import UiRoot from "./UiRoot.vue";
import EXIF from "exif-js";
import MegaPixImage from "../utils/megapix-image";

const getDinstance = function(point0, point1) {
    return Math.sqrt(
        Math.pow(point0.pageY - point1.pageY, 2) +
            Math.pow(point0.pageX - point1.pageX, 2)
    );
};
export default {
    components: { UiRoot },
    props: {
        callback: {
            type: Function,
            default() {}
        }
    },
    data() {
        return {
            file: null,
            coverHeight: 0,
            cropperHeight: 0,
            imgInitTop: 0,
            amplitude: 0,
            imageState: {
                left: 0,
                top: 0,
                scale: 1,
                width: 0,
                height: 0,
                originX: 0,
                originY: 0
            },
            distance: 0,
            imageStyle: {
                top: "0",
                transform: "translate3d(0px, 0px, 0px) scale(1)",
                transformOrigin: "left top"
            },
            cropBoxRect: {},
            touchPos: {
                x: 0,
                y: 0
            },
            isShow: false,
            minScale: 0,
            info: ""
        };
    },
    watch: {
        imageState: {
            handler(val) {
                // this.imageStyle.transformOrigin = val.originX + '% ' + val.originY + '%'
                this.imageStyle.transform =
                    "translate3d(-" +
                    val.left +
                    "px, -" +
                    val.top +
                    "px, 0px) scale(" +
                    val.scale +
                    ")";
                if (this.$refs.cropperImg) {
                    this.$refs.cropperImg.style.transform = this.imageStyle.transform;
                }
            },
            deep: true
        }
    },
    methods: {
        readImage(event) {
            var self = this;
            var file = (this.file = event.target.files[0]);
            if (!file) {
                return false;
            }

            // 获取orientation信息
            EXIF.getData(file, function() {
                EXIF.getAllTags(this);
                self.orientation = EXIF.getTag(this, "Orientation");
            });

            var reader = new window.FileReader();
            reader.onload = () => {
                // 通过 reader.result 来访问生成的 DataURL
                var img = document.getElementById("cropperImg");
                img.src = reader.result;
                var allowOnload = true;
                // 图片加载之后调用initCropper
                img.onload = () => {
                    if (allowOnload) {
                        self.getImgData(
                            reader.result,
                            self.orientation,
                            self.$refs.canvas,
                            data => {
                                // 设置不重重复调用加载事件（实际上调用了，只不过没干什么事）
                                allowOnload = false;
                                // 这里可以使用校正后的图片data了
                                img.src = data;
                                img.onload = () => {
                                    self.initCropper();
                                };
                            }
                        );
                    } else {
                        allowOnload = true;
                    }
                };
            };
            reader.readAsDataURL(file);
        },
        // @param {string} img 图片的base64
        // @param {int} dir exif获取的方向信息
        // @param {function} next 回调方法，返回校正方向后的base64
        getImgData(img, dir, canvas, next) {
            var image = new Image();
            image.onload = function() {
                var degree = 0,
                    drawWidth,
                    drawHeight,
                    width,
                    height;
                drawWidth = this.naturalWidth;
                drawHeight = this.naturalHeight;
                // 不知道为啥要改变图片大小 改变后iphone手机拍照会有异常
                // 以下改变一下图片大小
                // var maxSide = Math.max(drawWidth, drawHeight);
                // if (maxSide > 1024) {
                //     var minSide = Math.min(drawWidth, drawHeight);
                //     minSide = (minSide / maxSide) * 1024;
                //     maxSide = 1024;
                //     if (drawWidth > drawHeight) {
                //         drawWidth = maxSide;
                //         drawHeight = minSide;
                //     } else {
                //         drawWidth = minSide;
                //         drawHeight = maxSide;
                //     }
                // }
                // var canvas = document.createElement("canvas");
                canvas.width = width = drawWidth;
                canvas.height = height = drawHeight;
                var context = canvas.getContext("2d");
                context.fillStyle = "#fff";
                // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
                switch (dir) {
                // iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                    // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                    // iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
                }
                // 使用canvas旋转校正
                context.rotate((degree * Math.PI) / 180);
                context.drawImage(this, 0, 0, drawWidth, drawHeight);
                // 返回校正图片
                next(canvas.toDataURL("image/jpeg", 1));
            };
            image.src = img;
        },
        initCropper() {
            this.isShow = true; // 显示裁剪界面
            // 回调会在dom更新后调用，如果不使用$nextTick，无法获取元素正确的高度
            this.$forceUpdate();
            this.$nextTick(() => {
                let cropperPage = document.getElementById("cropperPage");
                let pageWidth = cropperPage.clientWidth;
                let pageHeight = cropperPage.clientHeight;
                let headerHeight = 0;
                this.coverHeight = (pageHeight - headerHeight - pageWidth) / 2;
                let cropBoxTop = this.coverHeight + headerHeight;
                this.imageState.left = 0;
                this.imageState.top = 0;
                this.imageStyle.top = cropBoxTop + "px";
                document.getElementById("cropBox").style.height =
                    pageWidth + "px";
                // var cropBoxRect = this.$els.cropBox.getBoundingClientRect() // 获取的元素没有预期的参数
                this.cropBoxRect = {
                    left: 0,
                    top: cropBoxTop,
                    width: pageWidth,
                    height: pageWidth
                };

                let img = document.getElementById("cropperImg");

                var width = (this.imageState.width = img.naturalWidth);
                var height = (this.imageState.height = img.naturalHeight);
                // 计算imageState
                if (width > height) {
                    this.minScale = this.imageState.scale =
                        this.cropBoxRect.height / height;
                    this.imageState.left =
                        (width * this.imageState.scale -
                            this.cropBoxRect.width) /
                        2;
                } else {
                    this.minScale = this.imageState.scale =
                        this.cropBoxRect.width / width;
                    this.imageState.top =
                        (height * this.imageState.scale -
                            this.cropBoxRect.height) /
                        2;
                }
            });
        },
        confirm() {
            let imageState = this.imageState;
            let cropBoxRect = this.cropBoxRect;
            let scale = imageState.scale;
            let image = document.getElementById("cropperImg");
            let height = cropBoxRect.height;
            let width = cropBoxRect.width;
            // let canvas = document.createElement("canvas");
            let canvas = this.$refs.canvas;
            canvas.width = cropBoxRect.width;
            canvas.height = cropBoxRect.height;
            let ctx = canvas.getContext("2d");
            // 添加白色背景
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 画图
            new Promise(res => {
                if (
                    navigator.userAgent.match(/iphone/i) &&
                    this.orientation &&
                    this.orientation != 1
                ) {
                    let mpImg = new MegaPixImage(this.file);
                    mpImg.render(
                        canvas,
                        {
                            quality: 1,
                            orientation: this.orientation
                        },
                        () => {
                            image = new Image();
                            image.src = canvas.toDataURL("image/jpeg");
                            // canvas = document.createElement("canvas");
                            canvas.width = cropBoxRect.width;
                            canvas.height = cropBoxRect.height;
                            ctx = canvas.getContext("2d");
                            // 添加白色背景
                            ctx.fillStyle = "#fff";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            image.onload = () => {
                                res();
                            };
                        }
                    );
                } else {
                    res();
                }
            }).then(() => {
                ctx.drawImage(
                    image,
                    imageState.left / scale,
                    imageState.top / scale,
                    width / scale,
                    height / scale,
                    0,
                    0,
                    width,
                    height
                );
                let data = canvas.toDataURL("image/jpeg", 1);
                if (data.length > 150 * 1024) {
                    data = canvas.toDataURL(
                        "image/jpeg",
                        (150 * 1024) / data.length
                    );
                }
                this.$emit("input", data);
                this.$emit("confirm", data);
                this.isShow = false;
            });
        },
        getFocalPoint(point0, point1) {
            return {
                x: (point0.pageX + point1.pageX) / 2,
                y: (point0.pageY + point1.pageY) / 2
            };
        },
        touchStart(event) {
            var fingerCount = event.touches.length;
            if (fingerCount) {
                // 记录触摸初始位置
                let touchEvent = event.touches[0];
                this.touchPos = {
                    x: touchEvent.pageX,
                    y: touchEvent.pageY
                };
            }
            if (fingerCount >= 2) {
                // 获取两点距离、中点位置；两点距离old/new=放大倍数；中点位置，缩放中心；
                let point0 = event.touches[0];
                let point1 = event.touches[1];
                this.distance = getDinstance(point0, point1);
                this.touchPos = this.getFocalPoint(point0, point1);
                // 设置缩放倍数，
            }
        },
        touchMove(event) {
            // 根据触摸点位移，移动图片，重置触摸点位置
            var fingerCount = event.touches.length;
            var touchEvent = event.touches[0];
            if (fingerCount === 1) {
                let distX = touchEvent.pageX - this.touchPos.x;
                let distY = touchEvent.pageY - this.touchPos.y;
                let newX = this.imageState.left - distX;
                let newY = this.imageState.top - distY;
                let scale = this.imageState.scale;
                let maxX =
                    this.imageState.width * scale - this.cropBoxRect.width;
                let maxY =
                    this.imageState.height * scale - this.cropBoxRect.height;
                this.imageState.left = newX < 0 ? 0 : newX > maxX ? maxX : newX;
                this.imageState.top = newY < 0 ? 0 : newY > maxY ? maxY : newY;
                this.touchPos.x = touchEvent.pageX;
                this.touchPos.y = touchEvent.pageY;
            } else if (fingerCount > 1) {
                let point0 = event.touches[0];
                let point1 = event.touches[1];
                let distance = getDinstance(point0, point1);
                let zoom = distance / this.distance;
                let scale = zoom * this.imageState.scale;
                let maxX =
                    this.imageState.width * scale - this.cropBoxRect.width;
                let maxY =
                    this.imageState.height * scale - this.cropBoxRect.height;
                let touchPos = this.getFocalPoint(point0, point1);
                let newX =
                    zoom * (this.imageState.left + touchPos.x) - touchPos.x;
                let newY =
                    zoom *
                        (this.imageState.top - this.imgInitTop + touchPos.y) -
                    touchPos.y +
                    this.imgInitTop;
                // 限制缩放
                // 图片新位置:由中点位置确认;(新位置到中点)/(旧位置到中点)=(new scale)/(old scale)
                // newLeft - touchPos.x = (distance / this.distance) * (oldLetf - touchPos.x)
                // oldLeft = 0 - this.imageState.left
                // oldTop = imgInitTop - this.imageState.top
                this.distance = distance;
                if (scale < this.minScale) {
                    this.imageState.scale = this.minScale;
                } else {
                    this.imageState.scale = scale;
                    this.imageState.left =
                        newX < 0 ? 0 : newX > maxX ? maxX : newX;
                    this.imageState.top =
                        newY < 0 ? 0 : newY > maxY ? maxY : newY;
                }
                this.touchPos = touchPos;
            }
        },
        touchEnd() {}
    }
};
</script>

<style lang="less">
@import "../style/variables.less";

.cropper {
    position: relative;
    min-height: 30px;
    canvas {
        position: absolute;
        opacity: 0;
    }
    input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}

.cropper-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: black;
    overflow: hidden;
    .cover {
        position: relative;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        .buttons {
            display: flex;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            > button {
                flex: 1;
                height: 50px;
                font-size: 14px;
                color: white;
            }
        }
    }
    .cropper-img {
        position: absolute;
        z-index: -1;
    }
}

@media screen and (min-width: @max-width) {
    .cropper-page {
        width: @max-width;
        left: 50%;
        margin-left: -@max-width / 2;
    }
}
</style>
