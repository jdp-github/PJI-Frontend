"use strict";

import {
    $wuxSelect,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

Page({
    data: {
        specimenInfoVisible: false,
        infectTitle: '请选择是否感染',
        infectValue: '',
        typeTitle: '请选择类型',
        typeValue: '',
        ownerTitle: '请选择存放者',
        ownerValue: '',
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
    onClickInfect() {
        $wuxSelect('#selectInfect').open({
            value: this.data.infectValue,
            options: [
                "清空",
                '是',
                '否',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        infectValue: value,
                        infectTitle: options[index],
                    })
                }
            },
        })
    },
    onClickType() {
        $wuxSelect('#selectType').open({
            value: this.data.typeValue,
            options: [
                "清空",
                '置换术后',
                '占位器',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        typeValue: value,
                        typeTitle: options[index],
                    })
                }
            },
        })
    },
    onClickOwner() {
        $wuxSelect('#selectOwner').open({
            value: this.data.ownerValue,
            options: [
                "清空",
                '小王',
                '小雷',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        ownerValue: value,
                        ownerTitle: options[index],
                    })
                }
            },
        })
    },
});

