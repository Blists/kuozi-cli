<template>
    <div class="ui-send ht-top">
        <div class="ui-send-input">
            <textarea ref="input" v-model="val" rows="5" :placeholder="placeholder" @input="input" @focus="showEmoji=false"></textarea>
        </div>
        <div class="ui-send-btns hr-bottom">
            <div class="ui-send-btns-left">
                <div v-if="!noPicture" class="ui-send-photo-btn">
                    <input type="file" @change="change">
                </div>
                <div v-if="!noEmoji" class="ui-send-emoji-btn" @click="showEmojiHandler"></div>
            </div>
            <div class="ui-send-btns-right">
                <span class="ui-send-limit" v-if="limit">（{{len}}/{{limit}}）</span>
                <button class="ui-send-send" @click="send" :disabled="!val">发送</button>
            </div>
        </div>
        <transition name="emoji">
            <div v-if="showEmoji" class="ui-send-emojis">
                <div class="ui-send-emoji" v-for="(emoji,i) in emojis" :key="i" v-text="emoji" @click="inputEmoji(emoji)"></div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        limit: {
            type: Number,
            default: 1000
        },
        placeholder: {
            type: String,
            default: "请输入"
        },
        noPicture: {
            type: Boolean,
            default: false
        },
        noEmoji: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: "",
            emojis: [],
            hasLoadEmoji: false,
            showEmoji: false
        };
    },
    methods: {
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
            this.val += emoji;
            this.input();
        },
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.$emit("sendImg", res);
            });
        },
        send() {
            this.$emit("send", this.val);
            this.input();
        },
        input() {
            this.$emit("input", this.val);
        },
        focus() {
            this.$refs.input.focus();
        }
    },
    computed: {
        len() {
            return this.val.length;
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
.ui-send {
    background: white;
    .ui-send-input {
        padding: 15px 15px 0 15px;
        textarea {
            width: 100%;
            border: 1px solid #afafaf;
            border-radius: 6px;
            padding: 10px;
            resize: none;
            color: #333;
            font-size: 14px;
            &::-webkit-input-placeholder {
                color: #999;
                font-size: 14px;
            }
        }
    }
    .ui-send-btns {
        display: flex;
        padding: 0 15px 5px 15px;
        .ui-send-btns-left {
            flex: 1;
            display: flex;
            height: 40px;
            .ui-send-photo-btn {
                width: 40px;
                background: url("../assets/img/键盘图片-默认.png") no-repeat center;
                background-size: 18px auto;
                overflow: hidden;
                &:active {
                    background-image: url("../assets/img/键盘图片-选中.png");
                }
                > input {
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            .ui-send-emoji-btn {
                width: 40px;
                background: url("../assets/img/键盘表情-默认.png") no-repeat center;
                background-size: 18px auto;
                &:active {
                    background-image: url("../assets/img/键盘表情-点击.png");
                }
            }
        }
        .ui-send-btns-right {
            .ui-send-limit {
                font-size: 14px;
                color: #999;
                line-height: 40px;
            }
            .ui-send-send {
                background: @info;
                border-radius: 4px;
                padding: 3px 16px;
                font-size: 13px;
                color: white;
                &[disabled] {
                    opacity: 0.6;
                    cursor: no-drop;
                }
            }
        }
    }
    .ui-send-emojis {
        display: flex;
        flex-wrap: wrap;
        height: 250px;
        padding: 10px 15px;
        overflow: auto;
        .ui-send-emoji {
            width: 30px;
            height: 32px;
            padding: 3px 6px;
            text-align: center;
            font-size: 28px;
            box-sizing: content-box;
        }
    }
    .emoji-enter-active,
    .emoji-leave-active 
    {
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
