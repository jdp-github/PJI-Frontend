"use strict";
Page({
    data: {
        avatarUrl: ''
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
                                key: "avatarUrl",
                                data: res.userInfo.avatarUrl
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
        // console.log("bindGetUserInfo:" + JSON.stringify(e))
        // 同意授权
        if (e.detail.errMsg.indexOf('ok') != -1) {
            console.log(e.detail.userInfo.avatarUrl)
            this.setData({
                avatarUrl: e.detail.userInfo.avatarUrl
            })
            wx.setStorage({
                key: "avatarUrl",
                data: e.detail.userInfo.avatarUrl
            })
            if (e.target.dataset.id == "login") {
                wx.redirectTo({
                    url: '../index/index',
                })
            } else if (e.target.dataset.id == "registe") {
                wx.navigateTo({
                    url: '../register/register'
                })
            }
        }
    },
});