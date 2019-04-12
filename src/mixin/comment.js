import UiLayer from "../components/UiLayer.vue";
import UiRoot from "../components/UiRoot.vue";
import UiSend from "../components/UiSend.vue";
export default {
    components: { UiLayer, UiRoot, UiSend },
    data() {
        return {
            paramPl: {},
            commentLayer: false,
            commentType: "",
            commentBusinessId: ""
        };
    },
    methods: {
        // 显示评论框
        showCommentLayer() {
            this.commentLayer = true;
        },
        // 隐藏评论框
        closeCommentLayer() {
            this.commentLayer = false;
        },
        // 重置评论
        resetParamPl() {
            this.paramPl = {
                placeholder: "写下你的评论",
                beCommentUser: "",
                content: "",
                type: this.commentType,
                businessId: this.commentBusinessId,
                parent: 0
            };
            this.closeCommentLayer();
        },
        // 修改评论参数
        activePl(parent, beCommentUser, commentUserName) {
            if (beCommentUser) {
                this.paramPl.beCommentUserName = commentUserName;
                this.paramPl.placeholder = `回复${commentUserName}:`;
                this.paramPl.parent = parent;
                this.paramPl.beCommentUser = beCommentUser;
            } else {
                this.resetParamPl();
            }
            this.showCommentLayer();
            this.$nextTick(() => {
                this.$refs.send.focus();
            });
        },
        // 提交评论
        saveComment() {
            return new Promise((resolve, reject) => {
                if (!this.paramPl.content) return this.$toast("评论不能为空");
                let paramPl = this.paramPl;
                delete paramPl.placeholder;
                delete paramPl.beCommentUserName;
                this.$post("saveComment", paramPl)
                    .then(res => {
                        this.$toast("评论成功");
                        this.resetParamPl();
                        this.queryComment ? this.queryComment() : null;
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            });
        }
    }
};
