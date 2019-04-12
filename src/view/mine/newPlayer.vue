<template>
    <ui-layout>
        <ui-head title="新手任务"></ui-head>
        <ui-container>
            <div class="new-players">
                <div class="new-player" v-for="(t,i) in tasks" :key="t.id">
                    <div class="new-player-info">
                        <div class="new-player-text" @click="activeTaskIndex=i;layer=true" v-text="t.title"></div>
                        <div v-if="t.condition1" class="new-player-process" :class="{finish:t.status/1==1}">
                            <div :style="{width:(t.schedule*100/t.condition1)+'%'}"></div>
                            <span><span v-text="t.schedule"></span>/<span v-text="t.condition1"></span></span>
                        </div>
                    </div>
                    <div class="new-player-score">+<span v-text="t.bonusScore"></span>积分</div>
                    <div class="new-player-btn">
                        <button v-if="t.status/1==0">未完成</button>
                        <button v-if="t.status/1==1" class="lq" @click="receiveScore(i)">领取</button>
                        <button v-if="t.status/1==2" class="ylq">已领取</button>
                    </div>
                </div>
            </div>
        </ui-container>
        <ui-root>
            <ui-layer :show.sync="layer">
                <div class="layer-content" v-if="tasks[activeTaskIndex]">
                    <div class="new-player-msg">
                        <div class="new-player-title" v-text="tasks[activeTaskIndex].title"></div>
                        <div class="new-player-detail" v-text="tasks[activeTaskIndex].desc1"></div>
                    </div>
                </div>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>

<script>
import UiRoot from "../../components/UiRoot.vue";
import UiLayer from "../../components/UiLayer.vue";
export default {
    components: { UiRoot, UiLayer },
    data() {
        return {
            layer: false,
            tasks: [],
            // 0:未完成 1已完成  2已领取,
            activeTaskIndex: 0
        };
    },
    created() {
        this.queryTaskInfo();
    },
    methods: {
        async queryTaskInfo() {
            this.tasks = await this.$get("queryTaskInfo");
        },
        async receiveScore(i) {
            let task = this.tasks[i];
            await this.$post("receiveScore", { taskId: task.id });
            if (task.condition1) {
                task.schedule = task.condition1;
            }
            this.tasks[i].status = 2;
            this.$toast("领取成功");
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.new-players {
    padding: 15px;
    .new-player {
        display: flex;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #333;
        .new-player-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            .new-player-text {
                padding-left: 20px;
                background: url("../../assets/img/Group@2x 4.png") no-repeat 0 center;
                background-size: 14px 14px;
                line-height: 20px;
            }
            .new-player-process {
                position: relative;
                height: 18px;
                line-height: 16px;
                border-radius: 12px;
                border: 1px solid #cae0fa;
                text-align: center;
                overflow: hidden;
                margin-top: 5px;
                font-size: 12px;
                color: #333;
                > span {
                    position: relative;
                    z-index: 1;
                }
                > div {
                    position: absolute;
                    height: 100%;
                    left: 0;
                    top: 0;
                    background: #cae0fa;
                }
                &.finish {
                    background: @info;
                    color: white;
                    > div {
                        display: none;
                    }
                }
            }
        }
        .new-player-score {
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 25px;
        }
        .new-player-btn {
            display: flex;
            align-items: center;
            > button {
                width: 70px;
                height: 25px;
                border-radius: 4px;
                font-size: 12px;
                color: white;
                background: #cae0fa;
                &.lq {
                    background: @info;
                }
                &.ylq {
                    color: @info;
                    background: white;
                    border: 1px solid @info;
                }
            }
        }
    }
}
.new-player-msg {
    padding: 30px 15px;
    .new-player-title {
        font-size: 16px;
        color: #333;
    }
    .new-player-detail {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
    }
}
</style>
