import Vue from "vue";
import { dateFmt, numFmtUnit } from "@yy/yy-tools";

Vue.filter("dateFmt", function(value, fmt) {
    let fmtDate = "";
    try {
        fmtDate = dateFmt(value, fmt);
    } catch (error) {
        //
    }
    return fmtDate;
});

Vue.filter("strDateFmt", function(value, fmt) {
    var pattern = /(\d{4})(\d{2})(\d{2})/;
    if (!value) {
        return value;
    }
    var formatedDate = (value + "").replace(pattern, "$1-$2-$3");
    let fmtDate = "";
    try {
        fmtDate = dateFmt(formatedDate, fmt);
    } catch (error) {
        //
    }
    return fmtDate;
});

Vue.filter("numFmtUnit", function(s, unit, decimal = 0, trim) {
    return numFmtUnit(s, unit, decimal, trim);
});