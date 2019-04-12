<template>
    <ui-layout>
        <ui-head transparent></ui-head>
        <ui-container class="bg-gray">
            <div class="group-more">
                <div class="group-more-bg">
                    <ui-img :src="preImg+photo"></ui-img>
                </div>
                <div class="group-more-name" v-text="groupName"></div>
                <!-- <div class="group-share">
                    <button>
                        <span></span>分享圈子
                    </button>
                </div> -->
                <div>
                    <mt-cell title="圈子资料" is-link @click.native="$to({name:'groupInfo',query:{groupId:groupId}})"></mt-cell>
                    <mt-cell title="圈中成员" is-link :value="totalNumber" @click.native="$to({name:'groupMember',query:{groupId:groupId,groupName,photo,type:type}})"></mt-cell>
                    <mt-cell :title="type==ROLE.GROUP_LEADER.type?'管理设置':'管理权限'" is-link @click.native="$to({name:'groupSetting',query:{groupId:groupId,type:type}})"></mt-cell>
                    <!-- <mt-cell title="管理权限" is-link @click.native="$to({name:'groupSetting',query:{groupId:groupId,type:type}})"></mt-cell> -->
                </div>
            </div>
            <template v-if="type==ROLE.GROUP_LEADER.type">
                <div v-if="status==7" class="group-more-btn">解散圈子审核中</div>
                <div v-if="status==6" class="group-more-btn">解散中</div>
                <div v-if="status!=7&&status!=6&&status!=5" class="group-more-btn" @click="disbandGroup">申请解散圈子</div>
            </template>
            <template v-else>
                <div v-if="type!=ROLE.NO_JOIN.type&&status!=5" class="group-more-btn" @click="quitGroup">退出圈子</div>
            </template>
            <div v-if="status==5" class="group-more-btn">圈子已解散</div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { ROLE } from "../../utils/constants";
export default {
    data() {
        return {
            preImg: preImg,
            ROLE: ROLE,
            groupId: this.$route.query.groupId,
            photo: this.$route.query.photo,
            groupName: this.$route.query.groupName,
            totalNumber: this.$route.query.totalNumber,
            type: this.$route.query.type,
            status: 0
        };
    },
    created() {
        this.groupBasicDetail();
    },
    methods: {
        async groupBasicDetail() {
            let res = await this.$get("groupBasicDetail", this.groupId);
            this.status = res.status;
        },
        disbandGroup() {
            this.$get("disbandGroup", this.groupId).then(() => {
                this.$toast("申请解散圈子成功");
                this.status = 7;
            });
        },
        quitGroup() {
            this.$get("quitGroup", this.groupId).then(() => {
                this.$toast("退出圈子成功");
                this.$back("-2");
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.group-more {
    background: white;
    .group-more-bg {
        position: relative;
        height: 200px;
        overflow: hidden;
        > img {
            position: absolute;
            bottom: 0;
            display: block;
            width: 100%;
            min-height: 200px;
            margin-top: -50px;
        }
    }
    .group-more-name {
        padding: 20px 0;
        text-align: center;
        font-size: 21px;
        color: #333;
    }
}
.group-share {
    text-align: center;
    margin-bottom: 30px;
    button {
        height: 36px;
        padding: 0 18px;
        border: 1px solid @info;
        border-radius: 36px;
        font-size: 16px;
        color: @info;
        > span {
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url("") no-repeat center;
            background-size: 15px 15px;
        }
    }
}
.group-more-btn {
    height: 45px;
    line-height: 45px;
    margin: 20px 48px;
    text-align: center;
    background: white;
    border-radius: 6px;
    font-size: 18px;
    color: #f45574;
}
</style>
