import { wxReload } from "../utils/wx";
export default {
    methods: {
        BindWx() {
            return new Promise(async (resolve, reject) => {
                if (!this.isWx) {
                    this.$toast("仅支持微信公众号打开绑定微信");
                    reject();
                    return;
                }
                let bind = sessionStorage.getItem("$BindWx");
                if (!bind) {
                    sessionStorage.setItem("$BindWx", true);
                    wxReload({ path: this.$route.fullPath });
                    return;
                }
            });
        },
        DoBind() {
            return new Promise(async (resolve) => {
                let bind = sessionStorage.getItem("$BindWx");
                if (!bind) {
                    resolve();
                    return;
                }
                let code = this.$getParam("code");
                if (!code) {
                    this.$toast("仅支持微信公众号打开绑定微信");
                    resolve();
                    return;
                }
                try {
                    await this.$post("bindWX", { code });
                    resolve();
                } catch (error) {
                    this.$toast("微信绑定失败");
                    resolve();
                } finally {
                    sessionStorage.clear("$BindWx");
                }
            });
        }
    }
};
