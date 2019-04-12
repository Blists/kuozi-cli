<template>
    <ui-layout>
        <ui-head title="圈中成员"></ui-head>
        <ui-container class="bg-gray">
            <div>
                <div class="group-member-search">
                    <input v-model="keyword" type="text" placeholder="搜索成员" />
                </div>
                <!-- 圈主和管理员有的权限 -->
                <template v-if="type == ROLE.GROUP_LEADER.type||type == ROLE.GROUP_ADMIN.type">
                    <mt-cell title="加入请求" is-link @click.native="$to({name:'groupJoins',query:{groupId:groupId}})">
                        <img class="img-jr" slot="icon" src="../../assets/img/Oval 17@2x.png" />
                    </mt-cell>
                    <mt-cell title="邀请嘉宾" is-link @click.native="groupWxInvited({name:'groupWxInvited',query:{groupId,groupName,photo}})">
                        <img class="img-jr" slot="icon" src="../../assets/img/Group 2@2x 3.png" />
                    </mt-cell>
                </template>
            </div>
            <div>
                <div class="group-member-title" v-if="listGuestOrLeader&&listGuestOrLeader.length>0">圈主、嘉宾</div>
                <div class="group-members">
                    <div class="group-member" v-for="(m,i) in listGuestOrLeader" :key="m.user" @click="showDetail(m,'list1',i)">
                        <div class="group-member-img">
                            <ui-img :src="preImg+m.user"></ui-img>
                        </div>
                        <div class="group-member-name" v-text="m.nickName"></div>
                        <div v-if="m.type==ROLE.GUEST.type" class="group-member-role">嘉宾</div>
                        <div v-if="m.type==ROLE.GROUP_LEADER.type" class="group-member-role">圈主</div>
                        <div class="group-member-more"></div>
                    </div>
                </div>
                <div class="group-member-title" v-if="listCommonUsers&&listCommonUsers.length>0">圈友</div>
                <div class="group-members">
                    <div class="group-member" v-for="(m,i) in listCommonUsers" :key="m.user" @click="showDetail(m,'list2',i)">
                        <div class="group-member-img">
                            <ui-img :src="preImg+m.user"></ui-img>
                        </div>
                        <div class="group-member-name" v-text="m.nickName"></div>
                        <div class="group-member-more"></div>
                    </div>
                </div>
            </div>
        </ui-container>
        <ui-layer :show.sync="layer.layer1" postion="bottom">
            <div class="group-member-opt">
                <div class="group-member-info">
                    <div class="group-member-img">
                        <ui-img :src="preImg+show.user"></ui-img>
                    </div>
                    <div class="group-member-name" v-text="show.nickName">莫尼</div>
                    <div class="group-member-time">{{show.joinTime|dateFmt("yyyy-MM-dd")}}加入</div>
                </div>
                <div>
                    <template v-if="(type == ROLE.GROUP_LEADER.type||type == ROLE.GROUP_ADMIN.type)&&show.type!=ROLE.GROUP_LEADER.type">
                        <div v-if="show.type == ROLE.GUEST.type" class="cell-btn hr-top hr-bottom info" @click="removeGuest">取消嘉宾</div>
                        <div v-else class="cell-btn hr-top hr-bottom info" @click="addGuest">设置成嘉宾</div>
                        <div v-if="type == ROLE.GROUP_LEADER.type&&show.type == ROLE.GROUP_ADMIN.type" class="cell-btn hr-bottom info" @click="removeGuest">取消管理员</div>
                        <div v-if="type == ROLE.GROUP_LEADER.type&&show.type != ROLE.GROUP_ADMIN.type" class="cell-btn hr-bottom info" @click="addAdmin">设置成管理员</div>
                        <div class="cell-btn hr-bottom del" @click="delUser">移除该成员</div>
                        <div class="cell-btn info bold" @click="layer.layer1=false">取消</div>
                    </template>
                    <div v-else class="cell-btn hr-top info bold" @click="layer.layer1=false">取消</div>
                </div>
            </div>
        </ui-layer>
        <ui-layer :show.sync="layer.layer2" postion="bottom">
            <div class="share-btn">
                <button class="wx">微信好友</button>
            </div>
            <div class="layer-btns hr-top">
                <button class="layer-btn text-info" @click="layer.layer2=false">取消</button>
            </div>
        </ui-layer>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import UiLayer from "../../components/UiLayer.vue";
import { ROLE } from "../../utils/constants";
export default {
    components: { UiLayer },
    data() {
        return {
            preImg: preImg,
            ROLE: ROLE,
            groupId: this.$route.query.groupId,
            groupName: this.$route.query.groupName,
            photo: this.$route.query.photo,
            type: this.$route.query.type,
            layer: {
                layer1: false,
                layer2: false
            },
            keyword: "",
            list1: [],
            list2: [],
            activeShow: {
                key: "",
                index: 0
            },
            show: {}
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.getListGuestOrLeader();
            this.getListCommonUsers();
        },
        getListGuestOrLeader() {
            this.$get("listGuestOrLeader", this.groupId).then(res => {
                this.list1 = res;
            });
        },
        getListCommonUsers() {
            this.$post("listCommonUsersByPage", {
                groupId: this.groupId,
                pageNo: 1,
                pageSize: 3000
            }).then(res => {
                this.list2 = res.results;
            });
        },
        showDetail(e, key, index) {
            this.activeShow.key = key;
            this.activeShow.index = index;
            this.show = e;
            this.layer.layer1 = true;
        },
        // 设置管理员
        addAdmin() {
            this.$get("addAdmin", this.show.user + "/" + this.groupId).then(res => {
                this[this.activeShow.key][this.activeShow.index].type = ROLE.GROUP_ADMIN.type;
                this.init();
                this.layer.layer1 = false;
            });
        },
        // 设置嘉宾
        addGuest() {
            this.$get("addGuest", this.show.user + "/" + this.groupId).then(res => {
                this[this.activeShow.key][this.activeShow.index].type = ROLE.GUEST.type;
                this.init();
                this.layer.layer1 = false;
            });
        },
        // 取消管理员/嘉宾
        removeGuest() {
            this.$get("removeGuest", this.show.user + "/" + this.groupId).then(res => {
                this[this.activeShow.key][this.activeShow.index].type = ROLE.COMMON_MEMBER.type;
                this.init();
                this.layer.layer1 = false;
            });
        },
        // 移除成员
        delUser() {
            this.$get("delUser", this.show.user + "/" + this.groupId).then(res => {
                this[this.activeShow.key].splice(this.activeShow.index, 1);
            });
        },
        groupWxInvited(p) {
            // 公众号登录
            if (this.isWx && this.$getParam("code")) {
                this.$to(p);
            } else {
                // app
                this.layer.layer2 = true;
            }
        }
    },
    computed: {
        listGuestOrLeader() {
            return this.list1.filter(v => (this.keyword ? (v.nickName && v.nickName.match(this.keyword)) || v.user.match(this.keyword) : true));
        },
        listCommonUsers() {
            return this.list2.filter(v => (this.keyword ? (v.nickName && v.nickName.match(this.keyword)) || v.user.match(this.keyword) : true));
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.group-member-search {
    padding: 15px;
    background: white;
    > input {
        width: 100%;
        height: 32px;
        padding-left: 34px;
        border-radius: 28px;
        background: #f0f0f0 url("../../assets/img/Combined Shape@2x.png") no-repeat 10px center;
        background-size: 18px;
        font-size: 14px;
    }
}
.group-member-title {
    padding: 20px 10px 0 10px;
    font-size: 16px;
    color: #999;
    background: white;
}
.group-members {
    background: white;
    padding: 0 10px;
    .group-member {
        display: flex;
        padding: 10px 0;
        .group-member-img {
            margin-right: 10px;
            > img {
                display: block;
                width: 36px;
                height: 36px;
                border-radius: 36px;
            }
        }
        .group-member-name {
            flex: 1;
            font-size: 16px;
            color: #333;
            line-height: 36px;
        }
        .group-member-role {
            margin-right: 10px;
            font-size: 14px;
            color: #afafaf;
            line-height: 36px;
        }
        .group-member-more {
            width: 16px;
            background: url("../../assets/img/Group Copy 2@2x.png") no-repeat center;
            background-size: 16px auto;
        }
    }
}
.group-member-opt {
    background: white;
    border-radius: 4px 4px 0 0;
    .group-member-info {
        padding: 20px 0;
        text-align: center;
        .group-member-img {
            > img {
                display: block;
                margin: 0 auto;
                width: 53px;
                height: 53px;
                border-radius: 53px;
            }
        }
        .group-member-name {
            font-size: 16px;
            color: #333;
            line-height: 36px;
        }
        .group-member-time {
            font-size: 12px;
            color: #999;
        }
    }
    .cell-btn {
        height: 45px;
        line-height: 45px;
    }
}
.img-jr {
    width: 32px;
    height: 32px;
}
</style>
