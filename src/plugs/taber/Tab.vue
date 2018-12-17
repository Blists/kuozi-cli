<template>
    <li :class="{'active': tabData.active, 'loading': tabData.loading}" @click="selectTab">{{title()}}<span v-if="!noClose" class="btn-close" @click.stop="close">&times;</span></li>
</template>
<script>
export default {
    props: { tabData: Object, noClose: { type: Boolean, default: false } },
    methods: {
        close () {
            this.$emit("close", this.tabData);
        },
        selectTab() {
            // this.$emit("click", this.tabData);
        },
        title() {
            if (this.tabData.title) {
                return this.tabData.title;
            }
            return this.tabData.meta.title;
        }
    }
};
</script>