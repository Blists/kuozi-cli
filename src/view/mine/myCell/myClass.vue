<template>
    <ui-layout>
        <ui-head title="我的课堂"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="myClassRoom" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                <div class="my-classs">
                    <div class="my-class" v-for="i in list" :key="i" @click="$to({ name: 'lessonDetail', query: { id: i.id } })">
                        <div class="my-class-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="my-class-right">
                            <div class="class-title limit2" v-text="i.name"></div>
                            <div class="class-info">
                                <div class="class-label" v-text="`含${i.lessonCount||0}节课程`"></div>
                                <div class="class-no">{{i.buyNums|numJia}}人购买</div>
                                <div v-if="i.bought" class="class-money">已购买</div>
                                <template v-else>
                                    <div v-if="i.free" class="class-money">免费</div>
                                    <div v-else class="class-money">￥{{i.money||0|numFmt}}</div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import loadmore from "../../../mixin/loadmore";
import { preImg } from "../../../../config/project/project.env";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            list: [],
            loading: false,
            allLoaded: false,
            pageNo: 0
        };
    },
    created() {
        this.myClassRoom();
    },
    methods: {
        myClassRoom() {
            this.loading = true;
            this.$post("myClassRoom", {
                pageNo: ++this.pageNo,
                pageSize: this.PageSize,
                status: 1
            }).then(res => {
                this.list.push(...res.results);
                this.allLoaded = this.pageNo >= res.pageCount;
                this.loading = false;
                this.loadMoreLoaded(this.pageNo);
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
</style>
