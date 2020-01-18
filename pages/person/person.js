'use strict';

let constant = require('../../utils/constant.js');
let util = require('../../utils/util.js');
let regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');

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
    onHide: function() {
        this.setData({
            modalName: ''
        });
    },
    onShow: function() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1,
                emitter: app.globalData.emitter
            });
            app.globalData.emitter.on('addEmitter', () => {
                console.log("person modal");
            });
        }
        this.onLoad();
    },
    onLoad: function() {
        this.setData({
            avatarUrl: app.globalData.avatarUrl,
            nickName: app.globalData.nickName
        });
        this.init();
    },
    init: async function() {
        await this.requestUserInfo();
        // await this.requestRegister();
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
    loadProgress: function() {
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
    completeProgress: function() {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function(msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function() {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function() {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    backToAuth: function() {
        wx.navigateTo({
            url: '../auth/auth'
        });
    },
    showDrawer: function(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
        if (this.data.modalName == 'SpecimenDrawer') {
            this.requestApplySpecimenAuth();
            this.requestApproveSpecimenAuth();
        } else {
            this.requestApprove();
        }
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    tabSelect: function(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        });
    },
    ignoreTap: function(e) {},

    requestUserInfo: function() {
        let that = this;
        return new Promise((resolve, reject) => {
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
                    if (res.data.data.code == constant.response_success) {
                        that.setData({
                            userInfo: res.data.data.info,
                            centerCount: res.data.data.info.center_list.length
                        });
                    } else {
                        that.showToast(res.data.data.msg);
                    }
                    resolve(res);
                },
                fail(res) {
                    reject(res);
                }
            });
        });
    },
    requestRegister: function() {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Staff.GetApplyList',
                    openid: app.globalData.openid
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    if (res.data.data.code == constant.response_success) {
                        for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                            let applyInfo = res.data.data.list[i];
                            applyInfo.apply_time = util.formatTime(applyInfo.apply_time, 'Y-M-D');
                        }
                        that.setData({
                            registerList: res.data.data.list,
                            registerCount: res.data.data.list.length
                        });
                    } else {
                        that.showToast(res.data.data.msg);
                    }
                    resolve(res);
                },
                fail(res) {
                    reject(res);
                }
            });
        });
    },
    requestApprove: function() {
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
    onApprove: function(e) {
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
    onRefuse: function(e) {
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
    gotoSpecimenAuth() {
        wx.navigateTo({
            url: '../person/specimenAuth/specimenAuth'
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
});