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

function getNowFormatDate(lastYear) {
    let date = new Date();
    let year = lastYear ? date.getFullYear() - 1 : date.getFullYear();
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

function getNowFormatMonth() {
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
    let currentdate = year + '-' + month;
    return currentdate;
}

function getIntervalMonth(startDate, endDate) {
    var startMonth = startDate.getMonth();
    var endMonth = endDate.getMonth();
    var intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
    return intervalMonth;
}

function getIntervalDay(startDate, endDate) {
    let intervalDay = endDate.getTime() / 1000 - startDate.getTime() / 1000
    return parseInt(intervalDay / 60 / 60 / 24)
}

module.exports = {
    formatTime: formatTime,
    getNowFormatDate: getNowFormatDate,
    getIntervalMonth: getIntervalMonth,
    getIntervalDay: getIntervalDay,
    getNowFormatMonth: getNowFormatMonth
};