import UiLoadmore from "../components/UiLoadmore.vue";
// 下拉刷新上拉加载更多
export default {
    components: { UiLoadmore },
    methods: {
        // 下拉刷新
        async LoadTop(method, key) {
            let obj = key ? this[key] : this;
            obj.loading = true;
            obj.allLoaded = false;
            obj.pageNo = 1;
            try {
                let res = await this[method](obj);
                obj.list = res.results;
                obj.allLoaded = obj.pageNo >= res.pageCount;
                this.$forceUpdate();
            } finally {
                obj.loading = false;
                this.loadMoreLoaded(1, obj.ref);
            }
        },
        // 上拉加载更多
        async LoadMore(method, key) {
            let obj = key ? this[key] : this;
            obj.loading = true;
            ++obj.pageNo;
            try {
                let res = await this[method](obj);
                obj.list.push(...res.results);
                obj.allLoaded = obj.pageNo >= res.pageCount;
                this.$forceUpdate();
            } finally {
                obj.loading = false;
                this.loadMoreLoaded(2, obj.ref);
            }
        }
    }
};
