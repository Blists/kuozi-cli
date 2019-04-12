<template>
    <ui-layout full>
        <ui-head title="相关用户"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :loadmore="searchMore" :loading="loading" :all-loaded="allLoaded" ref="loadmore">
                <div class="search-users">
                    <div class="search-user" v-for="user in list" :key="user.id" @click="$to({name:'homePage',query:{loginName:user.phone}})">
                        <div class="search-user-img">
                            <ui-img :src="preImg+user.phone"></ui-img>
                            <div v-if="false" class="search-user-v">v</div>
                        </div>
                        <div class="search-user-name" v-text="user.nickName"></div>
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
                type: "user"
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
.search-users {
    background: white;
    padding: 10px 10px 10px 0;
    .search-user {
        display: flex;
        padding: 10px 0;
        background: url("../../assets/img/Group Copy 6@2x.png") no-repeat center right;
        background-size: 7px auto;
        .search-user-img {
            position: relative;
            margin: 0 15px;
            img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 100%;
            }
            .search-user-v {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 14px;
                height: 14px;
                border-radius: 100%;
                line-height: 14px;
                text-align: center;
                background: #fec755;
                font-size: 10px;
                color: white;
            }
        }
        .search-user-name {
            flex: 1;
            padding: 8px 0;
            font-size: 16px;
            color: #333;
        }
    }
}
</style>
