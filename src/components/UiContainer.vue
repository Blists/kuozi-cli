<template>
    <div class="ui-container-warp">
        <div v-if="pullDownRefresh" class="ui-container-top" :style="topStyle" v-text="topStates[topState].text" />
        <div ref="scroll" class="ui-container-scroll">
            <div class="ui-container" :class="{'no-scroll':noBs,'flex-container':flex}">
                <slot />
                <div v-if="pullUpLoad" class="ui-container-bottom" v-text="bottomStates[bottomState].text" />
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
    props: {
        noBs: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        },
        pullUpLoad: {
            type: Boolean,
            default: false
        },
        bottomText: {
            type: String,
            default: "上拉加载更多"
        },
        bottomLoadingText: {
            type: String,
            default: "加载中..."
        },
        bottomNoMoreText: {
            type: String,
            default: "暂无更多"
        },
        pullDownRefresh: {
            type: Boolean,
            default: false
        },
        topText: {
            type: String,
            default: "下拉刷新"
        },
        topLoadingText: {
            type: String,
            default: "加载中..."
        }
    },
    data() {
        let initTop = -30;
        return {
            bottomState: "nomal",
            bottomStates: {
                nomal: { text: this.bottomText },
                loading: { text: this.bottomLoadingText },
                nomore: { text: this.bottomNoMoreText }
            },
            initTop,
            topStyle: { top: initTop + "px" },
            topState: "nomal",
            topStates: {
                nomal: { text: this.topText },
                pull: { text: this.topText },
                loading: { text: this.topLoadingText }
            }
        };
    },
    created() {
        if (this.noBs || this.flex) {
            //
        } else {
            this.$nextTick(() => {
                let config = {
                    click: true,
                    mouseWheel: true,
                    scrollbar: {
                        fade: true,
                        interactive: true
                    }
                };
                if (this.pullUpLoad) {
                    config.pullUpLoad = { threshold: -10 };
                }
                if (this.pullDownRefresh) {
                    config.pullDownRefresh = {
                        threshold: 50,
                        stop: 30
                    };
                }
                if (this.$refs.scroll) {
                    this.bs = new BScroll(this.$refs.scroll, config);
                    this.bs.on("pullingUp", () => {
                        this.bottomState = "loading";
                        this.$emit("pull-up");
                    });
                    this.bs.on("pullingDown", () => {
                        this.topState = "loading";
                        this.$emit("pull-down");
                    });
                    this.bs.on("scroll", ({ y }) => {
                        if (y > 0) {
                            this.topStyle.top = Math.min(y + this.initTop, 0) + "px";
                        }
                    });
                }
            });
        }
    },
    methods: {
        refresh() {
            this.bs.refresh();
        },
        uploaded(nomore) {
            if (nomore) {
                this.bottomState = "nomore";
            } else {
                this.bottomState = "nomal";
                this.bs.finishPullUp();
            }
        },
        downloaded() {
            this.topState = "nomal";
            this.bs.finishPullDown();
        }
    }
};
</script>

<style lang="less">
.ui-container-warp {
    position: relative;
    flex: 1;
    overflow: hidden;
    .ui-container-scroll {
        height: 100%;
        .ui-container {
            position: relative;
            &::before,
            &::after {
                display: block;
                height: 1px;
                content: "";
            }
            &.no-scroll {
                height: 100%;
                overflow: auto;
            }
            &.flex-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden;
            }
        }
    }
    .ui-container-bottom,
    .ui-container-top {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #666;
    }
    .ui-container-top {
        position: absolute;
        width: 100%;
        left: 0;
    }
}
</style>