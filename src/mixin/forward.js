import { STRING } from "../utils/constants";
export default {
    methods: {
        forward(e, token) {
            if (e === false) {
                sessionStorage.setItem("$forwardReplace", true);
                this.$to({ name: "login" });
            } else {
                if (e) {
                    window.login = true;
                    if (token) {
                        localStorage.setItem(STRING.TOKEN, token);
                    }
                }
                let path = sessionStorage.getItem("$path");
                sessionStorage.removeItem("$path");
                let obj = path ? { path } : { name: STRING.HOME };
                let forwardReplace = sessionStorage.getItem("$forwardReplace");
                sessionStorage.removeItem("$forwardReplace");
                this.$to(obj, { replace: forwardReplace });
            }
        }
    }
};