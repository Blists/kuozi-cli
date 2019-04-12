<template>
    <ui-layout full>
        <ui-head title="相关课程"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="searchMore" :loading="loading" :all-loaded="allLoaded" :pull="false" ref="loadmore">
                <div class="my-classs">
                    <div class="my-class" v-for="i in list" :key="i" @click="$to({name:'lessonDetail',query:{id:i.id}})">
                        <div class="my-class-img">
                            <ui-img :src="preImg+i.photo"></ui-img>
                        </div>
                        <div class="my-class-right">
                            <div class="class-title limit2" v-text="i.name"></div>
                            <div class="class-info">
                                <div class="class-label" v-text="`含${i.lessonCount}节课程`"></div>
                                <template v-if="i.free">
                                    <div class="class-no">{{i.buyNums|numJia}}人购买</div>
                                    <div class="class-money">￥{{i.money|numFmt}}</div>
                                </template>
                                <template v-else>
                                    <div class="class-no"></div>
                                    <div class="class-money">免费</div>
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
import highlight from "../../mixin/highlight";
import loadmore from "../../mixin/loadmore";
import { preImg } from "../../../config/project/project.env";
export default {
    mixins: [highlight, loadmore],
    data() {
        return {
            preImg: preImg,
            keyword: this.$route.query.keyword,
            list: [],
            pageNo: 0,
            loading: false,
            allLoaded: false
        };
    },
    created() {
        this.searchMore();
    },
    methods: {
        searchMore() {
            this.loading = true;
            this.$post("searchMore", {
                keywords: this.keyword,
                pageNo: ++this.pageNo,
                pageSize: this.PageSize,
                type: "classRooms"
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
@import "../../style/variables.less";
</style>
