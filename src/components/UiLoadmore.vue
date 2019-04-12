<template>
    <div ref="wrapper">
        <mt-loadmore :top-method="pullRefresh" :bottom-method="loadMore" :bottom-all-loaded="loaded" :auto-fill="autoFill" ref="loadmore">
            <div v-if="topLoading" class="mint-loadmore-top" slot="top" style="margin-top:0">
                <mt-spinner class="mint-loadmore-spinner" type="fading-circle" :size="20"></mt-spinner>
                <span class="mint-loadmore-text">加载中...</span>
            </div>
            <slot></slot>
        </mt-loadmore>
        <div v-if="!loading&&!topLoading">
            <div v-if="loaded" class="nomore-text" v-text="bottomNomoreText"></div>
            <template v-else>
                <div v-if="!isMobile&&loadMore" class="loadmore-text" @click="loadMore" v-text="bottomLoadmoreText"></div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        topMethod: {},
        pull: {},
        bottomMethod: {},
        loadmore: {},
        bottomAllLoaded: {},
        allLoaded: {},
        autoFill: {
            type: Boolean,
            default: false
        },
        bottomNomoreText: {
            type: String,
            default: "暂无更多了~"
        },
        bottomLoadmoreText: {
            type: String,
            default: "加载更多"
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            topLoading: true,
            pullRefresh: undefined,
            loadMore: undefined,
            isMobile: /iPhone|Android/.test(navigator.userAgent),
            mtLoadmore: null
        };
    },
    created() {
        let pullRefresh = this.pullRefreshM();
        this.pullRefresh = pullRefresh
            ? () => {
                pullRefresh();
            }
            : undefined;
        let loadMore = this.loadMoreM();
        this.loadMore = loadMore
            ? () => {
                loadMore();
            }
            : undefined;
    },
    mounted() {
        this.mtLoadmore = this.$refs.loadmore;
        this.$refs.wrapper.addEventListener("touchstart",  (event)=> {
            event.target.classList.add("needsclick");
        });
        // this.$refs.wrapper.addEventListener("touchend",  (event)=> {
        //     event.target.classList.remove("needsclick");
        // });
    },
    methods: {
        init() {
            this.pullRefresh();
        },
        pullRefreshM() {
            if (this.topMethod) {
                return this.topMethod;
            }
            if (this.pull) {
                return this.pull;
            }
            return false;
        },
        loadMoreM() {
            if (this.bottomMethod) {
                return this.bottomMethod;
            }
            if (this.loadmore) {
                return this.loadmore;
            }
            return false;
        },
        onTopLoaded() {
            this.topLoading = false;
            this.$refs.loadmore.onTopLoaded();
        },
        onBottomLoaded() {
            this.topLoading = false;
            // this.$refs.loadmore.onBottomLoaded();
            let $loadmore = this.$refs.loadmore;
            $loadmore.bottomStatus = "pull";
            $loadmore.bottomDropped = false;
            this.$nextTick(() => {
                $loadmore.translate = 0;
            });
            if (!$loadmore.bottomAllLoaded && !$loadmore.containerFilled) {
                $loadmore.fillContainer();
            }
        },
        topStatusChange(status) {
            console.log(status);
            this.topLoading = false;
        }
    },
    computed: {
        loaded() {
            return this.bottomAllLoaded || this.allLoaded;
        }
    }
};
</script>

<style lang="less">
.nomore-text {
    padding: 15px 0;
    text-align: center;
    font-size: 12px;
    color: #ccc;
}
.loadmore-text {
    cursor: pointer;
    padding: 15px 0;
    text-align: center;
    font-size: 13px;
    color: #333;
}
</style>
