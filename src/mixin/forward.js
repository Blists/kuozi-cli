import store from "store";
export default {
    methods: {
        forward(e, token, flag) {
            if (e === false) {
                sessionStorage.setItem("$path", this.$route.fullPath);
                this.$router.replace({ name: "login" });
            } else {
                if (e) {
                    window.login = true;
                    if (token) {
                        store.set("$token", token);
                    }
                    this.$get("getWxInfo", null, null, true, true);
                    this.$post("memberDetail", { loginName: null }).then(r => {
                        r.name = r.nickName;
                        r.mobile = r.loginName;
                        store.set("$user", r);
                    });
                    // 初始化我的圈子和新动态
                    this.$get("queryGroupMessage").then(res => {
                        this.$store.commit("initGroup", res);
                    });
                }
                if (flag) {
                    this.$to({ name: "registerStep3" });
                } else {
                    let path = sessionStorage.getItem("$path") || false;
                    sessionStorage.removeItem("$path");
                    if (path && path != "/" && !/^\/index/.test(path) && !/^\/login/.test(path)) {
                        // if (token) {
                        //     this.$router.push({
                        //         path: path
                        //     });
                        // } else {
                        this.$router.replace({ path: path });
                        // }
                    } else {
                        this.$router.replace({ name: "home" });
                    }

                }
            }
        }
    }
};
