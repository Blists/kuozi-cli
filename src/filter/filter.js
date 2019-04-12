import Vue from "vue";
Vue.filter("dateFmt", function(value, fmt) {
    var date = new Date(value);
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
});
Vue.filter("strDateFmt", function(value, fmt) {
    var pattern = /(\d{4})(\d{2})(\d{2})/;
    if (!value) {
        return value;
    }
    var formatedDate = (value + "").replace(pattern, "$1-$2-$3");
    var date = new Date(formatedDate);
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
});
Vue.filter("nullFmt", function(value, str) {
    if (value == null || value === "") {
        return "--";
    }
    if (value / 1 == 0 && str == "%") {
        return "0%";
    }
    return value + "" + str;
});

Vue.filter("numFmt", function(s) {
    var f = false;
    if (s / 1 < 0) {
        f = true;
        s = Math.abs(s);
    }
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = (s + "").replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s)) s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return (f ? "-" : "") + s.replace(/^\./, "0.").toString();
});

let strArr = ["", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿"];
/**
 * unit 单位
 * decimal 保留几位小数
 * trim 小数是否去末尾0
 */
Vue.filter("numFmtUnit", function(s, unit = 0, decimal = 0, trim) {
    if (s === null || s === undefined) return "--";
    let div = "1";
    for (let i = 0; i < unit; i++) {
        div += "0";
    }
    s = s / div;
    var f = false;
    if (s / 1 < 0) {
        f = true;
        s = Math.abs(s);
    }
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = (s + "").replace(/^(\d*)$/, "$1.");
    let o = "",
        regExp1 = "(\\d*\\.",
        regExp2 = ",(";
    let loop = decimal > 0 ? decimal : 1;
    for (let j = 0; j < loop; j++) {
        o += "0";
        regExp1 += "\\d";
        regExp2 += "\\d";
    }
    regExp1 = regExp1 + ")\\d*";
    regExp2 = regExp2 + ")$";
    s = (s + o).replace(new RegExp(regExp1), "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s)) s = s.replace(re, "$1,$2");
    s = s.replace(new RegExp(regExp2), v => {
        if (decimal <= 0) return "";
        if (trim) {
            let suffix = v.replace(",", "");
            while (/0$/.test(suffix)) suffix = suffix.replace(/0$/, "");
            if (suffix) return "." + suffix;
            else return "";
        }
        return v.replace(",", ".");
    });
    return (f ? "-" : "") + s.replace(/^\./, "0.").toString() + (unit ? strArr[unit] : "");
});

Vue.filter("numJia", val => {
    let num = Number(val);
    if (num <= 100) {
        return num;
    } else {
        return Math.floor(num / 100) * 100 + "+";
    }
});
