<template>
    <div class="ui-page">
        <el-pagination :layout="layout" :page-size="pageSize" :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
</template>

<script>
import { CONST } from "../utils/constants";
export default {
    props: {
        layout: {
            type: String,
            default: "total, prev, pager, next, jumper"
        },
        pageSize: {
            type: Number,
            default: CONST.PAGESIZE,
        },
        total: {
            type: Number,
            default: 0
        }
    },
    methods: {
        handleSizeChange(val) {
            this.$emit("size-change", val);
        },
        handleCurrentChange(val) {
            this.$emit("current-change", val);
        }
    }
};
</script>

<style>
.ui-page {
    text-align: center;
    padding: 20px 150px 20px 0;
}
</style>
