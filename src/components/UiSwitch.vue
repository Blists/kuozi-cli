<template>
    <div class="ui-switch" :class="{active:on==val,readonly:readonly}" @click="change"></div>
</template>

<script>
export default {
    props: {
        value: {
            type: [Boolean, Number, String],
            default: false
        },
        on: {
            type: [Boolean, Number, String],
            default: true
        },
        off: {
            type: [Boolean, Number, String],
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: this.value
        };
    },
    methods: {
        change() {
            if (this.readonly) return;
            this.val = this.val == this.on ? this.off : this.on;
            this.$emit("input", this.val);
            this.$nextTick(() => {
                this.$emit("change", this.val);
            });
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function() {
                this.val = this.value;
            }
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
.ui-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid #ccc;
    background: white;
    transition: background 0.3s;
    vertical-align: middle;
    &.active {
        background: @info;
        &.readonly {
            background: #bfddff;
        }
        &:before {
            left: 20px;
        }
    }
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 28px;
        height: 28px;
        border-radius: 30px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        transition: left 0.3s;
        background: white;
    }
}
</style>
