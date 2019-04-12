<template>
    <div class="ui-editor needsclick">
        <div></div>
        <div class="ui-editor-editor needsclick" ref="editor" @click="focus"></div>
    </div>
</template>

<script>
import { preImg } from "../../config/project/project.env";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);
export default {
    props: { value: {} },
    data() {
        return {
            // ismobile: /(Android|iPhone)/.test(navigator.userAgent),
            ismobile: false,
            editor: null
        };
    },
    created() {
        let unwatch = this.$watch("value", (v, o) => {
            if ((o === "" || o === null || o === undefined) && v) {
                unwatch();
                // 用户输入（长度为1的时候） 不执行initValue
                if (this.value.length > 8) {
                    this.initValue();
                }
            }
        });
    },
    mounted() {
        let maxRows = 10;
        let maxCols = 5;
        let tableOptions = [];
        for (let r = 1; r <= maxRows; r++) {
            for (let c = 1; c <= maxCols; c++) {
                tableOptions.push("newtable_" + r + "_" + c);
            }
        }
        let self = this;
        this.editor = new Quill(this.$refs.editor, {
            modules: {
                toolbar: {
                    container: [
                        [{ size: ["small", false, "large", "huge"] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        ["blockquote", "code-block"],
                        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        // [{ float: "center" }, { float: "full" }, { float: "left" }, { float: "right" }],
                        [{ direction: "rtl" }],
                        [{ align: [] }],
                        ["link", "image"],
                        ["clean"]
                    ],
                    handlers: {
                        image() {
                            var input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = () => {
                                let formData = new FormData();
                                formData.append("file", input.files[0]);
                                self.$post("fileUploadFile", formData).then(res => {
                                    self.editor.insertEmbed(self.editor.getSelection().index, "image", preImg + res);
                                });
                            };
                            input.click();
                        }
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: false
                },
                imageDrop: true,
                imageResize: {
                    displayStyles: {
                        backgroundColor: "black",
                        border: "none",
                        color: "white"
                    },
                    modules: ["Resize", "DisplaySize", "Toolbar"]
                }
            },
            placeholder: "请输入...",
            theme: this.ismobile ? "bubble" : "snow"
        });
        this.editor.on("text-change", () => {
            this.$emit("input", this.$refs.editor.children[0].innerHTML);
        });
        this.initValue();
    },
    methods: {
        initValue() {
            if (this.value && this.editor) {
                this.$refs.editor.children[0].innerHTML = this.value;
            }
        },
        focus() {
            this.editor.focus();
        }
    }
};
</script>

<style lang="less">
.ui-editor {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    z-index: 99;
    .ui-editor-editor {
        flex: 1;
        overflow: scroll;
    }
    .ui-editor-toolbar {
        padding: 5px;
        background: white;
    }
    .ql-toolbar.ql-snow {
        background: white;
        .ql-formats {
            margin-right: 0;
        }
    }
    .ql-bubble .ql-tooltip {
        z-index: 99;
    }
}
</style>
