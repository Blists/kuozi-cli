<template>
    <ui-layout>
        <ui-head :title="title">
            <div class="btn-text" slot="right" @click="groupSave">完成</div>
        </ui-head>
        <ui-container>
            <div class="group-edit">
                <div class="group-img">
                    <img v-show="groupNew.photo" :src="preImg+groupNew.photo" />
                    <div class="group-img-btn">
                        <input type="file" accept="image/*" @change="change">
                    </div>
                    <div class="goup-name">
                        <input v-model="groupNew.name" type="text" placeholder="圈子名称">
                    </div>
                </div>
                <div class="group-domain">
                    <div class="group-domain-text">选择圈子所属领域</div>
                    <div class="group-domain-opt">
                        <div class="group-domains" v-if="groupNew.domains&&groupNew.domains.length>0">
                            <span v-for="domain in groupNew.domains" :key="domain" v-text="domain.name"></span>
                        </div>
                        <div class="group-domain-add" @click="groupAddDomain">+</div>
                    </div>
                </div>
                <div class="group-jj">
                    <textarea v-model="groupNew.description" rows="5" placeholder="圈子简介"></textarea>
                </div>
                <div class="group-ff">
                    <div class="group-ff-pd">
                        <div class="group-ff-text">加入圈子是否付费</div>
                        <div class="group-ff-btn">
                            <ui-switch v-model="groupNew.free"></ui-switch>
                        </div>
                    </div>
                    <div v-show="groupNew.free" class="group-ff-amount">
                        <span class="group-ff-dw">￥</span>
                        <input v-model="groupNew.money" type="number">
                        <span class="group-ff-yuan">元/年</span>
                    </div>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../config/project/project.env";
import UiSwitch from "../../components/UiSwitch.vue";
export default {
    components: { UiSwitch },
    data() {
        return {
            preImg: preImg,
            groupNew: {},
            title: ""
        };
    },
    created() {
        this.groupNew = this.Store.get("groupNew");
        if (!this.groupNew) {
            this.title = "创建圈子";
            this.initGroupNew();
        } else {
            this.title = this.groupNew.id ? "编辑圈子" : "创建圈子";
        }
    },
    methods: {
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.groupNew.photo = res;
            });
        },
        groupAddDomain() {
            this.Store.set("groupNew", this.groupNew);
            this.$to({ name: "groupAddDomain" });
        },
        initGroupNew() {
            this.groupNew = {
                name: "",
                photo: "",
                description: "",
                free: false,
                money: "",
                domains: []
            };
        },
        groupSave() {
            if (!this.groupNew.photo) return this.$toast("圈子图片不能为空");
            if (!this.groupNew.name) return this.$toast("圈子名称不能为空");
            if (this.groupNew.domains.length == 0) return this.$toast("圈子所属领域不能为空");
            if (!this.groupNew.description) return this.$toast("圈子简介不能为空");
            if (this.groupNew.free && (!this.groupNew.money || this.groupNew.money <= 0)) return this.$toast("付费圈子费用错误");
            let param = {
                photo: this.groupNew.photo,
                name: this.groupNew.name,
                description: this.groupNew.description,
                free: this.groupNew.free ? 0 : 1,
                money: this.groupNew.money,
                domainIds: this.groupNew.domains.map(v => v.id).join(",")
            };
            this.groupNew.id ? (param.id = this.groupNew.id) : null;
            this.$post("groupSave", param).then(res => {
                this.Store.remove("groupNew");
                this.$toast(this.groupNew.id ? "圈子资料修改成功" : "圈子创建申请已提交，申请通过后，服务号会自动提醒。");
                this.$back();
            });
        },
        beforeDestroy() {
            this.Store.remove("groupNew");
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.group-edit {
    padding: 0 10px;
    .group-img {
        width: 150px;
        height: 152px;
        margin: 28px auto;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #999;
        background: #ddd;
        > img {
            display: block;
            width: 150px;
            height: 150px;
        }
        .group-img-btn {
            position: absolute;
            width: 32px;
            height: 32px;
            right: 10px;
            top: 10px;
            background: url("../../assets/img/Group 2@2x 2.png") no-repeat center;
            background-size: auto 32px;
            overflow: hidden;
            > input {
                width: 32px;
                height: 32px;
                opacity: 0;
            }
        }
        .goup-name {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            height: 40px;
            background: #eee;
            > input {
                width: 100%;
                height: 40px;
                text-align: center;
                font-size: 16px;
                color: #333;
                &::-webkit-input-placeholder {
                    color: #999;
                }
            }
        }
    }
    .group-domain {
        .group-domain-text {
            font-size: 16px;
            color: #333;
        }
        .group-domain-opt {
            display: flex;
            padding: 15px 0;
            .group-domains {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                > span,
                .group-domain {
                    height: 32px;
                    padding: 0 10px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    line-height: 32px;
                    border-radius: 4px;
                    border: 1px solid @info;
                    color: @info;
                    font-size: 14px;
                    &.active {
                        background: @info;
                        color: white;
                    }
                }
            }
            .group-domain-add {
                width: 32px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                background: #efeeee;
                font-size: 20px;
                color: #999;
            }
        }
    }
    .group-jj {
        padding: 15px 0;
        > textarea {
            width: 100%;
            padding: 10px;
            resize: none;
            border: 1px solid #afafaf;
            border-radius: 4px;
            font-size: 14px;
            color: #333;
            &::-webkit-input-placeholder {
                color: #999;
            }
        }
    }
    .group-ff {
        .group-ff-pd {
            display: flex;
            padding: 15px 10px;
            background: #f2f3f6;
            border-radius: 6px;
            .group-ff-text {
                flex: 1;
                font-size: 16px;
                color: @info;
            }
        }
        .group-ff-amount {
            display: flex;
            margin: 15px 0;
            border: 1px solid #afafaf;
            padding: 15px 10px;
            border-radius: 6px;
            .group-ff-dw {
                font-size: 18px;
                color: #666;
            }
            > input {
                flex: 1;
                margin-left: 15px;
                padding-left: 15px;
                border-left: 1px solid #afafaf;
                border-radius: 0;
                font-size: 14px;
                color: #333;
            }
            .group-ff-dw {
                font-size: 16px;
                color: #666;
            }
        }
    }
}
</style>
