'use strict';

let constant = require('../../utils/constant.js');
let regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        eventTopPosition: "80rpx"
    },
    onHide: function () {
        this.setData({
            modalName: ''
        });
    },
    onLoad: function () {
        this.initLogic();
    },
    initLogic: async function () {
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
    backToAuth: function () {
        wx.navigateTo({
            url: '../auth/auth'
        });
    },
});
