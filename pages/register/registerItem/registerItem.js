"use strict";

var app = getApp();

Page({
    data: {
        currentRegister: [],
        currentApprove: [],
        segementedKey1: true,
        segementedKey2: false
    },
    onLoad() {
        
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
    },
    onApproveChange(e) {
        console.log("onApproveChange")
        this.setData({
            currentApprove: e.detail.key,
        })
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
				token: app.globalData.openid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				wx.hideLoading()

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
				token: app.globalData.openid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				wx.hideLoading()

			},
			fail(res) {
				wx.hideLoading()
			}
		})
    }
});