'use strict';
let basePath = "https://pji.think-show.com/api/Public/PJI/";
let response_success = 0;

const ECCENTRICITY_OPTIONS = [
    { id: 0, label: '6600rpm*3min' },
    { id: 1, label: '1000g*5min' },
    { id: 2, label: '1000g*10min' },
    { id: 3, label: '未离心' },
    { id: 4, label: '4500rpm*10min' },
    { id: 5, label: '3000rpm*10min' },
];

// 常用项优先展示
const ECCENTRICITY_DISPLAY_ORDER = [5, 4, 0, 1, 2, 3];

function getEccentricitySortedOptions() {
    var optionsById = {};
    ECCENTRICITY_OPTIONS.forEach(function(item) {
        optionsById[item.id] = item;
    });
    return ECCENTRICITY_DISPLAY_ORDER.map(function(id) {
        return optionsById[id];
    });
}

function getEccentricitySortedLabels() {
    return getEccentricitySortedOptions().map(function(item) {
        return item.label;
    });
}

function getEccentricitySortedIds() {
    return getEccentricitySortedOptions().map(function(item) {
        return item.id;
    });
}

function getEccentricityLabel(id) {
    var item = ECCENTRICITY_OPTIONS.filter(function(option) {
        return option.id === parseInt(id, 10);
    })[0];
    return item ? item.label : '';
}

module.exports = {
    basePath: basePath,
    response_success: response_success,
    getEccentricitySortedLabels: getEccentricitySortedLabels,
    getEccentricitySortedIds: getEccentricitySortedIds,
    getEccentricityLabel: getEccentricityLabel
};