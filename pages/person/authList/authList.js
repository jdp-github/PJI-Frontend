'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');
const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        approveList: []
    },

    onLoad: function () {
        this.loadProgress();
        this.requestApprove();
        this.completeProgress();
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
    showToast: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },

    requestApprove: function () {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Staff.GetApproveList',
                    openid: app.globalData.openid
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    if (res.data.data.code == constant.response_success) {
                        for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                            let approveInfo = res.data.data.list[i];
                            approveInfo.apply_time = util.formatTime(approveInfo.apply_time, 'Y-M-D');
                        }
                        that.setData({
                            approveList: res.data.data.list,
                            approveCount: res.data.data.list.length
                        });
                    } else {
                        that.showToast(res.data.data.msg);
                    }
                    // that.completeProgress();
                    resolve(res);
                },
                fail(res) {
                    // that.completeProgress();
                    reject(res);
                }
            });
        });
    },
    onApprove: function (e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.Approve',
                openid: app.globalData.openid,
                apply_id: e.target.dataset.applyid,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    // that.requestRegister();
                    that.requestApprove();
                    that.reloadPrePage()
                } else {
                    that.showToast(res.data.data.msg);
                }
                that.hideLoading();
            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.msg);
            }
        });
    },
    onRefuse: function (e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.Approve',
                openid: app.globalData.openid,
                apply_id: e.target.dataset.applyid,
                type: 2
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    // that.requestRegister();
                    that.requestApprove();
                    that.reloadPrePage()
                } else {
                    that.showToast(res.data.data.msg);
                }
                that.hideLoading();
            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.msg);
            }
        });
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
})