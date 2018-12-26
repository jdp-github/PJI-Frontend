"use strict";
Page({
    data: {
        avatar: ''
    },
    onLoad: function(options) {
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res)
                            wx.setStorage({
                                key: "avatar",
                                data: res.userInfo.avatar
                            })
                            // wx.switchTab({
                            //     url: '../index/index'
                            // })
                        }
                    })
                }
            }
        })
    },
    bindGetUserInfo: function(e) {
        console.log("bindGetUserInfo:" + JSON.stringify(e))
        // 同意授权
        if (e.detail.errMsg.indexOf('ok') != -1) {
            this.setData({
                avatar: e.detail.userInfo.avatar
            })
            wx.setStorage({
                key: "avatar",
                data: e.detail.userInfo.avatar
            })
            if (e.target.dataset.id == "login") {

            } else if (e.target.dataset.id == "registe") {
                wx.navigateTo({
                    url: '../register/register'
                })
            }
        }
    },
});