'use strict';

let constant = require('../../utils/constant.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
    },
    loadProgress: function () {
        if (this.data.loadProgress < 96) {
            this.setData({
                loadProgress: this.data.loadProgress + 3
            });
        }
        if (this.data.loadProgress < 100) {
            setTimeout(() => {
                this.loadProgress();
            }, 100);
        } else {
            this.setData({
                loadProgress: 0
            });
        }
    },
    completeProgress: function () {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function () {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function () {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    onClickMember: function (e) {
        wx.navigateTo({
            url: '../center/member/member?centerId=' + e.target.dataset.centerid
        });
    },
    onClickSpecimen: function (e) {
        console.log("specimen");
    },
    navigateToCenter: function (e) {
        wx.navigateTo({
            url: '../center/center'
        });
    },
    navigateToStats: function (e) {
        wx.navigateTo({
            url: '../stats/stats'
        });
    },
    navigateToService: function (e) {
        wx.navigateTo({
            url: '../service/service'
        });
    },
    navigateToPerson: function (e) {
        wx.navigateTo({
            url: '../person/person'
        });
    }
});