<template>
    <div v-if="none" class="ui-taber hr-top">
        <router-link v-for="tab in tabs" :key="tab.name" tag="div" :class="[tab.className,{'group-unread':tab.name=='group'&&groupUnRead}]" :to="{name:tab.name}">{{tab.text}}</router-link>
    </div>
</template>

<script>
export default {
    name: "ui-taber",
    data() {
        return {
            tabs: [
                {
                    name: "article",
                    className: "wz",
                    text: "文章"
                },
                {
                    name: "group",
                    className: "qz",
                    text: "圈子"
                },
                {
                    name: "class",
                    className: "kt",
                    text: "课堂"
                },
                {
                    name: "my",
                    className: "wd",
                    text: "我的"
                }
            ]
        };
    },
    computed: {
        groupUnRead() {
            let num = 0;
            let groupUnRead = this.$store.state.socket.groupUnRead;
            for (let key in groupUnRead) {
                num += groupUnRead[key].num;
            }
            return num;
        },
        none() {
            if (!!this.tabs.map(v => v.name).find(v => v == this.$route.name || "/home" == this.$route.path)) {
                return this.$store.state.showTaber;
            } else {
                return false;
            }
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
.ui-taber {
    display: flex;
    &.none {
        display: none;
    }
    > div {
        height: 50px;
        flex: 1;
        text-align: center;
        padding-top: 29px;
        background: no-repeat center 6px;
        background-size: auto 21px;
        font-size: 11px;
        &.group-unread {
            position: relative;
            &:after {
                content: "";
                position: absolute;
                top: 5px;
                left: 50%;
                margin-left: 15px;
                width: 6px;
                height: 6px;
                background: red;
                border-radius: 100%;
            }
        }
        &.router-link-exact-active {
            color: @info;
            &.wz {
                background-image: url("../assets/img/Group 2@2x.png");
            }
            &.qz {
                background-image: url("../assets/img/Group 21 Copy@2x.png");
            }
            &.kt {
                background-image: url("../assets/img/博士帽1@2x.png");
            }
            &.wd {
                background-image: url("../assets/img/Add Friend1@2x.png");
            }
        }
        &.wz {
            background-image: url("../assets/img/Group 2 Copy@2x.png");
        }
        &.qz {
            background-image: url("../assets/img/Group 21@2x.png");
        }
        &.kt {
            background-image: url("../assets/img/博士帽@2x.png");
        }
        &.wd {
            background-image: url("../assets/img/Add Friend@2x.png");
        }
    }
}
</style>
