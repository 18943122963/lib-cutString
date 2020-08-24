"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutword = void 0;
exports.cutword = (str, config) => {
    (() => {
        isNot(config.cut_len) && (config.cut_len = 10);
        isNot(config.cut_poly) && (config.cut_poly = false);
        isNot(config.fill_flag) && (config.fill_flag = ".");
        isNot(config.fill_num) && (config.fill_num = 3);
        isNot(config.do_trim) && (config.do_trim = true);
    })();
    str = doAdjust(str);
    str = doCut(str, config);
    return str;
};
const isNot = (parm) => parm === null || parm === undefined;
const getStrLen = (str) => str.replace(/[^\x00-\xff]/g, "01").length;
const doAdjust = (str) => {
    let errArr = [null, undefined, ""];
    if (errArr.includes(str)) {
        console.log("裁剪的字符串为空！");
        return "";
    }
    if (typeof str !== "string") {
        str = String(str);
    }
    return str;
};
const doCut = (str, config) => {
    config.do_trim && (str = str.trim());
    let str_len = getStrLen(str);
    if (str_len <= config.cut_len)
        return str;
    else {
        let temp = "";
        let temp_len = 0;
        for (let item of str) {
            if (temp_len === config.cut_len - 1 &&
                getStrLen(item) === 2 &&
                !config.cut_poly)
                break;
            if (temp_len >= config.cut_len)
                break;
            else {
                temp += item;
                temp_len += getStrLen(item);
            }
        }
        return (temp += config.fill_flag.repeat(config.fill_num));
    }
};
