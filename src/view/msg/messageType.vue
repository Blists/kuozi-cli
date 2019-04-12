<template>
    <ui-layout>
        <ui-head :title="title"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="queryMessageByPage" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
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
            type: this.$route.query.type,
            title: this.$route.query.title,
            preImg: preImg,
            messages: [],
            pageNo: 0,
            loading: false,
            allLoaded: false
        };
    },
    created() {
        this.queryMessageByPage();
    },
    methods: {
        queryMessageByPage() {
            this.loading = false;
            this.$post("queryMessageByPage", {
                msgType: this.type,
                pageSize: this.PageSize,
                pageNo: ++this.pageNo
            }).then(res => {
                this.messages.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        }
    }
};
</script>

<style lang="less">
</style>
