<template>
    <ui-layout>
        <ui-head :title="`我的粉丝(${fanss.list.length})`"></ui-head>
        <ui-container class="bg-gray">
            <ui-loadmore :bottom-method="loadmore" :bottom-all-loaded="fanss.allLoaded" ref="loadmore">
                <div v-if="fanss.list.length" class="fanss">
                    <div class="fans" v-for="fans in fanss.list" :key="fans.id">
                        <div class="fans-img">
                            <ui-img :src="preImg+fans.phone"></ui-img>
                            <div v-if="false" class="fans-v">v</div>
                        </div>
                        <div class="fans-name" v-text="fans.nickName"></div>
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
            fanss: {
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
            this.LoadMore("queryMyFansPage", "fanss");
        },
        queryMyFansPage(obj) {
            return new Promise(async (reslove, reject) => {
                try {
                    let res = await this.$post("queryMyFansPage", {
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
.fanss {
    background: white;
    padding: 10px 0;
    .fans {
        display: flex;
        padding: 10px 0;
        .fans-img {
            position: relative;
            margin: 0 15px;
            img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 100%;
            }
            .fans-v {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 14px;
                height: 14px;
                border-radius: 100%;
                line-height: 14px;
                text-align: center;
                background: #fec755;
                font-size: 10px;
                color: white;
            }
        }
        .fans-name {
            flex: 1;
            padding: 8px 0;
            font-size: 16px;
            color: #333;
        }
    }
}
</style>
