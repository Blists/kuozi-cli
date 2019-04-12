<template>
    <ui-layout full>
        <ui-head title="专栏成员"></ui-head>
        <ui-container>
            <ui-loadmore :bottom-method="loadmore" :bottom-all-loaded="users.allLoaded" ref="loadmore">
                <div v-for="user in users.list" :key="user.id" class="cuser">
                    <div class="cuser-img">
                        <ui-img :src="preImg+user.loginName"></ui-img>
                    </div>
                    <div class="cuser-info">
                        <div class="cuser-name">
                            <span class="text-info" v-text="user.nickName"></span>关注专栏</div>
                        <div class="cuser-time">关注时间：{{user.createTime|dateFmt('yyyy-MM-dd hh:mm:ss')}}</div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
import loadmore from "../../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            columnId: this.$route.query.columnId,
            users: {
                ref: "loadmore",
                pageNo: 0,
                list: [],
                loading: false,
                allLoaded: false
            }
        };
    },
    created() {
        this.loadmore();
    },
    methods: {
        loadmore() {
            this.LoadMore("columnQueryUser", "users");
        },
        columnQueryUser(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("columnQueryUser", {
                        columnId: this.columnId,
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        }
    }
};
</script>

<style lang="less">
@import "../../../style/variables.less";
.cuser {
    display: flex;
    padding: 15px;
    .cuser-img {
        padding: 5px 0;
        > img {
            width: 35px;
            height: 35px;
            border-radius: 35px;
        }
    }
    .cuser-info {
        flex: 1;
        padding-left: 10px;
        .cuser-name {
            font-size: 16px;
            color: #4a4a4a;
        }
        .cuser-time {
            font-size: 14px;
            color: #9b9b9b;
        }
    }
}
</style>
