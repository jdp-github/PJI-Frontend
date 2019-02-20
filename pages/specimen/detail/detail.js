"use strict";

import {
    $wuxSelect,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

// 空闲
const SPECIMEN_TYPE_FREE = 0
// 存放
const SPECIMEN_TYPE_PUT = 1
// 取出
const SPECIMEN_TYPE_GET = 2
// 无权限
const SPECIMEN_TYPE_NO_RIGHT = 3

Page({
    data: {
        boxId: '',
        boxInfo: {},
        specimenGrid: [],
        letterArr: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", ],
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
        // 弹出框
        specimenInfoVisible: false,
        specimenSaveVisible: false,
    },

    // 查看标本信息
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
    onCloseSpecimenInfo() {
        this.closeSpecimenInfo('specimenInfoVisible')
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
                "不能确定",
                '非感染',
                '感染',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        infectValue: value,
                        infectTitle: options[index],
                        infectIndex: index
                    })
                    this.requestSampleList(this.data.typeIndex, 0)
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
                    this.requestSampleList(0, this.data.typeIndex)
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

    onLoad: function(options) {
        this.setData({
            boxId: options.boxId
        })
        this.requestSampleList()
    },

    requestSampleList(msis, type) {
        wx.showLoading({
            title: '请求数据中...',
        });
        let that = this;

        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSampleList',
                openid: app.globalData.openid,
                box_id: that.data.boxId,
                msis: msis,
                type: type
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log("Sample.GetSampleList:" + JSON.stringify(res))
                wx.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    var boxInfo = res.data.data.info;

                    if (boxInfo.utime > 0) {
                        boxInfo.showTime = util.formatTime(boxInfo.utime, 'Y-M-D')
                    } else if (boxInfo.ctime > 0) {
                        boxInfo.showTime = util.formatTime(boxInfo.ctime, 'Y-M-D')
                    }

                    var specimenGrid = that.makeSpecimenGrid(res.data.data.list)
                    that.setData({
                        boxInfo: boxInfo,
                        specimenGrid: specimenGrid
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
    },

    makeSpecimenGrid(specimenList) {
        var specimenGrid = []
        var row = []
        for (var i = 0, column = 0, length = specimenList.length; i < length; i++) {
            var specimen = specimenList[i]
            specimen.index = (i % 10) + 1
            row[i % 10] = specimen

            if ((i + 1) % 10 == 0) {
                var specimen = {
                    index: 0,
                    text: this.data.letterArr[column]
                }
                row.unshift(specimen)
                specimenGrid[column] = row
                column++
                row = []
            }
        }

        console.log(specimenGrid)
        return specimenGrid
    },

    onItemClick(e) {
        var specimen = e.target.dataset.selecteditem
        if (specimen.color_type == SPECIMEN_TYPE_FREE) { // 空闲
            wx.navigateTo({
                url: '../save/save?boxId=' + e.currentTarget.dataset.selecteditem.id
            })
        } else if (specimen.color_type == SPECIMEN_TYPE_PUT || specimen.color_type == SPECIMEN_TYPE_GET) { // 已存放 or 已取出
            this.showSpecimenInfo()
        } else if (specimen.color_type == SPECIMEN_TYPE_NO_RIGHT) { // 无权限
            wx.showToast({
                icon: "none",
                title: '您无权限查看',
            })
        }
    }
});