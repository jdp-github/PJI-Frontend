"use strict";

import {
    $wuxSelect,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

Page({
    data: {
        centerId: '',
        boxInfo: '',
        specimenInfo: '',
        caseList: [],
        searchValue: '',
        selectedCaseInfo: {},
        remark: ''
    },

    // ====================== begin ====================== //
    onChange(e) {
        this.setData({
            searchValue: e.detail.value,
        })
        this.requestCaseList(this.data.searchValue)
    },
    onClear(e) {
        this.setData({
            searchValue: '',
        })
    },
    onCancel(e) {
        this.onClear()
    },
    // ====================== end ====================== //

    onLoad: function(options) {
        var boxInfo = JSON.parse(options.boxInfo)
        var specimenInfo = JSON.parse(options.specimenInfo)
        this.setData({
            centerId: options.centerId,
            boxInfo: boxInfo,
            specimenInfo: specimenInfo
        })
        this.requestCaseList(this.data.searchValue)
    },

    requestCaseList(searchValue) {
        var that = this
        wx.showLoading({
            title: '请求数据中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SearchCaseList',
                openid: app.globalData.openid,
                center_id: this.data.centerId,
                keyword: searchValue,
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.SearchCaseList:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    for (var i = 0, len = res.data.data.list.length; i < len; i++) {
                        var caseInfo = res.data.data.list[i]
                        caseInfo.create_time = util.formatTime(caseInfo.create_time, 'Y-M-D')
                        caseInfo.isSelected = false
                    }
                    that.setData({
                        caseList: res.data.data.list
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
                wx.stopPullDownRefresh()
            }
        })
    },

    onInput: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },

    onItemClick(e) {
        var caseInfo = e.target.dataset.selecteditem
        for (var i = 0, length = this.data.caseList.length; i < length; i++) {
            this.data.caseList[i].isSelected = caseInfo.case_id == this.data.caseList[i].case_id
        }
        this.setData({
            caseList: this.data.caseList,
            selectedCaseInfo: caseInfo
        })
    },

    onPutClick() {
        var that = this
        wx.showLoading({
            title: '存放标本中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.PutSample',
                openid: app.globalData.openid,
                sample_id: this.data.specimenInfo.sample_id,
                case_id: this.data.selectedCaseInfo.case_id,
                msis: this.data.selectedCaseInfo.msis,
                type: this.data.selectedCaseInfo.type,
                remark: this.data.remark
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.PutSample:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: -1
                    });
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    reloadPrePage() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },

    onBackClick() {
        wx.navigateBack({
            delta: -1
        });
    }
});