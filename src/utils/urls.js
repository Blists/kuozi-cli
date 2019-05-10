/**
 * Created by kuo zi on 2016/10/14.
 */
import { urls } from "yy-form-app";
const restUrl = {
    auth: {
        name: "token校验",
        url: "user/checkTokenValid",
        ignore: true
    },
};

export default Object.assign(restUrl, urls);
