<template>
    <ui-layout full>
        <ui-head title="相关圈子"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="searchMore" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                <div class="group-list">
                    <div class="group-list-item tj" v-for="group in list" :key="group" @click="$to({name:'groupDetail',query:{groupId:group.id,title:group.name}})">
                        <div class="group-list-item-img">
                            <ui-img :src="preImg+group.photo"></ui-img>
                        </div>
                        <div class="group-list-item-right">
                            <div class="group-list-item-name">
                                <div class="ellipsis" v-text="group.name"></div>
                            </div>
                            <div class="group-list-item-no">
                                <span>{{group.userNumber|numJia}}</span>圈友</div>
                            <div class="group-list-item-ms">
                                <div class="ellipsis" v-text="group.description"></div>
                            </div>
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
export default {
    mixins: [loadmore],
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
                type: "group"
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
