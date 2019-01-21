"use strict";
import {
  $wuxToast
} from '../../miniprogram_npm/wux-weapp/index'

var constant = require('../../utils/constant.js');
var app = getApp();

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
  },
  onLoad: function(options) {
    var that = this
    // 获取头像
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },

  bindGetUserInfo: function(e) {
    // console.log("bindGetUserInfo:" + JSON.stringify(e))
    var that = this
    wx.showLoading({
      title: '数据加载中...',
    })
    // 同意授权
    if (e.detail.errMsg.indexOf('ok') != -1) {
      // 更新头像
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl
      })
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      // 微信登录
      wx.login({
        timeout: 1000 * 10, // 超时时间(ms)
        success(res) {
          // console.log(res)
          if (res.code) {
            that.checkUserState(res.code, e.target.dataset.type)
          } else {
            that.showToast(res.errMsg)
            wx.hideLoading()
            console.log('登录失败！' + res.errMsg)
          }
        },
        fail(res) {
          that.showToast(res.errMsg)
          wx.hideLoading()
        }
      })
    } else {
      wx.hideLoading()
    }
  },

  // 用户验权
  checkUserState(wxCode, type) {
    var that = this
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
        console.log("Staff.CheckStaffStatus:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          // 存储openid
          app.globalData.openid = res.data.data.info.openid;
          if (type == "login") { // 登录
            that.login(res)
          } else if (type == "registe") { // 注册
            that.registe(res)
          }
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

  login(res) {
    console.log(JSON.stringify(res))
    var code = res.data.data.code
    var that = this
    // if (code == UN_REGISTE) { // 未注册
    //   wx.hideLoading()
    //   this.showToast("尚未申请使用，请点击申请使用")
    // } else if (code == LOGIN_VERIFY_FAIL) { // 登录凭证校验失败
    //   wx.hideLoading()
    //   this.showToast("登录凭证校验失败")
    // } else if (code == UN_PASS) { // 未通过注册
    //   wx.hideLoading()
    //   this.showToast("申请未通过，请点击申请使用")
    // } else if (code == REQUESTING) { // 注册中

    // } else 
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
          console.log("Staff.WxLogin:" + JSON.stringify(res))
          wx.hideLoading()
          if (res.data.data.code == constant.response_success) {
            wx.switchTab({
              url: '../index/index'
            })
          } else {
            that.showToast(res.data.data.msg)
          }

        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '登录出错',
          })
        }
      })
    } else {
      wx.hideLoading()
      this.showToast(res.data.data.msg)
    }
  },

  registe(res) {
    wx.hideLoading()
    var code = res.data.data.code
    if (code == UN_REGISTE ||
      code == constant.response_success ||
      code == UN_PASS) { // 未注册 or 已注册 or 未通过注册
      wx.navigateTo({
        url: '../register/register'
      })
    } else if (code == REQUESTING) { // 注册中
      this.showToast(res.data.data.msg)
    } else if (code == LOGIN_VERIFY_FAIL) {
      this.showToast(res.data.data.msg)
    }
  },

  showToast(msg) {
    wx.showToast({
      icon: 'none',
      title: msg,
    })
  },
});