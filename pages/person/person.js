"use strict";
const app = getApp();
Page({
    data: {
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo
            });
        } else if (this.data.canIUse){
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo
                });
            }
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo
                    });
                }
            });
        }
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo
        });
    }
});