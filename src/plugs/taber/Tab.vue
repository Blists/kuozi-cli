<template>
<li :class="{'active': tabData.active, 'loading': tabData.loading}">{{title()}}<span class="btn-close" @click.stop="close">&times;</span></li>
</template>
<script>
export default {
    props: {
        tabData: Object
    },
    methods: {
        close () {
            this.$emit('close', this.tabData)
        },
        title(){
            if(this.tabData.title){
                return this.tabData.title;
            }
            return this.tabData.meta.title
        }
    }
}
</script>