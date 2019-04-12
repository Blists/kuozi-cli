<template>
    <div class="ui-input">
        <div class="ui-input-body">
            <div class="ui-input-wrapper">
                <pre>{{val.content}}</pre>
                <textarea ref="textarea" v-model="val.content" :placeholder="placeholder" @input="input" @focus="showEmoji=false"></textarea>
            </div>
            <div class="ui-input-img">
                <!-- <ui-img v-for="i in val.imgs" :key="i" :src="preImg+i"></ui-img> -->
                <ui-photos :photos="val.imgs" :pre-img="preImg" :pre-img-raw="preImgRaw"></ui-photos>
            </div>
        </div>
        <div class="ui-input-bottom hr-bottom">
            <div class="ui-input-bottom-left">
                <div v-if="!noPhoto" class="btn btn-img">
                    <input type="file" accept="image/*" @change="change">
                </div>
                <!-- <div class="btn btn-text"></div> -->
                <div class="btn btn-emoji" @click="showEmojiHandler"></div>
            </div>
            <slot name="bottom"></slot>
            <div class="ui-input-bottom-right">（{{val.content.length}}/{{limit}}）</div>
        </div>
        <transition name="emoji">
            <div v-if="showEmoji" class="ui-input-emojis">
                <div class="ui-input-emoji" v-for="(emoji,i) in emojis" :key="i" v-text="emoji" @click="inputEmoji(emoji)"></div>
            </div>
        </transition>
    </div>
</template>

<script>
import { preImg, preImgRaw } from "../../config/project/project.env";
import UiPhotos from "./UiPhotos.vue";
export default {
    props: {
        value: {
            type: Object,
            default: () => {
                return { content: "", imgs: [] };
            }
        },
        placeholder: {},
        limit: { type: Number, default: 1000 },
        noPhoto: { type: Boolean, default: false }
    },
    components: { UiPhotos },
    data() {
        return {
            preImg: preImg,
            preImgRaw: preImgRaw,
            val: {
                content: "",
                imgs: []
            },
            emojis: [],
            hasLoadEmoji: false,
            showEmoji: false
        };
    },
    created() {
        if (this.value.hasOwnProperty("content")) {
            if (this.value.content.length > this.limit) {
                this.$emit("input", { content: this.value.content.substr(0, this.limit), imgs: this.value.imgs });
                this.$toast("字数已超出限制，仅显示前" + this.limit + "字");
            } else {
                this.val = this.value;
            }
        } else {
            this.$emit("input", { content: "", imgs: [] });
        }
    },
    methods: {
        change($event) {
            let file = $event.target.files[0];
            if (!file || file.size <= 0) return;
            let formData = new FormData();
            formData.append("file", file);
            this.$post("fileUploadFile", formData).then(res => {
                this.val.imgs.push(res);
                this.input();
            });
        },
        input() {
            if (this.val.content.length > this.limit) {
                this.val.content = this.val.content.substr(0, this.limit);
                this.$toast("字数已超出限制，仅显示前" + this.limit + "字");
            }
            this.$emit("input", { content: this.val.content, imgs: this.val.imgs });
        },
        showEmojiHandler() {
            if (this.hasLoadEmoji) {
                this.showEmoji = !this.showEmoji;
            } else {
                this.hasLoadEmoji = true;
                import("../utils/emoji").then(emojis => {
                    this.emojis = emojis.default;
                    this.showEmoji = true;
                });
            }
        },
        inputEmoji(emoji) {
            this.val.content += emoji;
            this.input();
        }
    }
};
</script>

<style lang="less" scoped>
@import "../style/variables.less";
.ui-input {
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    background: @gray;
    .ui-input-body {
        flex: 1;
        overflow: auto;
        padding: 10px 15px;
        .ui-input-wrapper {
            position: relative;
            min-height: 150px;
            > pre {
                padding-top: 18px;
                margin: 0;
                opacity: 0;
                font-size: 16px;
            }
            > textarea {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                padding: 0;
                margin: 0;
                font-size: 16px;
                resize: none;
            }
        }
        .ui-input-img {
            // display: flex;
            // flex-wrap: wrap;
            // margin-left: -5px;
            // // justify-content: center;
            // > img {
            //     max-width: 100%;
            //     height: 100px;
            //     margin: 5px;
            // }
        }
    }
    .ui-input-bottom {
        display: flex;
        padding: 10px;
        .ui-input-bottom-left {
            flex: 1;
            display: flex;
            > .btn {
                display: inline-block;
                width: 18px;
                height: 24px;
                margin-right: 20px;
                background: no-repeat center;
                background-size: auto 18px;
                &.btn-img {
                    background-image: url("../assets/img/Group@2x 3.png");
                    overflow: hidden;
                    > input {
                        width: 18px;
                        height: 18px;
                        opacity: 0;
                    }
                }
                &.btn-text {
                    background-image: url("../assets/img/文章管理02@2x.png");
                }
                &.btn-emoji {
                    background-image: url("../assets/img/Group 2@2x 4.png");
                }
            }
        }
        .ui-input-bottom-right {
            line-height: 24px;
            font-size: 14px;
            color: #999;
        }
    }
    .ui-input-emojis {
        display: flex;
        flex-wrap: wrap;
        height: 250px;
        padding: 10px 15px;
        overflow: auto;
        .ui-input-emoji {
            width: 30px;
            height: 32px;
            padding: 3px 6px;
            text-align: center;
            font-size: 28px;
            box-sizing: content-box;
        }
    }
    .emoji-enter-active,
    .emoji-leave-active {
        transition: all 0.5s;
        height: 250px;
        overflow: hidden;
    }
    .emoji-enter,
    .emoji-leave-to {
        height: 0;
        padding: 0 15px;
        overflow: hidden;
    }
}
</style>
