import Vue from "vue";
import { dateFmt, numFmtUnit } from "@yy/yy-tools";

Vue.filter("dateFmt", function(value, fmt) {
    return dateFmt(value, fmt);
});

Vue.filter("strDateFmt", function(value, fmt) {
    var pattern = /(\d{4})(\d{2})(\d{2})/;
    if (!value) {
        return value;
    }
    var formatedDate = (value + "").replace(pattern, "$1-$2-$3");
    return dateFmt(formatedDate, fmt);
});

Vue.filter("numFmtUnit", function(s, unit, decimal = 0, trim) {
    return numFmtUnit(s, unit, decimal, trim);
});