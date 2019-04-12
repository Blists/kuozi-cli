<template>
    <ui-layout>
        <ui-head title="邀请嘉宾"></ui-head>
        <ui-container v-show="inviter">
            <div class="invited">
                <div class="invited-text bg">1.点击右上角三个点“…”，选择“
                    <span>发送给朋友</span>”，好友点击链接即可。</div>
                <div class="invited-text">2.一条连接只能邀请一个用户成为嘉宾</div>
                <div class="invited-text">3.邀请链接
                    <span>60分钟</span>内有效</div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    data() {
        return {
            groupId: this.$route.query.groupId,
            groupName: this.$route.query.groupName,
            photo: this.$route.query.photo,
            name: "",
            inviter: ""
        };
    },
    created() {
        this.inviteLink();
        this.name = this.Store.get("$user").name;
    },
    methods: {
        inviteLink() {
            this.$post("inviteLink", { groupId: this.groupId }).then(res => {
                this.inviter = res;
                this.share();
            });
        },
        share() {
            shareAll({
                title: `「期望财经」▪${this.groupName} 嘉宾邀请`,
                desc: `${this.name}邀请您成为${this.groupName}圈子的嘉宾，点击查看`,
                path: `/group/groupDetail?groupId=${this.groupId}&title=${this.groupName}&inviter=${this.inviter}`,
                imgUrl: preImg + this.photo,
                inviter: this.inviter
            });
        }
    },
    beforeDestroy() {
        resetShare();
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.invited {
    padding: 15px;
    font-size: 16px;
    color: #333;
    .invited-text {
        padding: 10px 20px;
        &.bg {
            margin-bottom: 10px;
            padding: 20px;
            background: #edeef2;
            border-radius: 6px;
        }
        > span {
            color: @info;
        }
    }
}
</style>
