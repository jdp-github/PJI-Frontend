"use strict";
const app = getApp();
var constant = require('../../utils/constant.js');
const buttons = [{
    label: '我的申请',
    className: "apply-btn",
    icon: "data:image/png;base64,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"
}, ];
Page({
    data: {
        avatarUrl: '',
        userInfo: {},
        buttons
    },
    onLoad: function() {
        this.setData({
            avatarUrl: app.globalData.avatarUrl
        })
        this.requestUserInfo();
    },

    onApplyClick(e) {
        console.log(e)
        if (e.detail.index == 0) {
            wx.navigateTo({
                url: '../register/registerItem/registerItem',
            })
        }
    },

    requestUserInfo() {
        var that = this
        wx.showLoading({
            title: '请求数据中...',
            mask: true
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.GetStaffInfo',
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        userInfo: res.data.data.info
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    }

});