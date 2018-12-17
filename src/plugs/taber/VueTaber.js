import { isString, isFunction, store, consts } from "./utils";
import install from "./install";

const allEvents = ["vue-tabs-close", "vue-tabs-active-change"];
export default class VueTaber {
    constructor(options) {
        const { tabs: ops_tabs, persist } = options;
        this._tabsMap = {};
        ops_tabs.forEach(tab => {
            this._tabsMap[tab.name] = tab;
        });

        this.beforeCreateHooks = [];
        this.beforeCloseHooks = [];

        this._events = {};
        this.persist = persist;
    }

    findTab(tab) {
        if (!tab) {
            return null;
        }
        let name;
        if (isString(tab)) {
            name = tab;
        } else {
            name = tab.name;
        }
        return this._tabsMap[name];
    }

    open(tab) {
        if (isString(tab)) {
            tab = { name: tab };
        }
        let meta = this.findTab(tab);
        if (!meta) {
            console.error(`The Tab [${tab.name}] is not defined!`);
            return;
        }
        tab.meta = meta;
        const findedTab = this.vm.findOpenTab(tab.name, tab.key);
        if (!findedTab) {
            this.vm.create(tab);
        } else {
            this.vm.select(findedTab);
        }
    }

    close(tab) {
        if (isString(tab)) {
            tab = { name: tab };
        }
        let meta = this.findTab(tab);
        if (!meta) {
            console.error(`The Tab [${tab.name}] is not defined!`);
            return;
        }
        tab.meta = meta;
        const findedTab = this.vm.findOpenTab(tab.name, tab.key);
        this.vm.close(findedTab);
    }

    closeAll() {
        this.vm.closeAll();
    }

    select(tab) {
        if (isString(tab)) {
            tab = { name: tab };
        }
        const findedTab = this.vm.findOpenTab(tab.name, tab.key);
        this.vm.select(findedTab);
    }

    viewTab() {
        let tabWarp = this.vm.warpNode;
        let tabParent = this.vm.tabsNode;
        if (tabWarp && tabParent) {
            this.vm.$nextTick(() => {
                let activeTab = tabParent.querySelector("li.active");
                if (activeTab && tabWarp.clientWidth < tabParent.clientWidth) {
                    let left = (tabParent.style.left.replace("px", "") || 0) / 1;
                    let paddingLeft = (window.getComputedStyle(tabParent).paddingLeft.replace("px", "") || 0) / 1;
                    if (activeTab.offsetLeft - paddingLeft + left < 0) {
                        tabParent.style.left = -(activeTab.offsetLeft - paddingLeft) + "px";
                    }
                    if (activeTab.offsetLeft - paddingLeft + left > tabWarp.clientWidth - activeTab.clientWidth) {
                        tabParent.style.left = tabWarp.clientWidth - activeTab.clientWidth - activeTab.offsetLeft - paddingLeft + "px";
                    }
                }
            });
        }
    }

    $on(event, call) {
        if (!event || !isFunction(call)) {
            console.error("$on error event:[" + event + "], call:" + call);
            return;
        }
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(call);
    }

    $off(event, call) {
        if (!event) {
            return;
        }
        const listeners = this._events[event] || [];
        if (call) {
            const index = listeners.indexOf(call);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        } else {
            this._events[event] = [];
        }
    }

    beforeCreateEach(fn) {
        if (!isFunction(fn)) {
            return;
        }
        this.beforeCreateHooks.push(fn);
    }

    beforeCloseEach(fn) {
        if (!isFunction(fn)) {
            return;
        }
        this.beforeCloseHooks.push(fn);
    }

    _restoreTabs() {
        let nocacheTab = this.vm.$route.params.nocacheTab;
        if (!this.persist) {
            return;
        }
        if (nocacheTab) {
            store.save(consts.STORE_KEY, []);
            return;
        }
        const storeTabs = store.get(consts.STORE_KEY);
        if (!storeTabs) {
            return;
        }
        storeTabs.forEach(tab => {
            this.open(tab);
        });
    }

    mounted() {
        this._restoreTabs();
    }

    set vm(vm) {
        this._vm = vm;
        const _this = this;
        allEvents.forEach((event, index) => {
            vm.$on(event, (...args) => {
                const listeners = this._events[event] || [];
                listeners.forEach(listener => {
                    listener.apply(_this, args);
                });
                if (index == 1) {
                    this.viewTab();
                }
            });
        });
    }

    get vm() {
        return this._vm;
    }
}

VueTaber.install = install;

if (window.Vue) {
    window.Vue.use(VueTaber);
}
