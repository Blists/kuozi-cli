<template>
    <ui-layout>
        <ui-head :title="title">
            <div slot="right" class="btn-text" @click="addColumn">完成</div>
        </ui-head>
        <ui-container v-show="show" class="bg-gray">
            <div class="release-show">
                <div class="release-img">
                    <img v-show="columnNew.cover" :src="preImg+columnNew.cover" />
                    <div class="release-img-btn">
                        <input type="file" accept="image/*" @change="change">
                    </div>
                    <div class="release-name">
                        <input v-model="columnNew.name" type="text" placeholder="专栏名称">
                    </div>
                </div>
                <div class="release-jj">
                    <textarea v-model="columnNew.description" rows="10" placeholder="专栏简介"></textarea>
                </div>
            </div>
        </ui-container>
    </ui-layout>
</template>

<script>
import { preImg } from "../../../../config/project/project.env";
export default {
    data() {
        return {
            title: "",
            preImg: preImg,
            columnId: this.$route.query.columnId,
            columnNew: {
                name: "",
                cover: "",
                description: ""
            }
        };
    },
    created() {
        if (this.columnId) {
            this.title = "编辑专栏";
            this.getColumnDetail();
        } else {
            this.title = "新建专栏";
            this.show = true;
        }
    },
    methods: {
        getColumnDetail() {
            this.$get("columnDetail", this.columnId).then(res => {
                this.columnNew = {
                    id: res.id,
                    name: res.name,
                    cover: res.cover,
                    description: res.description
                };
                this.show = true;
            });
        },
        change($event) {
            let formData = new FormData();
            formData.append("file", $event.target.files[0]);
            this.$post("fileUploadFile", formData).then(res => {
                this.columnNew.cover = res;
            });
        },
        addColumn() {
            if (!this.columnNew.name) return this.$toast("请填写专栏名称");
            if (!this.columnNew.cover) return this.$toast("请选择专栏图片");
            if (!this.columnNew.description) return this.$toast("请填写专栏简介");
            this.$post("addColumn", this.columnNew).then(res => {
                this.$toast(this.columnId ? "编辑完成" : "新建专栏成功");
                this.$back();
            });
        }
    }
};
</script>

<style lang="less">
</style>
