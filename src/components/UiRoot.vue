<template>
    <div class="ui-root">
        <slot/>
    </div>
</template>

<script>
export default {
    mounted() {
        document.body.appendChild(this.$el);
    },
    beforeDestroy() {
        try {
            document.body.removeChild(this.$el);
        } catch (error) {
            console.warn(error);
        }
    }
};
</script>

<style>
</style>
