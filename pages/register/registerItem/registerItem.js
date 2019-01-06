"use strict";

var app = getApp();
var constant = require('../../../utils/constant.js');

Page({
    data: {
        // UI用
        currentRegister: [],
        currentApprove: [],
        segementedKey1: true,
        segementedKey2: false,
        // data
        registeList: [],
        approveList: []
    },

    onLoad() {
        this.requestRegiste()
    },

    onSegmentedChange(e) {
        console.log("onSegmentedChange")
        if (e.detail.key === 0) {
            this.setData({
                segementedKey1: true,
                segementedKey2: false
            });
        } else {
            this.setData({
                segementedKey1: false,
                segementedKey2: true
            });
        }
    },

    onRegisterChange(e) {
        console.log("onRegisterChange")
        this.setData({
            currentRegister: e.detail.key,
        })
        this.requestRegiste()
    },

    onApproveChange(e) {
        console.log("onApproveChange")
        this.setData({
            currentApprove: e.detail.key,
        })
        this.requestApprove()
    },

    // 我的申请
    requestRegiste() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
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
                wx.hideLoading()
                that.setData({
                    registeList: res.data.data.list
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 需我审批
    requestApprove() {
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
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
                wx.hideLoading()
                that.setData({
                    approveList: res.data.data.list
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 批准
    onApprove(e) {
        wx.showLoading({
            title: '请求中...',
        })
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
                wx.hideLoading()
                // TODO
                that.requestApprove();
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 拒绝
    onRefuse(e) {
        var that = this
        wx.showLoading({
            title: '请求中...',
        })
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
                wx.hideLoading()
                // TODO
                that.requestApprove();
            },
            fail(res) {
                wx.hideLoading()
            }
        })

    }
});