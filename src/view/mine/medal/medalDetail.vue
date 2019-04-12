<template>
    <ui-layout>
        <ui-head no-bottom></ui-head>
        <ui-container>
            <div class="medals-detail">
                <div v-if="has" class="medals-detail-title">恭喜获得{{name}}勋章</div>
                <div v-else class="medals-detail-title">革命尚未成功，仍需努力</div>
                <div class="medals-detail-img">
                    <img :src="preImg+cover">
                </div>
                <div class="medals-detail-info" v-if="!has">
                    <div class="medals-detail-name" v-text="name"></div>
                    <div class="medals-detail-desc" v-text="description"></div>
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
            name: this.$route.query.name,
            has: this.$route.query.has === true || this.$route.query.has === "true",
            cover: this.$route.query.cover,
            description: this.$route.query.description
        };
    },
    methods: {}
};
</script>

<style lang="less">
.medals-detail {
    padding-top: 80px;
    text-align: center;
    .medals-detail-title {
        font-size: 18px;
        color: #333;
    }
    .medals-detail-img {
        padding: 80px 0;
        > img {
            width: 100px;
        }
    }
    .medals-detail-info {
        .medals-detail-name {
            font-size: 21px;
            color: #333;
            font-weight: bold;
        }
        .medals-detail-desc {
            margin-top: 5px;
            font-size: 14px;
            color: #666;
        }
    }
}
</style>
