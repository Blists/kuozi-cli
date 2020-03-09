<template>
    <div class="home">
        <UiHeader />
        <div class="home-container">
            <div class="home-side">
                <UiSide ref="side" />
            </div>
            <div class="home-tabs">
                <vue-tabs @vue-tabs-active-change="tabsActiveChange"/>
            </div>
        </div>
    </div>
</template>
<script>
import UiHeader from "./../components/UiHeader";
import UiSide from "./../components/UiSide";
export default {
    components: { UiHeader, UiSide },
    data() {
        return {};
    },
    created() {},
    methods: {
        tabsActiveChange(tab) {
            if (tab) {
                this.$refs.side.setActiveMenu(tab.name);
            }
        }
    }
};
</script>
<style lang="less">
.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    .home-container {
        flex: 1;
        display: flex;
        overflow: hidden;
        .home-side {
            background: #eeee;
        }
        .home-tabs {
            flex: 1;
        }
    }
}
</style>
