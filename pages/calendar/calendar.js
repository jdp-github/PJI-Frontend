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
        eventTopPosition: "80rpx",
        weekRow: [1,2,3,4,5,6,7],
        weekList: [],
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
        this.requestCalendar();
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
    requestCalendar: function () {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Calendar',
                case_id: 248,
                month: '2020-01',
                openid: 'oBwtp5EKSdNIL8jXX86k__ITR6vQ'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetDoctorList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                            weekList: res.data.data.list
                        }
                    )
                } else {
                    that.showToast(res.data.msg);
                }

            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.msg);
            }
        });
    }
});
