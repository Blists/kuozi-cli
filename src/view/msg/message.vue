<template>
    <ui-layout>
        <ui-head title="消息"></ui-head>
        <ui-container class="bg-gray">
            <div class="msg-menus">
                <div v-for="msgType in msgTypes" class="msg-menu" :class="msgType.classNmae" :key="msgType.name" @click="$to({name:'messageType',query:{title:msgType.name,type:msgType.type}})" v-text="msgType.name"></div>
            </div>
            <div class="new-message">
                <ui-loadmore :loadmore="queryMessageByPage" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                    <div class="new-message-title hr-bottom">最新消息</div>
                    <div class="messages">
                        <div class="message" v-for="message in messages" :key="message.id" @click="msgGo(message)">
                            <div class="message-img">
                                <ui-img :src="preImg+message.sendUser"></ui-img>
                            </div>
                            <div class="message-info">
                                <div class="message-text">
                                    <!-- <span>{{message.sendUserName}}</span>{{message.operate}} -->
                                    {{message.content}}
                                </div>
                                <div class="message-time">{{message.sendTime|dateFmt('yyyy-MM-dd hh:mm')}}</div>
                            </div>
                        </div>
                    </div>
                </ui-loadmore>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../mixin/loadmore";
import { preImg } from "../../../config/project/project.env";
import msgGo from "../../mixin/msgGo";
export default {
    mixins: [msgGo, loadmore],
    data() {
        return {
            preImg: preImg,
            msgTypes: [
                {
                    name: "文章",
                    classNmae: "wz",
                    type: 1
                },
                {
                    name: "专栏",
                    classNmae: "zl",
                    type: 2
                },
                {
                    name: "圈子",
                    classNmae: "qz",
                    type: 3
                },
                {
                    name: "课堂",
                    classNmae: "kt",
                    type: 4
                },
                {
                    name: "关注",
                    classNmae: "gz",
                    type: 5
                },
                {
                    name: "其他",
                    classNmae: "qt",
                    type: 6
                }
            ],
            messages: [],
            pageNo: 0,
            loading: false,
            allLoaded: false
        };
    },
    created() {
        this.queryMessageByPage();
        this.readAllMessage();
    },
    methods: {
        queryMessageByPage() {
            this.loading = false;
            this.$post("queryMessageByPage", {
                pageSize: this.PageSize,
                pageNo: ++this.pageNo
            }).then(res => {
                this.messages.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        },
        readAllMessage() {
            this.$get("readAllMessage");
        }
    }
};
</script>

<style lang="less">
.msg-menus {
    display: flex;
    flex-wrap: wrap;
    background: white;
    padding: 10px 0;
    .msg-menu {
        flex: 33.33333%;
        background: no-repeat center 10px;
        padding: 46px 0 10px 0;
        text-align: center;
        font-size: 13px;
        color: #666;
        &.wz {
            background-image: url("../../assets/img/Group 2@2x 5.png");
            background-size: 26px auto;
        }
        &.zl {
            background-image: url("../../assets/img/Group 19@2x 2.png");
            background-size: 26px auto;
        }
        &.qz {
            background-image: url("../../assets/img/Group 21 Copy@2x 2.png");
            background-size: 30px auto;
        }
        &.kt {
            background-image: url("../../assets/img/博士帽@2x 2.png");
            background-size: 32px auto;
        }
        &.gz {
            background-image: url("../../assets/img/Group 20@2x 2.png");
            background-size: 26px auto;
        }
        &.qt {
            background-image: url("../../assets/img/More Icon@2x 2.png");
            background-size: 26px auto;
        }
    }
}

.new-message {
    background: white;
    margin-top: 10px;
    .new-message-title {
        margin: 0 10px;
        padding: 10px 0;
        font-size: 16px;
        color: #666;
    }
}
</style>
