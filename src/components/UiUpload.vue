<template>
    <div class="ui-upload">
        <div v-for="(v,i) of values" :key="v" class="ui-upload-img">
            <img :src="imgUrl+v">
            <div class="ui-upload-del" @click="del(i)"></div>
        </div>
        <div class="ui-upload-input" v-if="multiple||values.length==0">
            <div class="ui-upload-icon"></div>
            <input v-if="show" type="file" accept="image/*" @change="change">
        </div>
    </div>
</template>

<script>
import conf from "../../config/project/project.env";
export default {
    props: {
        value: { default: "" },
        multiple: { type: Boolean, default: false },
        /**
         * urls里配置的文件上传的接口的key
         */
        uploadKey: { type: [String, Array], default: "" },
        /**
         * project.env里配置的图片查看前缀的key
         */
        previewKey: { type: [String, Array], default: "" }
    },
    data() {
        return { imgUrl: conf[this.previewKey], show: true };
    },
    methods: {
        async change($event) {
            let file = $event.target.files[0];
            if (file && file.size > 0) {
                let formData = new FormData();
                formData.append("files", file);
                let res = await this.$post(this.uploadKey, formData);
                let values = this.values;
                values.push(res);
                this.$emit("input", values.join(","));
                this.show = false;
                this.$nextTick(()=>{
                    this.show = true;
                });
            }
        },
        del(i) {
            let values = this.values.splice(i, 1);
            this.$emit("input", values.join(","));
        },
        mouseover($event) {
            $event.target.focus();
        }
    },
    computed: {
        values() {
            if (this.value) {
                return this.value.split(",");
            }
            return [];
        }
    }
};
</script>

<style lang="less">
.ui-upload {
    display: flex;
    flex-wrap: wrap;
    .ui-upload-img {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-right: 10px;
        overflow: hidden;
        > img {
            display: block;
            max-width: 80%;
            max-height: 80%;
        }
        .ui-upload-del {
            position: absolute;
            width: 100px;
            height: 100px;
            line-height: 100px;
            vertical-align: top;
            text-align: center;
            cursor: pointer;
            transition: all 0.5s;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            &::before {
                content: "\E612";
                font-family: element-icons !important;
                font-size: 24px;
                color: white;
            }
        }
        &:hover {
            .ui-upload-del {
                opacity: 1;
            }
        }
    }
    .ui-upload-input {
        position: relative;
        width: 100px;
        height: 100px;
        .ui-upload-icon {
            width: 100%;
            height: 100%;
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 4px;
            line-height: 100px;
            vertical-align: top;
            text-align: center;
            cursor: pointer;
            &::after {
                content: "\E62B";
                font-family: element-icons !important;
                font-size: 24px;
                color: #8c939d;
            }
        }
        > input {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 1;
            cursor: pointer;
        }
    }
}
</style>
