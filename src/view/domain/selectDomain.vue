<template>
    <select-domain :title="title" :store-key="store" :obj-key="key" :readonly="readonly"></select-domain>
</template>

<script>
import SelectDomain from "../../components/module/SelectDomain.vue";
export default {
    components: { SelectDomain },
    data() {
        return {
            title: this.$route.query.title,
            store: this.$route.query.store,
            key: this.$route.query.key,
            readonly: this.$route.query.readonly
        };
    }
};
</script>
