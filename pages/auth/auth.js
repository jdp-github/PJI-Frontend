'use strict';
const app = getApp();
let constant = require('../../utils/constant.js');

// 登录凭证校验失败
const LOGIN_VERIFY_FAIL = 1
// 未注册或未绑定
const UN_REGISTE = 2
// 账号冻结
const USER_FROZEN = 3
// 系统错误，用户没有申请记录
const NO_REGISTE = 4
// 用户申请中状态
const REQUESTING = 5
// 用户审批未通过状态
const UN_PASS = 6

Page({
    data: {
        avatarUrl: '',
        loadModal: false,
    },
    onLoad: function (options) {
        let that = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            app.globalData.avatarUrl = res.userInfo.avatarUrl;
                            that.setData({
                                avatarUrl: res.userInfo.avatarUrl
                            });
                        }
                    });
                }
            }
        });
    },
    onGetUserInfo: function (e) {
        let that = this;
        that.showLoading();
        // 同意授权
        if (e.detail.errMsg.indexOf('ok') != -1) {
            // 更新头像
            this.setData({
                avatarUrl: e.detail.userInfo.avatarUrl
            });
            app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
            app.globalData.nickName = e.detail.userInfo.nickName;
            // 微信登录
            wx.login({
                timeout: 1000 * 10, // 超时时间(ms)
                success(res) {
                    // console.log(res)
                    if (res.code) {
                        that.checkUserState(res.code, e.target.dataset.type)
                    } else {
                        that.showToast(res.errMsg);
                        that.hideLoading();
                    }
                },
                fail(res) {
                    that.showToast(res.errMsg);
                    that.hideLoading();
                }
            });
        } else {
            that.hideLoading();
        }
    },
    // 用户验权
    checkUserState: function (wxCode, type) {
        let that = this
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.CheckStaffStatus',
                code: wxCode
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    // 存储openid
                    app.globalData.openid = res.data.data.info.openid;
                    if (type == "login") { // 登录
                        that.login(res);
                    } else if (type == "register") { // 注册
                        that.register(res);
                    }
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    login: function (res) {
        let code = res.data.data.code;
        let that = this;
        if (code == constant.response_success) { // 已注册
            // 存储是否为管理员
            app.globalData.is_admin = res.data.data.info.is_admin;
            // 自己系统登录
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Staff.WxLogin',
                    openid: app.globalData.openid
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    that.hideLoading();
                    if (res.data.data.code == constant.response_success) {
                        wx.switchTab({
                            url: '../center/center'
                        });
                    } else {
                        that.showToast(res.data.data.msg);
                    }
                },
                fail(res) {
                    that.hideLoading();
                    that.showToast('登录出错');
                }
            });
        } else {
            that.hideLoading();
            that.showToast(res.data.data.msg);
        }
    },
    register: function (res) {
        this.hideLoading();
        let code = res.data.data.code;
        if (code == UN_REGISTE ||
            code == constant.response_success ||
            code == UN_PASS) { // 未注册 or 已注册 or 未通过注册
            wx.navigateTo({
                url: '../register/register'
            });
        } else if (code == REQUESTING) { // 注册中
            this.showToast(res.data.data.msg);
        } else if (code == LOGIN_VERIFY_FAIL) {
            this.showToast(res.data.data.msg);
        }
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
        this.setData({
            loadModal: false
        });
    }
});

