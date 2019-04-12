<template>
    <ui-layout>
        <ui-head title="加入请求"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :bottom-method="loadmore" :bottom-all-loaded="applyList.allLoaded" ref="loadmore">
                <div class="join-members hr-bottom">
                    <div class="join-member hr-bottom" v-for="(apply,index) in applyList.list" :key="apply.id">
                        <div class="join-member-img">
                            <ui-img :src="preImg+apply.user"></ui-img>
                        </div>
                        <div class="flex-1">
                            <div class="join-member-name" v-text="apply.nickName"></div>
                            <div class="join-member-remark">申请加入圈子</div>
                            <div class="join-member-time">申请时间：{{apply.date|dateFmt("yyyy-MM-dd hh:mm")}}</div>
                        </div>
                        <div class="join-member-opt">
                            <div>
                                <button class="active" @click="dealApply(apply.id,1,index)">同意</button>
                                <button @click="dealApply(apply.id,2,index)">拒绝</button>
                            </div>
                        </div>
                    </div>
                </div>
            </ui-loadmore>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import loadmore from "../../mixin/loadmore";
export default {
    mixins: [loadmore],
    data() {
        return {
            preImg: preImg,
            groupId: this.$route.query.groupId,
            applyList: {
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
            this.LoadMore("applyListByPage", "applyList");
        },
        applyListByPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("applyListByPage", {
                        groupId: this.groupId,
                        pageNo: obj.pageNo,
                        pageSize: this.PageSize
                    });
                    reslove(res);
                } catch (error) {
                    reject();
                }
            });
        },
        dealApply(id, status, i) {
            this.$get("dealApply", id + "/" + status + "/" + this.groupId).then(res => {
                this.$toast("处理成功");
                this.applyList.list.splice(i, 1);
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.join-members {
    background: white;
    padding-left: 15px;
    .join-member {
        display: flex;
        padding: 10px 10px 10px 0;
        .join-member-img {
            display: flex;
            align-items: center;
            margin-right: 15px;
            > img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 40px;
            }
        }
        .join-member-name {
            line-height: 20px;
            font-size: 16px;
            color: #333;
        }
        .join-member-remark {
            line-height: 18px;
            font-size: 12px;
            color: #4a4a4a;
        }
        .join-member-time {
            line-height: 18px;
            font-size: 12px;
            color: #999;
        }
        .join-member-opt {
            display: flex;
            align-items: center;
            margin-left: 15px;
            button {
                padding: 1px 14px;
                border: 1px solid @info;
                border-radius: 2px;
                font-size: 12px;
                color: @info;
                &.active {
                    color: white;
                    background: @info;
                }
            }
        }
    }
}
</style>
