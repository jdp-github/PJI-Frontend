'use strict';

let constant = require('../../utils/constant.js');

const app = getApp();
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        name: '',
        tel: '',
        email: '',
        reason: '',
        multiArray: [
            [],
            []
        ],
        multiIndex: [0, 0],
        errMsg: ''
    },
    onLoad: function () {
        let that = this;
        // 中心列表
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetCenterList'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let current = that.data.multiArray;
                    current[0] = res.data.data.list;
                    that.setData({
                        multiArray: current
                    });
                }
            }
        });
        // 角色列表
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetCenterRole'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let current = that.data.multiArray;
                    current[1] = res.data.data.list;
                    that.setData({
                        multiArray: current
                    });
                }
            },
            fail(res) {
            }
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
    multiChange: function (e) {
        this.setData({
            multiIndex: e.detail.value
        });
    },
    multiColumnChange: function (e) {
        let data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        this.setData(data);
    },
    nameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    emailInput: function (e) {
        this.setData({
            email: e.detail.value
        });
    },
    telInput: function (e) {
        this.setData({
            tel: e.detail.value
        });
    },
    reasonInput: function (e) {
        this.setData({
            reason: e.detail.value
        });
    },
    formReset: function () {
        this.setData({
            name: '',
            tel: '',
            email: '',
            reason: '',
            errMsg: ''
        });
    },
    formSubmit: function () {
        this.setData({
            errMsg: ''
        });
        if (this.data.name.length == 0) {
            this.setData({
                errMsg: "请输入姓名"
            });
            return
        }
        if (this.data.email.length == 0) {
            this.setData({
                errMsg: "请输入邮箱"
            });
            return
        }
        if (this.data.tel.length == 0) {
            this.setData({
                errMsg: "请输入电话"
            });
            return
        }
        if (isTel(this.data.tel)) {
            this.setData({
                errMsg: "请输入正确的电话号码"
            });
            return
        }
        this.register();
    },
    register: function () {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.Apply',
                avatar: app.globalData.avatarUrl,
                name: that.data.name,
                phone: that.data.tel,
                email: that.data.email,
                center_id: that.data.multiArray[0][that.data.multiIndex[0]].id,
                role_id: that.data.multiArray[1][that.data.multiIndex[1]].id,
                apply_reason: that.data.reason,
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    wx.showToast({
                        icon: 'none',
                        title: '申请提交成功，请耐心等待',
                    });
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 2
                        });
                    }, 3000)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    });
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    }
});