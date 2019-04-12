<template>
    <ui-layout>
        <ui-head title="智能客服"></ui-head>
        <ui-container class="container">
            <div ref="messages" class="messages" v-scroll-bottom="90">
                <chat-message :messages="messages" @scroll-bottom="scrollBottom" :self="username" @tmp="tmp" only-auto></chat-message>
            </div>
        </ui-container>
        <chat-input @send="send" :has-photo="false" :has-video="false" @scroll-bottom="scrollBottom" placeholder="点此提问智能客服"></chat-input>
    </ui-layout>
</template>

<script>
import { MSG_TYPE, MSG_ST } from "../../utils/constants";
import ChatInput from "yy-im/packages/app/ChatInput";
import ChatMessage from "yy-im/packages/app/ChatMessage";

export default {
    components: { ChatInput, ChatMessage },
    data() {
        let self = this;
        return {
            messages: [],
            zutoName: "智能机器人",
            username: ""
        };
    },
    created() {
        this.username = this.Store.get("$user").name;
        this.queryWelcome();
    },
    activated() {
        this.scrollBottom();
    },
    methods: {
        scrollBottom() {
            // data-scroll-bottom不为n 移动到底部
            if (this.$refs.messages.getAttribute("data-scroll-bottom") != "n") {
                this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
            }
        },
        // 获取欢迎语
        queryWelcome() {
            this.$get("queryWelcome").then(res => {
                for (let msg of res) {
                    this.addAutoMsg(this.zutoName, this.username, msg.message, null, { welcome: true });
                }
            });
        },
        tmp(m) {
            this.addAutoMsg(this.username, "智能机器人", m.number);
            this.addAutoMsg(this.zutoName, this.username, m.answer);
            this.$nextTick(() => {
                this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
            });
        },
        // 发送
        send({ msg }) {
            this.addAutoMsg(this.username, "智能机器人", msg);
            this.$get("queryAnswer", msg, null, true, true).then(res => {
                // if (res && res.answer) {
                //     this.addAutoMsg(this.zutoName, this.username, res.answer);
                // }
                if (res && res.length > 0) {
                    if (res.length == 1) {
                        this.addAutoMsg(this.zutoName, this.username, res[0].answer);
                    } else {
                        this.addAutoMsg(this.zutoName, this.username, res, MSG_TYPE.TMP);
                    }
                }
            });
        },
        // 添加智能客服聊天记录
        addAutoMsg(from, to, msg, msgType, ext) {
            let time = new Date().getTime();
            this.messages.push({
                from: from,
                accessTime: time,
                chatType: "znkf",
                ext: ext ? ext : {},
                message: msg,
                msgType: msgType ? msgType : MSG_TYPE.TXT,
                readTime: time,
                sendTime: time,
                status: MSG_ST.SUCCESS,
                to: to
            });
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        }
    }
};
</script>

<style lang="less" scoped>
.rgkf {
    padding-right: 13px;
    font-size: 13px;
    color: white;
}
.container {
    position: relative;
    background: #f3f4f5;
    .messages {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: none;
    }
}
</style>
