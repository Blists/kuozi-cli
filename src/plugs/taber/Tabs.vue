<template>
    <div class="vue-tabs">
        <div class="tabs-list-wrapper">
            <div class="move-left" @click="moveLeft()"></div>
            <div ref="warpNode" class="tabs-list-warp">
                <ul ref="tabsNode" class="tabs-list">
                    <tab v-for="tab in tabs" :tab-data="tab" @close="close(tab)" @click.native="clickTab(tab)" :key="tab.name+(tab.key?tab.key:'')" :no-close="tabs.length==1"></tab>
                </ul>
            </div>
            <div class="move-right" @click="moveRight()"></div>
        </div>
        <div class="tabs-content-wrapper" ref="contentWrapEl">
        </div>
    </div>
</template>
<script>
import { isFunction, isString, isObject, store, consts } from "./utils";
import Tab from "./Tab.vue";
function tabIdGen(tabName, tabKey = "") {
    if (isObject(tabName)) {
        const { name, key = "" } = tabName;
        return `${name}/${key}`;
    }
    return `${tabName}/${tabKey}`;
}
const EVENT_ACTIVE_CHANGE = "vue-tabs-active-change";
const EVENT_CLOSE = "vue-tabs-close";
const cached = {};
export default {
    props: {
        step: {
            type: [String, Number],
            default: 200
        }
    },
    components: { Tab },
    data() {
        return {
            tabs: [],
            active: null,
            warpNode: null,
            tabsNode: null
        };
    },
    beforeCreate() {
        this.tabSize = 0;
        this.tabMap = {};
    },
    created() {
        this.$taber.vm = this;
    },
    mounted() {
        this.$taber.mounted();
        this.warpNode = this.$refs.warpNode;
        this.tabsNode = this.$refs.tabsNode;
        this.$emit(EVENT_ACTIVE_CHANGE);
    },
    methods: {
        moveLeft() {
            this.move(this.step / 1);
        },
        moveRight() {
            this.move(-this.step / 1);
        },
        move(e) {
            if (this.tabsNode.clientWidth >  this.warpNode.clientWidth) {
                let left = ((this.tabsNode.style.left.replace("px", "") || 0) / 1 + e);
                if (left > 0) {
                    left = 0;
                }
                if (-left > this.tabsNode.clientWidth - this.warpNode.clientWidth) {
                    left = this.warpNode.clientWidth - this.tabsNode.clientWidth;
                }
                this.tabsNode.style.left =  left + "px";
            }
        },
        appendContent(tab) {
            let Component = cached[tab.name];
            const _this = this;
            let promise;
            if (!Component) {
                if (isFunction(tab.meta.component)) {
                    const asyncFn = tab.meta.component;
                    this.$set(tab, "loading", true);
                    promise = new Promise(asyncFn).then(Component => {
                        return (cached[tab.name] = _this.getVue().extend(Component));
                    });
                } else {
                    promise = Promise.resolve(tab.meta.component).then(Component => {
                        return (cached[tab.name] = _this.getVue().extend(Component));
                    });
                }
            } else {
                promise = Promise.resolve(Component);
            }

            promise.then(Component => {
                newInstance(Component);
            });

            return promise;

            function newInstance(Component) {
                const $el = document.createElement("div");
                _this.$refs.contentWrapEl.appendChild($el);
                const instance = new Component({
                    el: $el,
                    __taber: _this.$taber,
                    parent: _this,
                    $tab: tab
                });

                tab.content = instance;
                instance.$el.classList.add("tabs-content", "none");
            }
        },
        clickTab(tab) {
            this.$emit("click", tab);
            if (tab && !tab.active) {
                this.select(tab);
            }

        },
        close(tab) {
            if (!tab) {
                return;
            }

            const hooks = [...this.$taber.beforeCloseHooks];
            if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
                hooks.push(tab.meta.beforeClose);
            }
            hooks.push(_close);
            let i = 0;
            const _this = this;
            function next(target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next);
                } else if (target === false) {
                    return;
                }
            }
            hooks[0].call(_this, tab, next);

            function _close() {
                tab.content.$destroy();
                tab.content.$el.remove();
                this.tabMap[tabIdGen(tab)] = null;
                const index = this.tabs.indexOf(tab);
                if (index === -1) {
                    return;
                }
                this.tabs.splice(index, 1);

                if (this.tabs.length > 0 && this.active === tab) {
                    if (index < this.tabs.length) {
                        this.select(this.tabs[index]);
                    } else {
                        this.select(this.tabs[this.tabs.length - 1]);
                    }
                } else if (this.tabs.length === 0) {
                    this.$emit(EVENT_ACTIVE_CHANGE, null, tab);
                    this._saveTabs();
                }
                this.$emit(EVENT_CLOSE, tab);
            }
        },
        closeAll() {
            for (let tab of Object.values(this.tabMap)) {
                this.close(tab);
            }
        },
        create(tab) {
            let hooks = [...this.$taber.beforeCreateHooks];
            if (tab.meta.beforeCreate && isFunction(tab.meta.beforeCreate)) {
                hooks.push(tab.meta.beforeCreate);
            }

            let i = 0;
            let _this = this;
            let next = function(target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next);
                } else if (target === false) {
                    return;
                } else {
                    if (isString(target) && target === tab.name) {
                        hooks[++i].call(_this, tab, next);
                    } else if (isObject(target) && target.name === tab.name) {
                        hooks[++i].call(_this, tab, next);
                    } else {
                        _this.$taber.open(target);
                    }
                }
            };
            hooks.push(() => {
                this.tabs.push(tab);
                const p = this.appendContent(tab).then(() => {
                    this.$set(tab, "loading", false);
                });
                tab.promise = p;
                if (tab.active !== false) {
                    this.select(tab);
                } else {
                    this._saveTabs();
                }
                const id = tabIdGen(tab.name, tab.key);
                this.tabMap[id] = tab;

                next = null;
                hooks = null;
            });

            hooks[0].call(this, tab, next);
        },
        findOpenTab(name, key) {
            const id = tabIdGen(name, key);
            return this.tabMap[id];
        },
        select(tab) {
            if (!tab) {
                return;
            }
            this.$set(tab, "active", true);
            this.$emit(EVENT_ACTIVE_CHANGE, tab, this.active);
            this.active = tab;
            this.tabs.forEach(ftab => {
                if (tabIdGen(ftab.name, ftab.key) !== tabIdGen(tab.name, tab.key)) {
                    this.$set(ftab, "active", false);
                    if (ftab.content && ftab.content.$el) {
                        // ftab.content.$el.classList.remove("active");
                        ftab.content.$el.classList.add("none");
                    }
                }
            });
            this._saveTabs();
            let promise = tab.promise;
            if (!promise) {
                promise = Promise.resolve();
            }
            promise.then(() => {
                if (tab.active && tab.content) {
                    // tab.content.$el.classList.add("active");
                    tab.content.$el.classList.remove("none");
                    tab.promise = null;
                }
            });
        },
        _saveTabs() {
            if (!this.$taber.persist) {
                return;
            }
            const toSave = this.tabs.map(v => {
                return {
                    name: v.name,
                    key: v.key,
                    title: v.title,
                    params: v.params || {},
                    active: v.active
                };
            });
            store.save(consts.STORE_KEY, toSave);
        }
    }
};
</script>
<style lang="less">
@import "../../style/variables.less";
.vue-tabs {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

.tabs-list-wrapper {
    display: flex;
    height: 70px;
    overflow: hidden;
    box-shadow: 0 2px 5px 4px #f2f6fc;
    z-index: 9;
    ._move{
        position: relative;
        z-index: 1;
        width: 40px;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 5px 4px #f2f6fc;
        &::before{
            position: absolute;
            top:50%;
            left: 50%;
            content: "";
            width: 12px;
            height: 12px;
            border: 2px #9b9b9b;
            border-style: solid solid none none;
            border-radius: 0 2px 0 0;
        }
    }
    .move-left{
        ._move;
        &::before{
            margin-top: -8px;
            margin-left: -2px;
            transform: rotate(-135deg);
        }
    }
    .move-right{
        ._move;
        &::before{
            margin-top: -8px;
            margin-left: -10px;
            transform: rotate(45deg);
        }
    }
    .tabs-list-warp{
        position: relative;
        flex: 1;
        overflow: hidden;
    }
}

@keyframes loading-rotate {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes loading-rotate {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}

.tabs-list {
    position: absolute;
    left: 0;
    display: flex;
    flex-wrap: nowrap;
    margin: 0px;
    padding: 10px 30px;
    list-style: none;
    transition: all .3s;
    > li {
        position: relative;
        min-width: 160px;
        text-align: center;
        padding: 11px 36px 11px 18px;
        margin-right: 20px;
        white-space: nowrap;
        font-size: 18px;
        color: #4a4a4a;
        transition: all .3s;
        &:first-child {
            &:after {
                content: none;
            }
        }
        &:last-child {
            margin-right: 0;
        }
        &:after {
            content: "";
            position: absolute;
            width: 2px;
            height: 40px;
            top: 50%;
            left: 0;
            margin-top: -20px;
            background: #cfd7e0;
            transition: all .3s;
        }
        &.loading:before {
            content: " ";
            box-sizing: border-box;
            display: inline-block;
            width: 14px;
            height: 14px;
            position: absolute;
            left: 0px;
            top: 10px;
            border-radius: 9px;
            border: 2px solid #1ab394;
            border-top-color: transparent;
            border-left-color: transparent;
            animation: loading-rotate 0.8s infinite linear;
            -webkit-animation: loading-rotate 0.8s infinite linear;
        }

        &.active {
            border-radius: 4px;
            box-shadow: 0px 4px 20px 0px rgba(206, 218, 243, 1);
            color: @info;
            margin-left: 20px;
            &:first-child {
                margin-left: 0;
            }
            &:after {
                left: -20px;
            }
            .btn-close {
                opacity: 1;
            }
        }

        &:hover {
            cursor: pointer;
            .btn-close {
                opacity: 1;
            }
        }

        .btn-close {
            position: absolute;
            display: inline-block;
            top: 50%;
            margin-top: -9px;
            right: 9px;
            line-height: 16px;
            width: 20px;
            height: 20px;
            border-radius: 18px;
            border: 1px solid transparent;
            font-size: 16px;
            color: #9b9b9b;
            transition: all 0.2s ease;
            text-align: center;

            &:hover {
                color: @info;
                border-color: @info;
                // transform: scale(1.5);
                cursor: pointer;
            }
        }
    }
}

.tabs-content-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
    .tabs-content {
        &.none{
            display: none;
        }
        &.active {
            display: block;
        }
    }
}
</style>