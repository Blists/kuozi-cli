<template>
    <div class="ui-page">
        <el-pagination :layout="layout" :current-page="currentPage" :page-size="pageSize" :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
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
        pageNo: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            default: 0
        },
    },
    data() {
        return { currentPage: 0 };
    },
    methods: {
        resetCurrentPage(currentPage = 1) {
            this.currentPage = currentPage;
        },
        handleSizeChange(val) {
            this.$emit("size-change", val);
        },
        handleCurrentChange(val) {
            this.$emit("update:page-no", val);
            this.$emit("current-change", val);
        }
    },
    watch: {
        pageNo() {
            if (this.pageNo !== this.currentPage) {
                this.currentPage = this.pageNo;
            }
        }
    }
};
</script>

<style>
.ui-page {
    text-align: center;
    padding: 20px 0;
}
</style>
