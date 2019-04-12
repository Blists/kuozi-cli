<template>
    <div class="form-item" :class="{'hr-bottom':hrBottom,'no-flex':noFlex,more:more}">
        <div class="form-item-label" v-if="label" v-text="label"></div>
        <template v-if="type =='input'&&!noInput">
            <input v-if="inputType=='text'" :class="{'no-label':!label}" v-model="val" type="text" :placeholder="placeholder" @input="input" @focus="focusHandler" @blur="blurHandler" :disabled="disabled">
            <input v-if="inputType=='number'" :class="{'no-label':!label}" v-model.number="val" type="number" :placeholder="placeholder" @input="input" @focus="focusHandler" @blur="blurHandler" :disabled="disabled">
            <input v-if="inputType=='password'" :class="{'no-label':!label}" v-model="val" type="password" :placeholder="placeholder" @input="input" @focus="focusHandler" @blur="blurHandler" :disabled="disabled">
            <div v-if="inputType=='date'" class="input-date">
                <div :class="{placeholder:!val}" v-text="val||placeholder||'请选择'"></div>
                <input v-if="inputType=='date'" :class="{'no-label':!label}" v-model="val" type="date" @input="input" :disabled="disabled">
            </div>
            <div v-if="inputType=='select'" class="select">
                <span :class="{placeholder:!val}" v-text="val||placeholder||'请选择'"></span>
                <select :class="{'no-label':!label}" v-model="val" @change="input" :disabled="disabled">
                    <slot name="options"></slot>
                </select>
            </div>
            <div v-if="val&&focus" class="input-clear" @click="clear"></div>
            <slot name="right"></slot>
        </template>
        <div class="form-item-value" v-if="text">
            <span v-text="text"></span>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        value: {},
        text: {},
        type: { type: String, default: "input" },
        inputType: { type: String, default: "text" },
        label: {},
        placeholder: {},
        hrBottom: { type: Boolean, default: false },
        noInput: { type: Boolean, default: false },
        noFlex: { type: Boolean, default: false },
        more: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false }
    },
    data() {
        return {
            focus: false,
            val: ""
        };
    },
    created() {
        this.val = this.value;
    },
    methods: {
        focusHandler() {
            this.focus = true;
        },
        blurHandler() {
            setTimeout(() => {
                this.focus = false;
            }, 500);
        },
        input() {
            this.$emit("input", this.val);
        },
        clear() {
            this.val = "";
            this.input();
        }
    },
    watch: {
        value() {
            if (this.val != this.value) {
                this.val = this.value;
            }
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
.from-warp {
    padding: 0 10px;
    background: white;
}
.form-logo {
    background: white;
    padding: 200px 38px 0 38px;
    background: url("../assets/img/Page 1@2x.png") no-repeat center 100px;
    background-size: 59px auto;
    .form-item {
        margin-bottom: 20px;
    }
}
.form-item {
    display: flex;
    &.no-flex {
        display: block;
    }
    &.more {
        padding-right: 10px;
        background: url("../assets/img/Group Copy 6@2x.png") no-repeat right center;
        background-size: 6px auto;
    }
    .form-item-label {
        display: flex;
        align-items: center;
        padding: 13px 0;
        font-size: 16px;
        color: #333;
    }
    .form-item-value {
        flex: 1;
        text-align: right;
        > span {
            display: inline-block;
            max-width: 150px;
            line-height: 46px;
            font-size: 14px;
            color: #888;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    > input,
    .select,
    .input-date {
        flex: 1;
        height: 50px;
        padding-left: 15px;
        font-size: 16px;
        color: #333;
        border-radius: 0;
        min-width: 0;
        outline: none;
        &.no-label {
            padding-left: 0;
        }
        &::-webkit-input-placeholder {
            color: #999;
        }
    }
    .input-date {
        position: relative;
        background: url("../assets/img/Group@2x.png") no-repeat 100% center;
        background-size: 14px auto;
        margin-right: 5px;
        > div {
            height: 50px;
            line-height: 50px;
            &.placeholder {
                color: #999;
            }
        }
        > input {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
        }
    }
    .select {
        position: relative;
        padding: 13px 10px 13px 15px;
        background: url("../assets/img/Group@2x.png") no-repeat 100% center;
        background-size: 14px auto;
        margin-right: 5px;
        .placeholder {
            color: #999;
        }
        > select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    .input-clear {
        width: 20px;
        background: url("../assets/img/Oval 5@2x.png") no-repeat center;
        background-size: 14px;
    }
    .btn-code {
        padding: 0 20px 0 30px;
        background: linear-gradient(to right, @hr, @hr) 15px center no-repeat;
        background-size: 1px 25px;
        font-size: 16px;
        color: @info;
    }
    .form-item-text {
        flex: 1;
        padding: 15px 0;
        text-align: center;
        font-size: 16px;
        color: @info;
    }
    .more-btn {
        flex: 1;
        text-align: center;

        button {
            height: 50px;
            font-size: 14px;
            color: @info;
            padding-right: 12px;
            background: url("../assets/img/Group Copy3@2x.png") no-repeat right 18px;
            background-size: 7.5px auto;
        }
        &.split {
            position: relative;
            &:after {
                content: "";
                position: absolute;
                top: 12.5px;
                right: 0;
                width: 1px;
                height: 25px;
                background: @hr;
                background-size: 1px 50px;
            }
        }
    }
    .three-login {
        flex: 1;
        margin-top: 10px;
        .three-login-text {
            display: flex;
            font-size: 12px;
            color: #999999;
            &::before {
                content: "";
                display: block;
                flex: 1;
                margin-right: 10px;
                background: linear-gradient(to bottom, transparent, transparent, @hr, @hr) no-repeat 0 center;
                background-size: 100% 1px;
            }
            &::after {
                content: "";
                flex: 1;
                margin-left: 10px;
                background: linear-gradient(to bottom, transparent, transparent, @hr, @hr) no-repeat 0 center;
                background-size: 100% 1px;
            }
        }
        .three-login-btns {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            > button {
                margin: 0 10px;
            }
            .wx {
                width: 35px;
                height: 30px;
                background: url("../assets/img/wechat_s@2x.png") no-repeat center;
                background-size: 35px auto;
            }
        }
    }
}
.form-item-btn {
    width: 100%;
    height: 45px;
    background: linear-gradient(to right, #7ec5f4, #8f79ee) no-repeat;
    box-shadow: 0 1px 3px #7ec5f4;
    border-radius: 45px;
    font-size: 18px;
    color: white;
}
</style>
