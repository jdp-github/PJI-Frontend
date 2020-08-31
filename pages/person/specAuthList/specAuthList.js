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
        emitter: null,
        userInfo: {},
        avatarUrl: '',
        nickName: '',
        registerList: [],
        approveList: [],
        centerCount: 0,
        registerCount: 0,
        approveCount: 0,
        TabCur: 0,
        tabItems: ['我的申请', '需我授权'],

        specimenApplyList: [],
        specimenApproveList: []
    },
    onLoad: function () {
        this.loadProgress();
        this.init();
        this.completeProgress();
    },
    init: function () {
        this.requestApplySpecimenAuth();
        this.requestApproveSpecimenAuth();
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
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
    showDrawer: function (e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
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

    
    gotoSpecimenAuth() {
        wx.navigateTo({
            url: '../specimenAuth/specimenAuth'
        });
    },
    requestApplySpecimenAuth() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SampleAuthList',
                openid: app.globalData.openid,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let list = res.data.data.list
                    list.forEach(item => {
                        item.apply_time = util.formatTime(item.apply_time, 'Y-M-D');
                        item.auth_time = util.formatTime(item.auth_time, 'Y-M-D');
                        item.state_name = item.state == 0 ? '申请中' : item.state == 1 ? "成功" : "驳回"
                    })
                    that.setData({
                        specimenApplyList: list
                    })
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
    requestApproveSpecimenAuth() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SampleAuthList',
                openid: app.globalData.openid,
                type: 2
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let list = res.data.data.list
                    list.forEach(item => {
                        item.apply_time = util.formatTime(item.apply_time, 'Y-M-D');
                        item.state_name = item.state == 0 ? '申请中' : item.state == 1 ? "成功" : "驳回"
                    })
                    that.setData({
                        specimenApproveList: list
                    })
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
    onSpecimenApprove(e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.ApproveSampleAuth',
                openid: app.globalData.openid,
                auth_id: e.currentTarget.dataset.authid,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.requestApproveSpecimenAuth()
                    that.requestUserInfo()
                } else {
                    that.showToast(res.data.msg);
                }
                that.hideLoading();
            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.data.msg);
            }
        });
    },
    onSpecimenRefuse(e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.ApproveSampleAuth',
                openid: app.globalData.openid,
                auth_id: e.currentTarget.dataset.authid,
                type: 2
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.requestApproveSpecimenAuth()
                    that.requestUserInfo()
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
    }
})