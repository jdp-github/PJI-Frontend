"use strict";

var app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

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

  onPullDownRefresh() {
    this.requestRegiste()
  },

  onSegmentedChange(e) {
    console.log("onSegmentedChange:" + JSON.stringify(e))
    if (e.detail.key === 0) {
      this.setData({
        segementedKey1: true,
        segementedKey2: false
      });
      this.requestRegiste()
    } else {
      this.setData({
        segementedKey1: false,
        segementedKey2: true
      });
      this.requestApprove()
    }
  },

  onRegisterChange(e) {
    // console.log("onRegisterChange")
    this.setData({
      currentRegister: e.detail.key,
    })
    // this.requestRegiste()
  },

  onApproveChange(e) {
    // console.log("onApproveChange")
    this.setData({
      currentApprove: e.detail.key,
    })
    // this.requestApprove()
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
        console.log("Staff.GetApplyList:" + JSON.stringify(res))
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.data.code == constant.response_success) {
          for (var i = 0, len = res.data.data.list.length; i < len; i++) {
            var applyInfo = res.data.data.list[i]
            applyInfo.apply_time = util.formatTime(applyInfo.apply_time, 'Y-M-D')
          }
          that.setData({
            registeList: res.data.data.list
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
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
        console.log("Staff.GetApproveList:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          for (var i = 0, len = res.data.data.list.length; i < len; i++) {
            var approveInfo = res.data.data.list[i]
            approveInfo.apply_time = util.formatTime(approveInfo.apply_time, 'Y-M-D')
          }
          that.setData({
            approveList: res.data.data.list
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  // 批准
  onApprove(e) {
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
        type: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Staff.Approve:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.requestApprove();
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
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
        console.log("Staff.Approve:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.requestApprove();
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  }
});