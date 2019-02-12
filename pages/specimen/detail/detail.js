"use strict";

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

Page({
    data: {
        specimenInfoVisible: false,
    },
    showSpecimenInfo: function() {
        this.setData({
            specimenInfoVisible: true,
        });
    },
    closeSpecimenInfo() {
        this.setData({
            specimenInfoVisible: false,
        });
    },
    onClose(key) {
        this.setData({
            [key]: false,
        })
    },
    onCloseSpecimenInfo() {
        this.onClose('specimenInfoVisible')
    },
    onClosedSpecimenInfo() {
        console.log('onClosedSpecimenInfo')
    },
});

