<template>
    <ui-layout>
        <ui-head title="专栏"></ui-head>
        <ui-container name="columns" class="bg-gray">
            <div class="columns">
                <div class="column" v-for="column in columns" :key="column.id" @click="$to({name:'columnsDetail',query:{columnId:column.id}})">
                    <div class="column-left">
                        <ui-img :src="preImg+column.cover"></ui-img>
                    </div>
                    <div class="column-right">
                        <div class="column-info">
                            <div class="column-mc" v-text="column.name"></div>
                            <div class="column-gz">
                                <span v-text="column.focus||0"></span>人关注</div>
                        </div>
                        <div class="column-zw">
                            <span v-text="column.userName"></span>·
                            <span v-text="column.company"></span>
                            <span v-text="column.post"></span>
                        </div>
                        <div class="column-ms limit2" v-text="column.description"></div>
                    </div>
                </div>
            </div>
        </ui-container>
        <router-view></router-view>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    data() {
        return {
            preImg: preImg,
            columns: []
        };
    },
    created() {
        this.queryColumns();
    },
    methods: {
        queryColumns() {
            this.$post("queryColumns", {
                pageNo: 1,
                pageSize: this.PageSize
            }).then(res => {
                this.columns = res.results;
            });
        }
    }
};
</script>

<style lang="less">
</style>
