<template>
    <ui-layout>
        <ui-head title="我的勋章"></ui-head>
        <ui-container>
            <div class="medals">
                <div class="medal-type" v-for="type in medals" :key="type.id">
                    <div class="medal-title">{{`${type.medalName}(${type.haveNumber}/${type.totalNumber})`}}</div>
                    <div class="medal-items">
                        <div class="medal-item" v-for="(m,i) in type.data" :style="{backgroundImage:`url(${preImg+(i<type.haveNumber?m.cover:m.noGetCover)})`}" v-text="m.levelName" :key="i" @click="detail(m,i<type.haveNumber)"></div>
                    </div>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            medals: {}
        };
    },
    created() {
        this.queryMyMedalWithNoGet();
    },
    methods: {
        queryMyMedalWithNoGet() {
            this.$get("queryMyMedalWithNoGet").then(res => {
                this.medals = res;
            });
        },
        detail(m, flag) {
            this.$to({ name: "medalDetail", query: { name: m.levelName, has: flag, cover: flag ? m.cover : m.noGetCover, description: m.description } });
        }
    }
};
</script>

<style lang="less">
.medals {
    .medal-type {
        padding: 10px 0;
        .medal-title {
            padding: 20px 0;
            background: url("../../../assets/img/medal/title.png") no-repeat center;
            background-size: auto 26px;
            text-align: center;
            font-size: 13px;
            color: #333;
        }
        .medal-items {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            .medal-item {
                width: 100px;
                padding-top: 97px;
                background: no-repeat center 10px;
                background-size: auto 77px;
                text-align: center;
                font-size: 14px;
                color: #333;
            }
        }
    }
}
</style>
