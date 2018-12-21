import { STRING } from "../utils/constants";
export default {
    methods: {
        forward(e, token) {
            if (e === false) {
                this.$router.replace({ name: "login" });
            } else {
                if (e) {
                    window.login = true;
                    if (token) {
                        localStorage.setItem(STRING.TOKEN, token);
                    }
                }
                let obj = { name: STRING.HOME };
                let path = sessionStorage.getItem("$path");
                sessionStorage.clear("$path");
                if (path && path != "/" && !/^\/index/.test(path) && !/^\/login/.test(path)) {
                    obj = { path };
                }
                if (this.$route.query.forwardReplace) {
                    this.$router.replace(obj);
                } else {
                    this.$router.push(obj);
                }
            }
        }
    }
};