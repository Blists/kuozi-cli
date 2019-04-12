<template>
    <ui-layout>
        <ui-head v-if="type==ROLE.GROUP_LEADER.type" title="管理设置">
            <div @click="finish" class="btn-text" slot="right">完成</div>
        </ui-head>
        <ui-head v-else>
            <div slot="title">
                <div class="head-title-line1">管理设置</div>
                <div class="head-title-line2">仅圈主可设置</div>
            </div>
        </ui-head>
        <ui-container class="bg-gray">
            <!-- <div>
                <mt-cell title="动态内显示更新">
                    <ui-switch :readonly="type!=ROLE.GROUP_LEADER.type"></ui-switch>
                </mt-cell>
            </div> -->
            <!-- <div style="margin-top:10px"> -->
            <div>
                <mt-cell title="成员加入方式" is-link :value="group.free?'免费':'收费'" @click.native="showFree"></mt-cell>
                <mt-cell v-if="group.free" title="成员加入需审批">
                    <ui-switch v-model="group.needAudit" :readonly="type!=ROLE.GROUP_LEADER.type" @change="changeNeedAudit" :off="0" :on="1"></ui-switch>
                </mt-cell>
                <mt-cell v-else title="收费金额">
                    <input v-if="type==ROLE.GROUP_LEADER.type" v-model="group.money" style="font-size:14px" class="text-right" type="number" placeholder="请输入金额"/>
                    <span v-else v-text="group.money"></span>
                </mt-cell>
            </div>
        </ui-container>
        <ui-layer :show.sync="show">
            <div class="layer-content">
                <div class="cell-btn hr-bottom" @click="group.free=0;show=false">收费</div>
                <div class="cell-btn" @click="group.free=1;show=false">免费</div>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import { ROLE } from "../../utils/constants";
import UiSwitch from "../../components/UiSwitch.vue";
import UiLayer from "../../components/UiLayer.vue";
export default {
    components: { UiSwitch, UiLayer },
    data() {
        return {
            groupId: this.$route.query.groupId,
            type: this.$route.query.type,
            ROLE: ROLE,
            show: false,
            group: {},
            needAudit: false
        };
    },
    created() {
        this.groupBasicDetail();
    },
    methods: {
        showFree() {
            if (this.type == this.ROLE.GROUP_LEADER.type) {
                this.show = true;
            }
        },
        // 圈子详情
        groupBasicDetail() {
            this.$get("groupBasicDetail", this.groupId).then(res => {
                this.group = res;
            });
        },
        changeNeedAudit() {
            console.log(this.group.needAudit);
        },
        finish() {
            if (!this.group.free && !this.group.money) return this.$toast("收费圈子收费金额必须大于0");
            this.$post("updataGroup", {
                id: this.groupId,
                free: this.group.free,
                needAudit: this.group.needAudit,
                money: this.group.money ? this.group.money : 0
            }).then(res => {
                this.$toast("修改成功");
                this.$back();
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
        display: block;
        width: 100%;
    }
    .group-more-name {
        padding: 20px 0;
        text-align: center;
        font-size: 21px;
        color: #333;
    }
    .group-more-share {
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
                background: url("https://t11.baidu.com/it/u=2935006957,3216040563&fm=173&app=25&f=JPEG?w=640&h=475&s=AB921CCF66721B9CC69C2DBE03005042") no-repeat center;
                background-size: 15px 15px;
            }
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
