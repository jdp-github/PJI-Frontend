"use strict";
import {
    $wuxToast
} from '../../miniprogram_npm/wux-weapp/index'

var constant = require('../constant.js');
var app = getApp();

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
                            wx.setStorage({
                                key: "avatarUrl",
                                data: res.userInfo.avatarUrl
                            })
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
        // 同意授权
        if (e.detail.errMsg.indexOf('ok') != -1) {
            console.log(e.detail.userInfo.avatarUrl)
            // 更新头像
            this.setData({
                avatarUrl: e.detail.userInfo.avatarUrl
            })
            // 微信登录
            wx.login({
                timeout: 1000 * 10, // 超时时间(ms)
                success(res) {
                    console.log(res)
                    if (res.code) {
                        that.checkUserState(res.code, e.target.dataset.type)
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        }
    },

    // 用户验权
    checkUserState(wxCode, type) {
        var that = this
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.CheckStaffStatus',
                phone: '12323544212', // TODO 
                code: wxCode
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // 存储是否为管理员
                app.globalData.is_admin = res.info.is_admin;
                // 存储openid
                app.globalData.openid = res.info.openid;
                if (type == "login") { // 登录
                    that.login(res)
                } else if (type == "registe") { // 注册
                    that.registe(res)
                }
            }
        })
    },

    login(res) {
        if (res.code == constant.un_registe) { // 未注册
            this.showToast("尚未申请使用，请点击[申请使用]")
        } else if (res.code == constant.un_pass) { // 未通过注册
            this.showToast("申请未通过，请点击[申请使用]")
        } else if (res.code == constant.requesting) { // 注册中
            this.showToast("申请审批中，请耐心等待")
        } else if (res.code == constant.response_success) { // 已注册
            wx.redirectTo({
                url: '../index/index',
            })
        }
    },
    registe(res) {
        if (res.code == constant.un_registe ||
            res.code == constant.response_success ||
            res.code == constant.un_pass) { // 未注册 or 已注册 or 未通过注册
            wx.navigateTo({
                url: '../register/register'
            })
        } else if (res.code == constant.requesting) { // 注册中
            this.showToast("申请审批中，请耐心等待")
        }
    },

    showToast(msg) {
        $wuxToast().show({
            duration: 1500,
            color: '#fff',
            text: msg
        })
    }
});