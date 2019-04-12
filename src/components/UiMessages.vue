<template>
    <div class="ui-messages">
        <div v-if="!showMoreBtn&&!noMore" style="height:10px;"></div>
        <div v-if="showMoreBtn" class="message-showmore">
            <button @click="showMore">显示更多</button>
        </div>
        <div v-if="noMore && messages && messages.length > 0 && history" class="message-nomore">
            <button>没有更多消息了</button>
        </div>
        <div class="message-item" v-for="message in messages" :key="message.id">
            <template v-if="message.msgType != MSG_TYPE.SYS">
                <div v-if="message.from != self" class="message-item-type receive">
                    <div class="message-item-head">
                        <img src="../assets/img/矢量智能对象女.png">
                    </div>
                    <div class="message-item-info">
                        <div class="message-item-other-info">
                            <span class="message-item-time">{{message.accessTime | dateFmt("hh:mm:ss")}}</span>
                            <span v-if="showName" class="message-item-name">{{message.from}}</span>
                        </div>
                        <div class="message-item-msg-info">
                            <div class="message-item-detail" :class="{tmp:message.msgType == MSG_TYPE.TMP}">
                                <span v-if="message.msgType == MSG_TYPE.TXT" v-html="formate(message.message)"></span>
                                <template v-if="message.status == MSG_ST.SENDING || message.status == MSG_ST.FAIL">
                                    <img v-if="message.msgType == MSG_TYPE.IMG" class="msg-img" :src="message.message" @click="preview(message.message)" @load="scrollBottom" />
                                </template>
                                <template v-else>
                                    <img v-if="message.msgType == MSG_TYPE.IMG" class="msg-img" :src="preImg+message.message" @click="preview(preImg+message.message)" @load="scrollBottom" />
                                </template>
                                <div class="message-tmps" v-if="message.msgType == MSG_TYPE.TMP">
                                    <div class="message-tmp" v-for="m in message.message" :key="m.id" v-text="m.number" @click="tmp(m)"></div>
                                </div>
                            </div>
                            <div class="message-item-state">
                                <span v-if="message.status == MSG_ST.SENDING" class="message-item-state-sending"></span>
                                <span v-if="message.status == MSG_ST.FAIL" class="message-item-state-error"></span>
                            </div>
                            <div class="flex-1"></div>
                        </div>
                    </div>
                </div>
                <div v-else class="message-item-type send">
                    <div class="message-item-info">
                        <div class="message-item-other-info">
                            <span class="message-item-time">{{message.sendTime | dateFmt("hh:mm:ss")}}</span>
                        </div>
                        <div class="message-item-msg-info">
                            <div class="flex-1"></div>
                            <div class="message-item-state">
                                <span v-if="message.status == MSG_ST.SENDING" class="message-item-state-sending"></span>
                                <span v-if="message.status == MSG_ST.FAIL" class="message-item-state-error"></span>
                            </div>
                            <div class="message-item-detail">
                                <!-- <span v-if="message.msgType == MSG_TYPE.TXT"><img :src='test'></span> -->
                                <span v-if="message.msgType == MSG_TYPE.TXT" v-html="formate(message.message)"></span>
                                <template v-if="message.status == MSG_ST.SENDING || message.status == MSG_ST.FAIL">
                                    <img v-if="message.msgType == MSG_TYPE.IMG" class="msg-img" :src="message.message" @click="preview(message.message)" @load="scrollBottom" />
                                </template>
                                <template v-else>
                                    <img v-if="message.msgType == MSG_TYPE.IMG" class="msg-img" :src="preImg+message.message" @click="preview(preImg+message.message)" @load="scrollBottom" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="message-item-head">
                        <img src="../assets/img/矢量智能对象.png">
                    </div>
                </div>
            </template>
            <div v-if="message.msgType == MSG_TYPE.SYS && message.ext.fromMsg" class="message-item-type system">
                <div class="message-item-detail" v-text="message.ext.fromMsg"></div>
            </div>
            <!-- <div v-if="message.from != self&&message.chatType == 'znkf'&&!message.ext.welcome" class="message-item-type tmp">
                <span @click="$to({name:'contactOnline'})">未解决？转人工客服</span>
            </div> -->
        </div>
        <div v-if="messages && messages.length > 0 && history" class="message-history">以上为历史消息</div>
        <img ref="img" class="pre-img" :src="preImg">
    </div>
</template>

<script>
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import expressions from "../utils/expressions";
import { preImg } from "../../config/project/project.env";
import { MSG_TYPE, MSG_ST } from "../utils/constants";
export default {
    props: {
        messages: {
            type: Array,
            default: () => []
        },
        showName: {
            type: Boolean,
            default: false
        },
        showMoreBtn: {
            type: Boolean,
            default: false
        },
        noMore: {
            type: Boolean,
            default: false
        },
        history: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            preImg: preImg + "/",
            MSG_ST: MSG_ST,
            MSG_TYPE: MSG_TYPE,
            preImg: "",
            viewer: null,
            self: ""
        };
    },
    mounted() {
        this.viewer = new Viewer(this.$refs.img);
        this.self = this.username = this.Store.get("$user").name;
    },
    methods: {
        showMore() {
            this.$emit("show-more");
        },
        preview(url) {
            this.preImg = url;
            this.viewer.show();
        },
        formate(val) {
            let linkRegExp = "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";
            val = val.replace(new RegExp(linkRegExp, "g"), match => {
                // return `<a class="msg-link" href="#/common/iframe?title=链接&src=${encodeURIComponent(match)}">${match}</a>`;
                return `<a class="msg-link" href="pobo:pageId=900004&url=${match}">${match}</a>`;
            });
            for (let key of Object.keys(expressions.expressions)) {
                let k = key.replace("[", "\\[").replace("]", "\\]");
                if (val) {
                    val = val.replace(new RegExp(k, "g"), '<img class="emoji-img" alt="' + key + '" src="' + expressions.expressionsPrefix + expressions.expressions[key] + '">');
                }
            }
            return val;
        },
        scrollBottom() {
            setTimeout(() => {
                this.$emit("scroll-bottom");
            }, 500);
        },
        tmp(p) {
            this.$emit("tmp", p);
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
@message-item: 15px;
@message-max-height: 80%;
@font-size1: 13px;
@font-size2: 15px;
@head-size: 40px;
@head-radius: 100%;
@message-head-distance: 16px;
@message-detail-padding: 13px;
@message-detail-before-position: -6px;
@message-detail-margin-border: 6px;
.ui-messages {
    .message-showmore {
        padding: 10px 0;
        text-align: center;
        button {
            font-size: @font-size2;
            color: rgba(91, 160, 255, 1);
        }
    }
    .message-nomore {
        padding: 10px 0;
        text-align: center;
        button {
            font-size: 12px;
            color: #999999;
        }
    }
    .message-item {
        margin-bottom: @message-item;
        .message-item-type {
            display: flex;
            padding: 0 10px;
            .message-item-head {
                width: @head-size;
                height: @head-size;
                img {
                    width: @head-size;
                    height: @head-size;
                    border-radius: @head-radius;
                }
            }
            .message-item-info {
                flex: 1;
                .message-item-other-info {
                    padding-bottom: 5px;
                    .message-item-time {
                        display: inline-block;
                        font-size: @font-size1;
                        font-family: Helvetica;
                        color: rgba(153, 153, 153, 1);
                    }
                    .message-item-name {
                        display: inline-block;
                        font-size: @font-size1;
                        font-family: Helvetica;
                        color: @info;
                    }
                }
                .message-item-msg-info {
                    display: flex;
                    .message-item-detail {
                        position: relative;
                        max-width: @message-max-height;
                        padding: @message-detail-padding;
                        border-radius: 5px;
                        font-size: @font-size2;
                        word-break: break-all;
                        &:before {
                            content: "";
                            position: absolute;
                            top: 5px;
                            border: @message-detail-margin-border solid;
                            transform: rotate(45deg);
                        }
                        .msg-img {
                            max-width: 100%;
                            // max-height: 90px;
                        }
                        .emoji-img {
                            padding: 0 2px;
                            vertical-align: text-bottom;
                        }
                        &.tmp {
                            width: @message-max-height;
                            .message-tmps {
                                width: 100%;
                                .message-tmp {
                                    position: relative;
                                    min-height: 40px;
                                    padding: 8px 0;
                                    background: linear-gradient(to bottom, transparent, transparent 50%, #ddd 50%, #ddd) 0 100% no-repeat;
                                    background-size: 100% 1px;
                                    &::after {
                                        content: "";
                                        position: absolute;
                                        right: 0;
                                        top: 50%;
                                        margin-top: -4px;
                                        width: 8px;
                                        height: 8px;
                                        border: 2px solid;
                                        border-color: #ccc #ccc transparent transparent;
                                        border-radius: 2px;
                                        transform: rotate(45deg);
                                    }
                                    &:active {
                                        opacity: 0.5;
                                    }
                                    &:last-child {
                                        background: none;
                                    }
                                }
                            }
                        }
                    }
                    .message-item-state {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .message-item-state-sending {
                            display: inline-block;
                            width: 40px;
                            height: 40px;
                            background: url(../assets/img/loading.gif) no-repeat center;
                            background-size: 16px 16px;
                        }
                        .message-item-state-error {
                            display: inline-block;
                            width: 40px;
                            height: 40px;
                            background: url(../assets/img/error.png) no-repeat center;
                            background-size: 16px 16px;
                        }
                    }
                    .flex-1 {
                        flex: 1;
                    }
                }
            }
            &.receive {
                .message-item-info {
                    .message-item-other-info {
                        padding-left: @message-head-distance;
                    }
                    .message-item-msg-info {
                        .message-item-detail {
                            background: white;
                            margin-left: @message-head-distance;
                            color: #666;
                            &:before {
                                left: @message-detail-before-position + 1;
                                border-color: transparent transparent white white;
                            }
                            a.msg-link {
                                color: @info;
                            }
                        }
                    }
                }
            }
            &.send {
                .message-item-info {
                    .message-item-other-info {
                        text-align: right;
                        padding-right: @message-head-distance;
                    }
                    .message-item-msg-info {
                        .message-item-detail {
                            background: @info;
                            margin-right: @message-head-distance;
                            color: white;
                            &:before {
                                right: @message-detail-before-position + 1;
                                border-color: @info @info transparent transparent;
                            }
                            a.msg-link {
                                color: #0f5ece;
                            }
                        }
                    }
                }
            }
            &.system {
                justify-content: center;
                .message-item-detail {
                    min-width: 50px;
                    padding: 2px 10px;
                    text-align: center;
                    background: #dbdcde;
                    border-radius: 4px;
                    font-size: 12px;
                    color: white;
                }
            }
            &.tmp {
                padding: 10px 0;
                justify-content: center;
                font-size: 12px;
                color: @info;
            }
        }
    }
    .message-history {
        display: flex;
        text-align: center;
        color: #999;
        font-size: 12px;
        padding: 0 @head-size + 10;
        &::before {
            content: "";
            flex: 1;
            margin-right: 10px;
            background: linear-gradient(to bottom, transparent, transparent 25%, #cccccc 25%, #cccccc 75%, transparent 75%, transparent) no-repeat center;
            background-size: 100% 2px;
        }
        &::after {
            content: "";
            flex: 1;
            margin-left: 10px;
            background: linear-gradient(to bottom, transparent, transparent 25%, #cccccc 25%, #cccccc 75%, transparent 75%, transparent) no-repeat center;
            background-size: 100% 2px;
        }
    }
    .pre-img {
        display: none;
    }
}
ul.viewer-toolbar {
    width: 230px;
}
li.viewer-prev,
li.viewer-next {
    display: none;
}
</style>
