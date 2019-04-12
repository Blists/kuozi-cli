<template>
    <ui-layout>
        <ui-head title="提问"></ui-head>
        <ui-container class="bg-gray">
            <div class="question-users">
                <div class="question-user" v-for="user in users" :key="user.id">
                    <div class="question-users-info">
                        <div class="question-user-img">
                            <ui-img :src="preImg+user.mobilephone"></ui-img>
                        </div>
                        <div class="question-user-name" v-text="user.nickName"></div>
                        <template v-for="role in ROLE">
                            <div v-if="user.userType==role.type" class="question-user-role" :key="role.type" v-text="role.text"></div>
                        </template>
                    </div>
                    <div class="question-user-zw">
                        <span v-text="user.company"></span>·
                        <span v-text="user.post"></span>
                    </div>
                    <div class="question-user-btns hr-top hr-bottom">
                        <button class="text-info" @click="$to({name:'askQuestion',query:{groupId:groupId,user:user.mobilephone,money:user.money,name:user.nickName}})">发起提问
                            <span v-if="user.money">(￥
                                <span v-text="user.money"></span>）</span>
                        </button>
                        <button v-if="user.count>0" @click="$to({name:'groupAnswerList',query:{phone:user.mobilephone,groupId:groupId,count:user.count}})">TA的回答 ({{user.count}})</button>
                        <button v-else class="disable">TA的回答 (0)</button>
                    </div>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import { ROLE } from "../../utils/constants";
export default {
    data() {
        return {
            preImg: preImg,
            ROLE: ROLE,
            groupId: this.$route.query.groupId,
            users: []
        };
    },
    created() {
        this.listTopicUsers();
    },
    methods: {
        listTopicUsers() {
            this.$get("listTopicUsers", this.groupId).then(res => {
                this.users = res;
            });
        }
    }
};
</script>

<style lang="less">
.question-users {
    .question-user {
        background: white;
        margin-bottom: 10px;
        .question-users-info {
            display: flex;
            padding: 20px 20px 5px 20px;
            .question-user-img {
                > img {
                    display: block;
                    width: 39px;
                    height: 39px;
                    border-radius: 100%;
                }
            }
            .question-user-name {
                flex: 1;
                margin-left: 10px;
                font-size: 16px;
                color: #333;
                line-height: 40px;
            }
            .question-user-role {
                font-size: 14px;
                color: #666;
                line-height: 40px;
            }
        }
        .question-user-zw {
            padding: 5px 20px 20px 20px;
            font-size: 16px;
            color: #9b9b9b;
        }
        .question-user-btns {
            display: flex;
            > button {
                flex: 1;
                height: 50px;
                font-size: 16px;
                color: #333;
                border-right: 1px solid #bfbfbf;
                &:last-child {
                    border-right: none;
                }
                &.disable {
                    color: #999;
                }
            }
        }
    }
}
</style>
