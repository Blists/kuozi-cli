<template>
    <div ref="container" class="ui-container-warp">
        <div v-if="pullDownRefresh&&topStates[topState]" class="ui-container-top" :style="topStyle" v-text="topStates[topState].text" />
        <div ref="scroll" class="ui-container-scroll-warp">
            <div class="ui-container-scroll" :class="{'no-scroll':noBs,'flex-container':flex}">
                <div :style="containerStyle" class="ui-container">
                    <slot />
                </div>
                <div v-if="pullUpLoad&&bottomStates[bottomState]" class="ui-container-bottom" v-text="bottomStates[bottomState].text" />
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
        topReleaseText: {
            type: String,
            default: "释放刷新"
        },
        topLoadingText: {
            type: String,
            default: "加载中..."
        }
    },
    data() {
        let initTop = -30;
        return {
            containerStyle: {},
            initTop,
            topStyle: { top: initTop + "px" },
            topState: "",
            topStates: {
                nomal: { text: this.topText },
                release: { text: this.topReleaseText },
                loading: { text: this.topLoadingText }
            },
            bottomState: "",
            bottomStates: {
                nomal: { text: this.bottomText },
                loading: { text: this.bottomLoadingText },
                nomore: { text: this.bottomNoMoreText }
            }
        };
    },
    mounted() {
        if (this.noBs || this.flex) {
            //
        } else {
            let container = this.$refs.container;
            if (this.pullDownRefresh && container.clientHeight <= 0) {
                var observer = new MutationObserver(() => {
                    if (container.clientHeight > 0) {
                        observer.disconnect();
                        this.init(container.clientHeight);
                    }
                });
                observer.observe(container, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            } else {
                this.init(container.clientHeight);
            }
        }
    },
    methods: {
        init(clientHeight) {
            this.$nextTick(() => {
                let config = {
                    bounce: {
                        top: false,
                        bottom: false
                    },
                    click: true,
                    mouseWheel: true,
                    scrollbar: {
                        fade: true,
                        interactive: true
                    }
                };
                if (this.pullDownRefresh) {
                    this.containerStyle = { minHeight: (clientHeight + 1) + "px" };
                    config.pullDownRefresh = {
                        threshold: Math.abs(this.initTop),
                        stop: Math.abs(this.initTop)
                    };
                    config.bounce.top = true;
                }
                if (this.pullUpLoad) {
                    config.pullUpLoad = { threshold: 10 };
                    config.bounce.bottom = true;
                }
                if (this.$refs.scroll) {
                    this.bs = new BScroll(this.$refs.scroll, config);
                    // 下拉刷新
                    this.bs.on("pullingDown", () => {
                        this.bottomState = "";
                        this.topState = "loading";
                        this.$emit("pull-down");
                    });
                    this.bs.on("scroll", position => {
                        this.$emit("scroll", position);
                        // 下拉处理
                        if (position.y > 0) {
                            this.topStyle.top = Math.min(position.y + this.initTop, 0) + "px";
                            if (this.topState != "loading") {
                                if (position.y < Math.abs(this.initTop)) {
                                    this.topState = "nomal";
                                } else {
                                    this.topState = "release";
                                }
                            }
                        }
                    });
                    // 上拉加载
                    this.bs.on("pullingUp", () => {
                        if (this.bottomState == "nomore") {
                            this.bs.finishPullUp();
                        } else {
                            this.bottomState = "loading";
                            this.$emit("pull-up");
                        }
                    });
                }
            });
        },
        refresh() {
            this.bs && this.bs.refresh();
        },
        // 下拉
        downloaded(nomore) {
            if (nomore) {
                this.bottomState = "nomore";
            }
            this.topState = "";
            this.bs && this.bs.finishPullDown();
            this.refresh();
        },
        // 上拉
        uploaded(nomore) {
            this.bottomState = nomore ? "nomore" : "nomal";
            this.bs && this.bs.finishPullUp();
            this.refresh();
        }
    }
};
</script>

<style lang="less">
.ui-container-warp {
    position: relative;
    flex: 1;
    overflow: hidden;
    > .ui-container-scroll-warp {
        height: 100%;
        > .ui-container-scroll {
            > .ui-container {
                position: relative;
                &::before,
                &::after {
                    display: block;
                    height: 1px;
                    content: "";
                    margin-top: -1px;
                }
            }
            &.no-scroll {
                height: 100%;
                > .ui-container {
                    overflow: auto;
                }
            }
            &.flex-container {
                height: 100%;
                > .ui-container {
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    overflow: hidden;
                }
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