<template>
    <ui-layout>
        <ui-head :title="title">
            <div v-if="!readonly" @click="finish" class="btn-text" slot="right">完成</div>
        </ui-head>
        <ui-container class="domains">
            <div class="domain-col" v-for="domain in domains" :key="domain.id" v-if="domain.childList&&domain.childList.length>0">
                <div class="domain-col-type">
                    <ui-img :src="preImg+domain.remark"></ui-img>
                    <div class="ellipsis">{{domain.name}}</div>
                </div>
                <div class="domain-col-items">
                    <template v-if="readonly">
                        <div class="ellipsis" v-for="d in domain.childList" :key="d.id" v-text="d.name" @click="$to({name:'domainDetail',query:{id:d.id,photo:domain.remark,title:d.name}})"></div>
                    </template>
                    <template v-else>
                        <div class="ellipsis" :class="{active:d.active}" v-for="d in domain.childList" :key="d.id" v-text="d.name" @click="$set(d,'active',!d.active)"></div>
                    </template>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
export default {
    props: {
        title: {},
        storeKey: {},
        objKey: {},
        readonly: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
            preImg: preImg,
            domains: []
        };
    },
    created() {
        this.obj = this.Store.get(this.storeKey);
        this.queryDomainsAll();
    },
    methods: {
        queryDomainsAll() {
            this.$get("queryDomainsAll").then(res => {
                if (!this.readonly) {
                    for (let domain of res) {
                        for (let d of domain.childList) {
                            for (let s of this.obj[this.objKey]) {
                                if (d.id == s.id && d.name == s.name) {
                                    d.active = true;
                                }
                            }
                        }
                    }
                }
                this.domains = res;
            });
        },
        finish() {
            let domains = [];
            for (let domain of this.domains) {
                for (let d of domain.childList) {
                    if (d.active) {
                        domains.push(d);
                    }
                }
            }
            this.obj[this.objKey] = domains;
            this.Store.set(this.storeKey, this.obj);
            this.$back();
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.ui-container.domains {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    .domain-col {
        display: flex;
        flex-direction: column;
        min-width: 100px;
        padding: 10px 5px;
        overflow: hidden;
        .domain-col-type {
            height: 135px;
            text-align: center;
            font-size: 18px;
            line-height: 45px;
            color: #333;
            > img {
                display: block;
                width: 90px;
                height: 90px;
                border-radius: 4px;
            }
        }
        .domain-col-items {
            flex: 1;
            overflow: auto;
            > div {
                width: 75px;
                height: 33px;
                margin: 10px auto;
                line-height: 33px;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                color: #666;
                &.active {
                    background: @info;
                    color: white;
                    border: none;
                }
            }
        }
    }
}
</style>
