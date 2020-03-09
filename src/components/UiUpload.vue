<template>
    <div class="ui-upload">
        <div v-for="(v,i) of values" :key="v" class="ui-upload-img">
            <img :src="preImg+v" />
            <div class="ui-upload-del">
                <i class="el-icon-zoom-in" @click="preView(v)" />
                <i class="el-icon-delete" @click="del(i)" />
            </div>
        </div>
        <div v-if="(multiple&&values.length<=limit)||values.length==0" v-loading="loading" class="ui-upload-input">
            <div class="ui-upload-icon">
                <i class="el-icon-plus" />
            </div>
            <input v-if="show" ref="input" type="file" accept="image/*" title @change="change" @dragleave.stop=";" @drop.stop="drop"/>
        </div>
        <el-dialog :visible.sync="preViewVisible" width="60%">
            <img v-if="preViewSrc" class="pre-img" :src="preImg+preViewSrc" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        // 是否多个上传
        multiple: { type: Boolean, default: false },
        // 个数限制
        limit: { type: Number, default: Infinity },
        // 大小限制
        maxSize: { type: Number, default: 10 },
        // urls里配置的文件上传的接口的key
        uploadKey: { type: [String, Array], default: "" },
        // 图片预览前缀
        preImg: { type: String, default: "" },
        // 上传接口 后台name参数
        uploadFileKey: { type: String, default: "file" }
    },
    data() {
        return {
            loading: false,
            values: "",
            preViewVisible: false,
            preViewSrc: "",
            show: true
        };
    },
    created() {
        this.init();
    },
    methods: {
        init(values) {
            if (values) {
                this.values = this.multiple ? values : [values];
            } else {
                this.values = [];
            }
        },
        async change($event) {
            let file = $event.target.files[0];
            if (file.size > this.maxSize * 1024 * 1024) {
                this.$emit("out-max-size", file, this.maxSize);
            } else {
                if (file && file.size > 0) {
                    if (this.uploadKey) {
                        let formData = new FormData();
                        formData.append(this.uploadFileKey, file);
                        this.loading = true;
                        try {
                            let res = await this.$post(this.uploadKey, formData);
                            this.values.push(res);
                            this.emit();
                        } finally {
                            this.loading = false;
                        }
                    } else {
                        alert("未配置uploadKey");
                    }
                }
            }
            this.reloadInput();
        },
        del(i) {
            this.$confirm("是否确认删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.values.splice(i, 1);
                    this.emit();
                })
                .catch(() => {});
        },
        preView(v) {
            this.preViewSrc = v;
            this.preViewVisible = true;
        },
        emit() {
            let value;
            if (this.multiple) {
                value = this.values;
            } else {
                if (this.values.length > 0) {
                    value = this.values[0];
                } else {
                    value = "";
                }
            }
            this.$emit("input", value);
        },
        mouseover($event) {
            $event.target.focus();
        },
        reloadInput() {
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        },
        drop() {}
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
            i {
                font-size: 20px;
                margin: 0 5px;
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
        &:hover {
            i {
                font-size: 20px;
            }
        }
    }
    i {
        font-size: 18px;
    }
    .pre-img {
        max-width: 100%;
    }
}
</style>
