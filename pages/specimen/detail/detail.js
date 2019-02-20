"use strict";

import {
    $wuxSelect,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

Page({
    data: {
        boxId: '',
        boxInfo: {},
        // 是否感染
        infectTitle: '请选择是否感染',
        infectValue: '',
        infectIndex: -1,
        // 手术类型
        typeTitle: '请选择类型',
        typeValue: '',
        typeIndex: -1,
        // 存放者
        ownerTitle: '请选择存放者',
        ownerValue: '',
        ownerIndex: -1,
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

    // ================== 筛选 begin ================== //
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
                        infectIndex: index
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
                        typeIndex: index
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
                        ownerIndex: index
                    })
                }
            },
        })
    },
    // ================== 筛选 end ================== //

    onLoad: function(e) {
        this.setData({
            boxId: options.boxId
        })
        this.requestSampleList()
    },

    requestSampleList() {
        wx.showLoading({
            title: '请求数据中...',
        });
        let that = this;

        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSampleList',
                openid: app.globalData.openid,
                box_id: that.data.boxId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.GetSampleList:" + JSON.stringify(res))
                wx.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    var boxInfo = res.data.data.info;
                    if (boxInfo.ctime > 0) {
                        boxInfo.ctime = util.formatTime(boxInfo.ctime, 'Y-M-D')
                    }
                    if (boxInfo.utime > 0) {
                        boxInfo.utime = util.formatTime(boxInfo.utime, 'Y-M-D')
                    }

                    that.setData({
                        boxInfo: boxInfo
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading();
            }
        })
    }
});