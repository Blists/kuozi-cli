<template>
    <ui-layout class="index" @click.native="clearStorage" no-home>
        <template v-if="timeoutLink">
            <div class="timeout-link">
                <span>邀请链接已失效，请联系邀请人重新发送新的邀请链接</span>
            </div>
            <div style="margin:40px 50px; 0 50px">
                <button class="btn1" @click="close">返回</button>
            </div>
        </template>
    </ui-layout>
</template>
<script>
import UiRoot from "../components/UiRoot.vue";
import store from "store";
import { wxConfig, closeWindow } from "../utils/wx";
import forward from "./../mixin/forward.js";
import { STRING } from "../utils/constants";
export default {
    mixins: [forward],
    components: { UiRoot },
    data() {
        return {
            times: 0,
            timeoutLink: false,
            fromPB: false,
            totalTime: 3,
            time: 0,
            fail: {
                auth: false,
                login: false
            },
            canvas: null,
            radius: 25
        };
    },
    created() {
        // 开始登录校验
        window.intercept = true;
        this.time = this.totalTime;
    },
    mounted() {
        if (window.pbESYS && window.history.length <= 2) {
            this.fromPB = true;
            this.$nextTick(() => {
                this.dTime();
            });
        } else {
            this.inviter();
        }
    },
    methods: {
        dTime() {
            let time = 0;
            let s = 50;
            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext("2d");
            let interval = setInterval(() => {
                this.drawDTime(
                    this.ctx,
                    this.canvas.width,
                    this.canvas.height,
                    this.radius,
                    STRING.INFO,
                    time / 1000,
                    this.totalTime
                );
                this.time = Math.ceil(this.totalTime - time / 1000);
                time += s;
                if (time > this.totalTime * 1000) {
                    clearInterval(interval);
                    this.fromPB = false;
                    this.inviter();
                }
            }, s);
        },
        drawDTime(ctx, width, height, radius, color, time, totalTime) {
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.arc(
                width / 2,
                height / 2,
                radius,
                -Math.PI / 2,
                ((2 * time) / totalTime - 1 / 2) * Math.PI
            );
            ctx.lineWidth = radius * 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        },
        close() {
            if (this.isWx) {
                closeWindow();
            } else {
                this.$close();
            }
        },
        clearStorage() {
            this.times++;
            if (this.times >= 5) {
                this.times = 0;
                store.clearAll();
                this.$toast("清除成功");
            }
        },
        inviter() {
            // 如果链接带邀请码  先检验分享码是否有效
            let inviter = this.$getParam("inviter");
            if (inviter) {
                this.$post("checkInviterLink", { inviter })
                    .then(() => {
                        this.auth();
                    })
                    .catch(({ res }) => {
                        if (res && res.code == 400406) {
                            this.timeoutLink = true;
                        }
                    });
            } else {
                this.auth();
            }
        },
        async auth() {
            if (this.isWx) {
                try {
                    await this.getWxconfig();
                } catch (err) {
                    console.error(err);
                }
            }
            let code = this.$getParam("code");
            this.$post("auth", { code }).then(res => {
                // 验证token是否有效
                if (res) {
                    this.forward(res);
                } else {
                    // 判断是否是从公众号进入系统
                    if (this.isWx && code) {
                        this.wxAuth(code);
                    } else {
                        this.forward();
                    }
                }
            });
        },
        wxAuth(code) {
            this.$post("wxAuth", { code: code }).then(res => {
                if (res.mobile) {
                    this.forward(res, res.extInfo["x-token"]);
                } else {
                    let action = this.$getParam("action");
                    if (action == STRING.WXLOGIN) {
                        this.$to({
                            name: "registerBind",
                            query: { openid: res.extInfo.OPEN_ID }
                        });
                    } else {
                        this.forward();
                    }
                }
            });
        },
        getWxconfig() {
            return new Promise((reslove, reject)=>{
                try {
                    this.$post(
                        "getWxconfig",
                        { url: window.location.href.split("#")[0] },
                        null,
                        null,
                        true,
                        true
                    ).then(res => {
                        wxConfig(res);
                        reslove();
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
};
</script>
<style lang="less">
@import "./../style/variables.less";
.index {
    // background: @gray url(./../assets/img/logo.png) no-repeat center 150px;
    .index-fail {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 500px;
        a {
            color: @info;
            text-decoration: underline;
        }
    }
}
.timeout-link {
    margin: 60px;
    padding-top: 200px;
    background: url("../assets/img/1@2x.png") no-repeat center;
    background-size: 158px auto;
    text-align: center;
    font-size: 16px;
    color: #999;
}

.pb-jump {
    padding: 15px;
    color: #333;
    text-align: justify;
    .pb-jump-title {
        font-size: 18px;
        text-align: center;
        font-weight: bold;
    }
    .pb-jump-content {
        padding: 10px 0 10px 0;
    }
    .pb-jump-time {
        padding-bottom: 10px;
        text-align: center;
        font-size: 14px;
        color: #414141;
        .pb-jump-dtime {
            position: relative;
            > canvas {
                display: block;
                margin: 0 auto 15px auto;
                border-radius: 100%;
                border: 1px solid #333;
                overflow: hidden;
            }
            > div {
                position: absolute;
                width: 50px;
                height: 50px;
                top: 0;
                left: 50%;
                margin-left: -25px;
                text-align: center;
                color: #333;
                font-size: 24px;
                line-height: 50px;
            }
        }
        > span {
            font-size: 20px;
            color: @info;
            margin-right: 3px;
        }
    }
}
</style>
