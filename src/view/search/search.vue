<template>
    <ui-layout>
        <ui-head all-slot>
            <div class="search-head">
                <div class="search-input">
                    <input v-model="keyword" @input="show=!!keyword" type="text" placeholder="请输入关键词/文章/圈子/达人/专栏/课程/问答" growing-track='true'>
                </div>
                <button v-if="show" class="search-btn" @click="search">确定</button>
                <button v-else class="search-btn" @click="$back">取消</button>
            </div>
        </ui-head>
        <ui-container class="bg-gray">
            <template v-if="showSearchResults">
                <div v-if="searchResults.user&&searchResults.user.results.length>0" class="search-result">
                    <div class="search-type">
                        <div class="search-type-name">用户</div>
                        <div v-if="searchResults.user.results.length>4" class="search-type-more" @click="$to({name:'searchUser',query:{keyword:keyword}})">查看更多</div>
                    </div>
                    <div class="search-results">
                        <div class="search-tws">
                            <div class="search-tw user" v-for="(i,index) in searchResults.user.results" @click="$to({name:'homePage',query:{loginName:i.loginName}})" v-if="index<4" :key="i">
                                <div class="search-tw-img">
                                    <ui-img :src="preImg+i.loginName"></ui-img>
                                </div>
                                <div class="search-tw-text" v-text="i.nickName"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchResults.group&&searchResults.group.results.length>0" class="search-result">
                    <div class="search-type">
                        <div class="search-type-name">圈子</div>
                        <div class="search-type-more" v-if="searchResults.group.results.length>4" @click="$to({name:'searchGroup',query:{keyword:keyword}})">查看更多</div>
                    </div>
                    <div class="search-results">
                        <div class="search-tws">
                            <div class="search-tw group" v-for="(i,index) in searchResults.group.results" @click="$to({name:'groupDetail',query:{groupId:i.id,title:i.name}})" v-if="index<4" :key="i">
                                <div class="search-tw-img">
                                    <ui-img :src="preImg+i.photo"></ui-img>
                                </div>
                                <div class="search-tw-text">
                                    <div v-text="i.name"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchResults.classRooms&&searchResults.classRooms.results.length>0" class="search-result">
                    <div class="search-type">
                        <div class="search-type-name">课堂</div>
                        <div class="search-type-more" v-if="searchResults.classRooms.results.length>4" @click="$to({name:'searchClass',query:{keyword:keyword}})">查看更多</div>
                    </div>
                    <div class="search-results">
                        <div class="search-tws">
                            <div class="search-tw class" v-for="(i,index) in searchResults.classRooms.results" @click="$to({name:'lessonDetail',query:{id:i.id}})" v-if="index<4" :key="i">
                                <div class="search-tw-img">
                                    <ui-img :src="preImg+i.photo"></ui-img>
                                </div>
                                <div class="search-tw-text">
                                    <div v-text="i.name"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchResults.article&&searchResults.article.results.length>0" class="search-result">
                    <div class="search-type">
                        <div class="search-type-name">文章</div>
                        <div class="search-type-more" v-if="searchResults.article.results.length>4" @click="$to({name:'searchArticle',query:{keyword:keyword}})">查看更多</div>
                    </div>
                    <div class="search-results">
                        <div class="search-articles">
                            <div class="search-article hr-bottom" v-for="(i,index) in searchResults.article.results" @click="$to({name:'articleDetail',params:{id:i.id},query:{title:i.title,id:i.id}})" v-if="index<4" :key="i">
                                <div class="search-article-title" v-html="highlight(keyword,i.title)"></div>
                                <div class="flex">
                                    <div class="search-article-at">{{i.nickName}} {{i.publishTime|dateFmt('yyyy-MM-dd')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchResults.question&&searchResults.question.results.length>0" class="search-result">
                    <div class="search-type">
                        <div class="search-type-name">问答</div>
                        <div class="search-type-more" v-if="searchResults.question.results.length>4" @click="$to({name:'searchWd',query:{keyword:keyword}})">查看更多</div>
                    </div>
                    <div class="search-results">
                        <div class="search-wds">
                            <div class="search-wd limit hr-top" v-for="(i,index) in searchResults.question.results" v-if="index<4" @click="$to({name:'groupAnswer',query:{id:i.id,groupId:i.groupId}})" :key="i" v-html="highlight(keyword,i.targetNickName+'回答了'+i.sponsorNickName+'的问题：'+i.question)"></div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="search-history">
                <div class="flex">
                    <div class="search-ssls">搜索历史</div>
                    <div v-if="searchHistory.length>0" class="search-qk" @click="clear">清空</div>
                </div>
                <div class="search-history-btns">
                    <button v-for="s in searchHistory" :key="s" v-text="s" @click="keyword=s;search()"></button>
                </div>
            </div>
            <ui-nomore :value="!empty"></ui-nomore>
        </ui-container>
        <router-view></router-view>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import highlight from "../../mixin/highlight";
export default {
    mixins: [highlight],
    data() {
        return {
            preImg: preImg,
            keyword: "",
            show: false,
            searchHistory: [],
            searchResults: {},
            showSearchResults: false,
            empty: false
        };
    },
    created() {
        this.searchHistory = this.Store.get("$searchHistory") || [];
    },
    methods: {
        search() {
            this.show = false;
            this.showSearchResults = true;
            if (this.searchHistory.findIndex(v => v == this.keyword) < 0) {
                this.searchHistory.push(this.keyword);
                this.Store.set("$searchHistory", this.searchHistory);
            }
            this.$post("searchByKeywords", {
                keywords: this.keyword,
                pageNo: 1,
                pageSize: 5
            }).then(res => {
                this.searchResults = res;
                this.empty = !(res.article.count || res.classRooms.count || res.column.count || res.group.count || res.question.count || res.user.count);
            });
        },
        clear() {
            this.searchHistory = [];
            this.Store.set("$searchHistory", this.searchHistory);
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.search-head {
    display: flex;
    .search-input {
        flex: 1;
        padding: 8px 10px;
        input {
            width: 100%;
            height: 28px;
            border-radius: 28px;
            padding-left: 35px;
            background: #edeef2 url("../../assets/img/Combined Shape@2x.png") no-repeat 10px center;
            background-size: 16px;
            font-size: 13px;
            &::-webkit-input-placeholder {
                color: #9999;
            }
        }
    }
    .search-btn {
        height: 44px;
        font-size: 16px;
        color: @info;
        padding: 0 10px 0 0;
    }
}
.search-history {
    background: white;
    padding: 10px;
    .search-ssls {
        flex: 1;
        font-size: 16px;
        color: #666;
    }
    .search-qk {
        font-size: 14px;
        color: #666;
    }
    .search-history-btns {
        padding-top: 5px;
        > button {
            padding: 3px 8px;
            margin-top: 10px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            color: #999;
        }
    }
}
.search-result {
    background: white;
    padding: 15px 10px;
    margin-bottom: 10px;
    .search-type {
        display: flex;
        font-size: 14px;
        .search-type-name {
            flex: 1;
            color: #999;
        }
        .search-type-more {
            padding-left: 23px;
            background: url("../../assets/img/Combined Shape@2x.png") no-repeat 0 center;
            background-size: 17px;
            color: @info;
        }
    }
}
.search-tws {
    display: flex;
    flex-wrap: wrap;
    height: 60px;
    margin-top: 10px;
    overflow: hidden;
    .search-tw {
        width: 25%;
        .search-tw-img {
            margin: 0 auto;
            border-radius: 100%;
            overflow: hidden;
            > img {
                display: block;
                border-radius: 100%;
            }
        }
        &.user {
            .search-tw-img {
                width: 30px;
                height: 30px;
                > img {
                    width: 30px;
                    height: 30px;
                }
            }
        }
        &.group {
            .search-tw-img {
                width: 30px;
                height: 30px;
                border-radius: 4px;
                > img {
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                }
            }
        }
        &.class {
            .search-tw-img {
                width: 38px;
                height: 30px;
                border-radius: 4px;
                > img {
                    width: 38px;
                    height: 30px;
                    border-radius: 4px;
                }
            }
        }
        .search-tw-text {
            position: relative;
            height: 23px;
            margin-top: 7px;
            text-align: center;
            font-size: 15px;
            color: #333;
            > div {
                position: absolute;
                width: 100%;
                height: 23px;
                padding: 0 2px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
}

.search-articles {
    background: white;
    .search-article {
        padding: 10px 0;
        &:last-child {
            &:after {
                content: none;
            }
        }
        .search-article-title {
            font-size: 16px;
            color: #333;
            > span {
                color: @info;
            }
        }
        .search-article-desc {
            height: 60px;
            margin: 8px 0;
            font-size: 13px;
            color: #999;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            > span {
                color: @info;
            }
        }
        .search-article-at {
            flex: 1;
            font-size: 11px;
            color: #afafaf;
        }
    }
}

.search-wds {
    background: white;
    .search-wd {
        padding-top: 10px;
        margin-top: 10px;
        font-size: 16px;
        color: #333;

        &:first-child {
            margin-top: 0;
            &:before {
                content: none;
            }
        }
        > span {
            color: @info;
        }
        &.limit {
            max-height: 56px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
