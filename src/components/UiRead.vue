<template>
    <span>
        <span v-text="text" @click.stop="layer=true"></span>
        <ui-root>
            <ui-layer :show.sync="layer">
                <div class="layer-content">
                    <div class="register-read-text html" v-html="content"></div>
                </div>
            </ui-layer>
        </ui-root>
    </span>
</template>

<script>
import UiRoot from "./UiRoot.vue";
import UiLayer from "./UiLayer.vue";
export default {
    props: {
        text: { type: String, default: "" },
        id: { type: Number, default: -1 },
    },
    components: { UiRoot, UiLayer },
    data() {return { layer: false, content: "" };},
    async created() {
        if (this.id == -1) return console.error("ui-read参数有误");
        let res  = await this.$get("getPubContent", this.id);
        this.content = res.content;
    }
};
</script>

<style lang="less">
.register-read-text {
    padding: 0 10px;
    font-size: 14px;
    color: #333;
    text-align: justify;
}
</style>
