import { STRING } from "../utils/constants";
export default {
    methods: {
        forward(e, token) {
            if (e === false) {
                this.$to({ name: "login" }, { replace: true });
            } else {
                if (e) {
                    window.login = true;
                    if (token) {
                        localStorage.setItem(STRING.TOKEN, token);
                    }
                }
                let obj = { name: STRING.HOME };
                let path = sessionStorage.getItem("$path");
                sessionStorage.removeItem("$path");
                let forwardReplace = sessionStorage.getItem("$forwardReplace");
                sessionStorage.removeItem("$forwardReplace");
                if (path && path != "/" && !/^\/index/.test(path) && !/^\/login/.test(path)) {
                    obj = { path };
                }
                this.$to(obj, { replace: forwardReplace });
            }
        }
    }
};