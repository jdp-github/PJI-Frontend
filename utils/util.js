'use strict';

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function formatTime(number, format) {
    let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    let returnArr = [];

    let date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (let i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

function getNowFormatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    let currentdate = year + '-' + month + '-' + strDate;
    return currentdate;
}

module.exports = {
    formatTime: formatTime,
    getNowFormatDate: getNowFormatDate
};